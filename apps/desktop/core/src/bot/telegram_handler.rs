use super::utils::{BotConfig, BATCHING_MILLIS};
use crate::ollama::api::{ChatStream, OllamaMessage, Role};
use futures::StreamExt;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use teloxide::prelude::{Bot, Message, Requester};

pub async fn handle_message(
  bot: Bot,
  config: std::sync::Arc<BotConfig>,
  msg: Message,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
  let (Some(message_author), Some(message_text)) = (&msg.from, msg.text()) else {
    return Ok(()); // Ignore non-text messages and channels
  };

  let chat_id = msg.chat.id;
  let chat_str = chat_id.to_string();

  let BotConfig {
    allowed_ids,
    model,
    system,
    bot_chats,
  } = &*config;

  if !allowed_ids.contains(&message_author.id.to_string()) {
    return Ok(()); // Ignore messages from not allowed users
  }

  let mut message_history = match bot_chats
    .lock()
    .unwrap()
    .iter()
    .find(|(id, _)| id == &chat_str)
  {
    Some(chat) => chat.1.clone(),
    None => vec![OllamaMessage {
      role: Role::System,
      content: system.into(),
    }],
  };

  message_history.push(OllamaMessage {
    role: Role::User,
    content: message_text.into(),
  });

  // Get response from Ollama and send it to telegram
  let Ok(mut res_stream) = ChatStream::new(&message_history, model).await else {
    bot
      .send_message(chat_id, "ERROR: Failed to connect to Ollama server!")
      .await?;
    return Ok(());
  };

  let mut ai_response = res_stream.next().await.unwrap().message;
  let msg_id = bot.send_message(chat_id, &ai_response.content).await?.id;

  let mut start_time = SystemTime::now().duration_since(UNIX_EPOCH).unwrap();
  while let Some(res) = res_stream.next().await {
    ai_response.content.push_str(&res.message.content);

    let current_time = SystemTime::now().duration_since(UNIX_EPOCH).unwrap();

    // in order to avoid telegram rate limits
    if current_time - start_time > Duration::from_millis(BATCHING_MILLIS) {
      bot
        .edit_message_text(chat_id, msg_id, &ai_response.content)
        .await?;
      start_time = current_time;
    }
  }

  if start_time.as_millis() % BATCHING_MILLIS as u128 != 0 {
    // append missing final part if it exists
    bot
      .edit_message_text(chat_id, msg_id, &ai_response.content)
      .await?;
  }

  // Save new chat messages
  let mut bot_chats = bot_chats.lock().unwrap();

  message_history.push(ai_response);

  if let Some(chat_index) = bot_chats.iter().position(|(id, _)| id == &chat_str) {
    bot_chats[chat_index].1 = message_history;
  } else {
    bot_chats.push((chat_str, message_history));
  }

  Ok(())
}
