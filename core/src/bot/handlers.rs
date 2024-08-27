use std::sync::{Arc, Mutex};
use teloxide::prelude::{Bot, Message, Requester};
use crate::ollama::api::{self, OllamaMessage};

pub type BotChats = Arc<Mutex<Vec<(String, Vec<OllamaMessage>)>>>;

pub async fn handle_message(
  bot: Bot,
  bot_chats: BotChats,
  msg: Message,
  system: String,
  allowed_ids: Vec<String>,
  model: String,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
  if let (Some(message_author), Some(message_text)) = (&msg.from, msg.text()) {
    if !allowed_ids.contains(&message_author.id.to_string()) {
      return Ok(()); // Ignore messages from not allowed users
    }

    let mut message_history = { // Try to restore message history or create new one
      let user_message = OllamaMessage {
        role: api::Role::User,
        content: message_text.into(),
      };

      match bot_chats.lock().unwrap().iter().find(|(id, _)| id == &msg.chat.id.to_string()) {
        Some(chat) => {
          let mut restored_messages = chat.1.clone();
          restored_messages.push(user_message);

          restored_messages
        },
        _ => vec![user_message],
      }
    };

    // Get response from Ollama and send it to telegram
    let res = api::chat(system, message_history.clone(), model).await.message;

    bot.send_message(msg.chat.id, res.clone().content).await?;

    // Save new chat messages
    let mut bot_chats = bot_chats.lock().unwrap();

    message_history.push(res);

    if let Some(chat_index) = bot_chats.iter().position(|(id, _)| id == &msg.chat.id.to_string()) {
      bot_chats[chat_index].1 = message_history;
    } else {
      bot_chats.push((msg.chat.id.to_string(), message_history));
    }
  }

  Ok(())
}
