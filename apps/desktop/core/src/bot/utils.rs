use crate::ollama::api::OllamaMessage;
use std::{
  sync::Mutex,
  time::{Duration, SystemTime, UNIX_EPOCH},
};

pub struct BotConfig {
  pub allowed_ids: Vec<String>,
  pub model: String,
  pub system: String,
  pub bot_chats: Mutex<Vec<(String, Vec<OllamaMessage>)>>,
}

pub const BATCHING_MILLIS: u64 = 400;

pub fn get_current_time() -> Duration {
  SystemTime::now().duration_since(UNIX_EPOCH).unwrap()
}
