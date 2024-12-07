use crate::ollama::api::OllamaMessage;
use std::{
  collections::HashMap,
  sync::Mutex,
  time::{Duration, SystemTime, UNIX_EPOCH},
};

pub struct BotConfig {
  pub allowed_ids: Vec<String>,
  pub model: String,
  pub system: String,
  pub bot_chats: Mutex<HashMap<i64, Vec<OllamaMessage>>>,
}

pub const BATCHING_MILLIS: u64 = 400;

pub fn current_time() -> Duration {
  SystemTime::now().duration_since(UNIX_EPOCH).unwrap()
}
