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

use futures::stream::Stream;
use std::pin::Pin;
use futures::task::{Context, Poll};

pub struct ChatStream {
  inner: Pin<Box<dyn Stream<Item = Result<bytes::Bytes, reqwest::Error>> + Send + Unpin>>,
}

impl ChatStream {
  pub async fn new(messages: Vec<OllamaMessage>, model: String) -> Self {
    let res = Client::new().post(format!("{OLLAMA_URL}chat")).body(
      serde_json::json!({
        "model": model,
        "messages": messages,
      }).to_string()
    ).send().await.unwrap().bytes_stream();

    Self { inner: Box::pin(res) }
  }
}

impl Stream for ChatStream {
  type Item = OllamaResponse;

  fn poll_next(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
    match self.get_mut().inner.as_mut().poll_next(cx) {
      Poll::Ready(Some(Ok(bytes))) => Poll::Ready(
        Some(serde_json::from_slice::<OllamaResponse>(&bytes).unwrap())
      ),
      Poll::Ready(None) | Poll::Ready(Some(Err(_))) => Poll::Ready(None),
      Poll::Pending => Poll::Pending,
    }
  }
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
  let res = reqwest::get(format!("{OLLAMA_URL}tags"))
    .await.unwrap().text().await.unwrap();

  serde_json::from_str(&res).unwrap()
}
