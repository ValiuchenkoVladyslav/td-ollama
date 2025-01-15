use super::utils::{current_time, BotConfig, BATCHING_MILLIS};
use crate::ollama::api::{ChatStream, OllamaMessage, Role};
use futures::StreamExt;
use serenity::all::{async_trait, Context, EditMessage, EventHandler, Message};
use std::time::Duration;

/// after testing i found out that discord's rate limits are slightly stricter than telegram's
const DS_BATCHING_MILLIS: Duration = BATCHING_MILLIS.saturating_mul(2);

pub struct BotConfigData;

impl serenity::prelude::TypeMapKey for BotConfigData {
  type Value = BotConfig;
}

pub struct DiscordHandler;

#[async_trait]
impl EventHandler for DiscordHandler {
  async fn message(&self, ctx: Context, msg: Message) {
    if msg.content.is_empty() {
      return; // Ignore non-text messages
    }

    let bot_data = ctx.data.read().await;
    let BotConfig {
      allowed_ids,
      model,
      system,
      bot_chats,
    } = bot_data.get::<BotConfigData>().unwrap();

    if !allowed_ids.contains(&msg.author.id.to_string()) {
      return; // Ignore messages from not allowed users
    }

    let chat_id: i64 = msg.channel_id.into();

    let mut message_history = bot_chats
      .lock()
      .get(&chat_id)
      .unwrap_or(&vec![OllamaMessage {
        role: Role::System,
        content: system.into(),
      }])
      .clone();

    message_history.push(OllamaMessage {
      role: Role::User,
      content: msg.content.clone(),
    });

    // Get response from Ollama and send it to discord
    let Ok(mut res_stream) = ChatStream::new(&message_history, model).await else {
      msg
        .reply(&ctx.http, "ERROR: Failed to connect to Ollama server!")
        .await
        .unwrap();
      return;
    };

    let mut ai_response = res_stream.next().await.unwrap().message;
    let mut bot_msg = msg.reply(&ctx.http, &ai_response.content).await.unwrap();

    let mut start_time = current_time();
    while let Some(res) = res_stream.next().await {
      ai_response.content.push_str(&res.message.content);
      let current_time = current_time();

      // in order to avoid telegram rate limits
      if current_time - start_time > DS_BATCHING_MILLIS {
        let _ = bot_msg
          .edit(&ctx.http, EditMessage::new().content(&ai_response.content))
          .await;
        start_time = current_time;
      }
    }

    // append missing final part if it exists
    if start_time.as_millis() % DS_BATCHING_MILLIS.as_millis() != 0 {
      let _ = bot_msg
        .edit(&ctx.http, EditMessage::new().content(&ai_response.content))
        .await;
    }

    message_history.push(ai_response);

    bot_chats.lock().insert(chat_id, message_history);
  }
}
