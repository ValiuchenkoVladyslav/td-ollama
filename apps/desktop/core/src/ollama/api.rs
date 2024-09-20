use futures::{
  stream::Stream,
  task::{Context, Poll},
};
use reqwest::{Client, Error};
use serde::{Deserialize, Serialize};
use std::pin::Pin;

const OLLAMA_URL: &str = "http://localhost:11434/api/";

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
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

pub struct ChatStream {
  inner: Pin<Box<dyn Stream<Item = Result<bytes::Bytes, Error>> + Send + Unpin>>,
}

impl ChatStream {
  pub async fn new(
    messages: &Vec<OllamaMessage>,
    model: impl Into<String> + Serialize,
  ) -> Result<Self, Error> {
    match Client::new()
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
    {
      Ok(res) => Ok(Self {
        inner: Box::pin(res.bytes_stream()),
      }),
      Err(err) => Err(err),
    }
  }
}

impl Stream for ChatStream {
  type Item = OllamaResponse;

  fn poll_next(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
    match self.get_mut().inner.as_mut().poll_next(cx) {
      Poll::Ready(Some(Ok(bytes))) => Poll::Ready(Some(serde_json::from_slice(&bytes).unwrap_or(
        OllamaResponse {
          message: OllamaMessage {
            role: Role::Assistant,
            content: "".to_string(),
          },
        },
      ))),
      Poll::Ready(None) | Poll::Ready(Some(Err(_))) => Poll::Ready(None),
      Poll::Pending => Poll::Pending,
    }
  }
}

#[derive(Clone, Serialize, Deserialize)]
pub struct OllamaModel {
  pub name: String,
}

#[derive(Default, Clone, Serialize, Deserialize)]
pub struct OllamaModels {
  pub models: Vec<OllamaModel>,
}

pub async fn list_models() -> OllamaModels {
  match reqwest::get(format!("{OLLAMA_URL}tags")).await {
    Ok(res) => res.json().await.unwrap(),
    _ => OllamaModels::default(),
  }
}
