use futures::{
  stream::Stream,
  task::{Context, Poll},
};
use reqwest::{Client, Error};
use serde::{Deserialize, Serialize};
use std::pin::Pin;

const OLLAMA_URL: &str = "http://localhost:11434/api/";

#[derive(Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Role {
  System,
  User,
  #[default]
  Assistant,
}

#[derive(Default, Clone, Serialize, Deserialize)]
pub struct OllamaMessage {
  pub role: Role,
  pub content: String,
}

#[derive(Default, Deserialize)]
pub struct OllamaResponse {
  pub message: OllamaMessage,
}

pub struct ChatStream(Pin<Box<dyn Stream<Item = Result<bytes::Bytes, Error>> + Send + Unpin>>);

impl ChatStream {
  pub async fn new(messages: &Vec<OllamaMessage>, model: &str) -> Result<Self, Error> {
    Client::new()
      .post(format!("{OLLAMA_URL}chat"))
      .body(
        serde_json::json!({
          "model": model,
          "messages": messages,
        })
        .to_string(),
      )
      .send()
      .await
      .map(|res| Self(Box::pin(res.bytes_stream())))
  }
}

impl Stream for ChatStream {
  type Item = OllamaResponse;

  fn poll_next(mut self: Pin<&mut ChatStream>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
    match self.0.as_mut().poll_next(cx) {
      Poll::Ready(Some(Ok(bytes))) => {
        Poll::Ready(Some(serde_json::from_slice(&bytes).unwrap_or_default()))
      }
      Poll::Ready(None) | Poll::Ready(Some(Err(_))) => Poll::Ready(None),
      Poll::Pending => Poll::Pending,
    }
  }
}

#[derive(Deserialize)]
pub struct OllamaModel {
  pub name: String,
}

#[derive(Default, Deserialize)]
pub struct OllamaModels {
  pub models: Vec<OllamaModel>,
}

pub async fn list_models() -> OllamaModels {
  match reqwest::get(format!("{OLLAMA_URL}tags")).await {
    Ok(res) => res.json().await.unwrap(),
    _ => OllamaModels::default(),
  }
}
