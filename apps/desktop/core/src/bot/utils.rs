use crate::ollama::api::OllamaMessage;
use std::sync::Mutex;

pub struct BotConfig {
  pub allowed_ids: Vec<String>,
  pub model: String,
  pub system: String,
  pub bot_chats: Mutex<Vec<(String, Vec<OllamaMessage>)>>,
}

pub const BATCHING_MILLIS: u64 = 1100;
