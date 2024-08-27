use serde::{Serialize, Deserialize};
use reqwest::Client;

const OLLAMA_URL: &str = "http://localhost:11434/api/";

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all="lowercase")]
pub enum Role {
  System,
  User,
  Assistant,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct OllamaMessage {
  pub role: Role,
  pub content: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct OllamaResponse {
  pub message: OllamaMessage,
}

pub async fn chat(system: String, mut messages: Vec<OllamaMessage>, model: String) -> OllamaResponse {
  messages.insert(0, OllamaMessage {
    role: Role::System,
    content: system,
  });

  let res = Client::new().post(format!("{OLLAMA_URL}chat")).body(
    serde_json::json!({
      "model": model,
      "messages": messages,
      "stream": false,
    }).to_string()
  ).send().await.unwrap().text().await.unwrap();

  println!("{}", res);

  serde_json::from_str(&res).unwrap()
}

#[derive(Clone, Serialize, Deserialize)]
pub struct OllamaModel {
  pub name: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct OllamaModels {
  pub models: Vec<OllamaModel>,
}

pub async fn list_models() -> OllamaModels {
  let res = Client::new().get(format!("{OLLAMA_URL}tags"))
    .send().await.unwrap().text().await.unwrap();

  serde_json::from_str(&res).unwrap()
}
