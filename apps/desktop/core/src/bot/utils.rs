use std::sync::{Arc, Mutex};
use crate::ollama::api::OllamaMessage;

pub type BotChats = Arc<Mutex<Vec<(String, Vec<OllamaMessage>)>>>;
