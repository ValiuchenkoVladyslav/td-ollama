const OLLAMA_URL: &str = "http://localhost:11434/api/";

#[derive(serde::Deserialize)]
pub struct OllamaMessage {
  // pub role: String,
  pub content: String,
}

#[derive(serde::Deserialize)]
pub struct OllamaResponse {
  pub message: OllamaMessage,
}

pub async fn chat(message: String, model: String) -> OllamaResponse {
  let res = reqwest::Client::new().post(format!("{OLLAMA_URL}chat")).body(
    serde_json::json!({
      "model": model,
      "messages": [
        {
          "role": "user",
          "content": message,
        },
      ],
      "stream": false,
    }).to_string()
  ).send().await.unwrap();

  serde_json::from_str(&res.text().await.unwrap()).unwrap()
}
