use teloxide::{prelude::{Bot, Message, Requester}, utils::command::BotCommands};
use crate::ollama;

type HandlerResult = Result<(), Box<dyn std::error::Error + Send + Sync>>;

#[derive(BotCommands, Clone)]
#[command(rename_rule="lowercase", description="These commands are supported:")]
pub enum Command {
  #[command(description="Display this message")]
  Help,
  #[command(description="Change system message")]
  System(String),
}

pub async fn handle_command(bot: Bot, msg: Message, cmd: Command) -> HandlerResult {
  bot.send_message(msg.chat.id, match cmd {
    Command::Help => Command::descriptions().to_string(),
    Command::System(message) => {
      // TODO: Save the message to the app state
      format!("System message changed to:\n\n{message}")
    },
  }).await?;

  Ok(())
}

pub async fn handle_message(bot: Bot, msg: Message, system: String, model: String) -> HandlerResult {
  let Some(message_text) = msg.text() else {
    return Ok(()); // Ignore non-text messages
  };

  let res = ollama::api::chat(system, message_text.into(), model).await;

  bot.send_message(msg.chat.id, res.message.content).await?;

  Ok(())
}
