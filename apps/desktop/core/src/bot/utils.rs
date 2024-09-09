use std::sync::Mutex;
use crate::ollama::api::OllamaMessage;

pub struct BotConfig {
  pub allowed_ids: Vec<String>,
  pub model: String,
  pub system: String,
  pub bot_chats: Mutex<Vec<(String, Vec<OllamaMessage>)>>,
}
