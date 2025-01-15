use super::utils::{current_time, BotConfig, BATCHING_MILLIS};
use crate::ollama::api::{ChatStream, OllamaMessage, Role};
use futures::StreamExt;
use teloxide::prelude::{Bot, Message, Requester};

pub async fn handle_message(
  bot: Bot,
  config: std::sync::Arc<BotConfig>,
  msg: Message,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
  let (Some(message_author), Some(message_text)) = (&msg.from, msg.text()) else {
    return Ok(()); // Ignore non-text messages and channels
  };

  let BotConfig {
    allowed_ids,
    model,
    system,
    bot_chats,
  } = &*config;

  if !allowed_ids.contains(&message_author.id.to_string()) {
    return Ok(()); // Ignore messages from not allowed users
  }

  let chat_id = msg.chat.id;

  let mut message_history = bot_chats
    .lock()
    .get(&chat_id.0)
    .unwrap_or(&vec![OllamaMessage {
      role: Role::System,
      content: system.into(),
    }])
    .clone();

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

  let mut start_time = current_time();
  while let Some(res) = res_stream.next().await {
    ai_response.content.push_str(&res.message.content);

    let current_time = current_time();

    // in order to avoid telegram rate limits
    if current_time - start_time > std::time::Duration::from_millis(BATCHING_MILLIS) {
      bot
        .edit_message_text(chat_id, msg_id, &ai_response.content)
        .await?;
      start_time = current_time;
    }
  }

  // append missing final part if it exists
  if start_time.as_millis() % BATCHING_MILLIS as u128 != 0 {
    bot
      .edit_message_text(chat_id, msg_id, &ai_response.content)
      .await?;
  }

  message_history.push(ai_response);

  bot_chats.lock().insert(chat_id.0, message_history);

  Ok(())
}
