use std::sync::{Arc, Mutex};
use futures::StreamExt;
use teloxide::{prelude::{Bot, Message, Requester}, types};
use crate::ollama::api::{ChatStream, Role, OllamaMessage};

pub type BotChats = Arc<Mutex<Vec<(types::ChatId, Vec<OllamaMessage>)>>>;

pub async fn handle_message(
  bot: Bot,
  bot_chats: BotChats,
  msg: Message,
  system: String,
  allowed_ids: Vec<types::UserId>,
  model: String,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
  let chat_id = msg.chat.id;

  let (Some(message_author), Some(message_text)) = (&msg.from, msg.text()) else {
    return Ok(()); // Ignore non-text messages and channels
  };

  if !allowed_ids.contains(&message_author.id) {
    return Ok(()); // Ignore messages from not allowed users
  }

  let mut message_history = match bot_chats.lock().unwrap().iter().find(|(id, _)| id == &chat_id) {
    Some(chat) => chat.1.clone(),
    None => vec![
      OllamaMessage {
        role: Role::System,
        content: system,
      },
    ]
  };

  message_history.push(OllamaMessage {
    role: Role::User,
    content: message_text.into(),
  });

  // Get response from Ollama and send it to telegram
  let mut res_stream = ChatStream::new(message_history.clone(), model).await;

  let mut final_text = res_stream.next().await.unwrap().message.content;
  let msg_id = bot.send_message(chat_id, &final_text).await?.id;

  let mut counter = 0;
  while let Some(res) = res_stream.next().await {
    counter += 1;
    final_text.push_str(&res.message.content);

    if counter % 2 == 0 { // in order to avoid telegram rate limits
      bot.edit_message_text(chat_id, msg_id, &final_text).await?;
    }
  }

  if counter % 2 != 0 { // append missing final part if it exists
    bot.edit_message_text(chat_id, msg_id, &final_text).await?;
  }

  // Save new chat messages
  let mut bot_chats = bot_chats.lock().unwrap();

  message_history.push(OllamaMessage {
    role: Role::Assistant,
    content: final_text,
  });

  if let Some(chat_index) = bot_chats.iter().position(|(id, _)| id == &chat_id) {
    bot_chats[chat_index].1 = message_history;
  } else {
    bot_chats.push((chat_id, message_history));
  }

  Ok(())
}
