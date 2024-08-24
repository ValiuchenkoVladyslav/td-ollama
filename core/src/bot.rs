use std::sync::Mutex;
use ollama_rs::{generation::completion::request::GenerationRequest, Ollama};
use tauri::State;
use crate::app_state::AppState;
use teloxide::{dispatching::{HandlerExt, UpdateFilterExt}, dptree, prelude::{Bot, Dispatcher, Message, Requester}, types::Update, utils::command::BotCommands};

type HandlerResult = Result<(), Box<dyn std::error::Error + Send + Sync>>;

#[derive(BotCommands, Clone)]
#[command(rename_rule="lowercase", description="These commands are supported:")]
enum Command {
  #[command(description="Display this message")]
  Help,
  #[command(description="Change system message")]
  System(String),
}

#[tauri::command(rename_all="snake_case")]
pub async fn run_bot(state: State<'_, Mutex<AppState>>, token: String, model: String) -> Result<(), ()> {
  async fn handle_command(bot: Bot, msg: Message, cmd: Command) -> HandlerResult {
    bot.send_message(msg.chat.id, match cmd {
      Command::Help => Command::descriptions().to_string(),
      Command::System(message) => {
        // TODO: Save the message to the app state
        format!("System message changed to:\n\n{message}")
      },
    }).await?;

    Ok(())
  }

  async fn handle_message(bot: Bot, msg: Message, model: String) -> HandlerResult {
    let Some(message_text) = msg.text() else {
      return Ok(()); // Ignore non-text messages
    };

    let res = Ollama::default().generate(GenerationRequest::new(
      model, message_text.into(),
    )).await.unwrap();

    bot.send_message(msg.chat.id, res.response).await?;

    Ok(())
  }

  let mut dispatcher = Dispatcher::builder(
    Bot::new(&token),
    Update::filter_message()
      .branch(dptree::entry().filter_command::<Command>().endpoint(handle_command))
      .endpoint(move |bot, msg| handle_message(bot, msg, model.clone()))
  ).build();

  state.lock().unwrap().running_bots.push((dispatcher.shutdown_token(), token));

  dispatcher.dispatch().await;

  Ok(())
}

#[tauri::command(rename_all="snake_case")]
pub fn stop_bot(state: State<'_, Mutex<AppState>>, token: String) {
  let running_bots = &mut state.lock().unwrap().running_bots;
  if let Some((shutdown_token, _)) = running_bots.iter().find(|(_, t)| t == &token) {
    let _ = shutdown_token.shutdown().unwrap();
  }

  running_bots.retain(|(_, t)| t != &token);
}
