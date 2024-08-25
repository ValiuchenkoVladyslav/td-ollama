use serde::{Serialize, Deserialize};
use reqwest::Client;

const OLLAMA_URL: &str = "http://localhost:11434/api/";

#[derive(Serialize, Deserialize)]
pub struct OllamaMessage {
  pub role: String,
  pub content: String,
}

#[derive(Deserialize)]
pub struct OllamaResponse {
  pub message: OllamaMessage,
}

pub async fn chat(system: String, message: String, model: String) -> OllamaResponse {
  let res = Client::new().post(format!("{OLLAMA_URL}chat")).body(
    serde_json::json!({
      "model": model,
      "messages": [
        {
          "role": "system",
          "content": system,
        },
        {
          "role": "user",
          "content": message,
        },
      ],
      "stream": false,
    }).to_string()
  ).send().await.unwrap().text().await.unwrap();

  // TODO: Eror handling
  // "{\"error\":\"model \\\"llama3.1\\\" not found, try pulling it first\"}" 

  serde_json::from_str(&res).unwrap()
}

#[derive(Serialize, Deserialize)]
pub struct OllamaModel {
  pub name: String,
}

#[derive(Serialize, Deserialize)]
pub struct OllamaModels {
  pub models: Vec<OllamaModel>,
}

pub async fn list_models() -> OllamaModels {
  let res = Client::new().get(format!("{OLLAMA_URL}tags"))
    .send().await.unwrap().text().await.unwrap();

  serde_json::from_str(&res).unwrap()
}
