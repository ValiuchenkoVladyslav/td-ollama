use crate::ollama::api::OllamaMessage;
use parking_lot::Mutex;
use std::{
  collections::HashMap,
  time::{Duration, SystemTime, UNIX_EPOCH},
};

pub struct BotConfig {
  pub allowed_ids: Vec<String>,
  pub model: String,
  pub system: String,
  pub bot_chats: Mutex<HashMap<i64, Vec<OllamaMessage>>>,
}

pub const BATCHING_MILLIS: Duration = Duration::from_millis(400);

pub fn current_time() -> Duration {
  SystemTime::now().duration_since(UNIX_EPOCH).unwrap()
}
