use std::sync::Mutex;
use tauri::State;
use crate::app_state::AppState;
use teloxide::{dispatching::{HandlerExt, UpdateFilterExt}, dptree, prelude::Dispatcher, types::Update, Bot};
use super::handlers::{Command, handle_command, handle_message};

#[tauri::command(rename_all="snake_case")]
pub async fn run_bot(state: State<'_, Mutex<AppState>>, token: String, system: String, model: String) -> Result<(), ()> {
  let mut dispatcher = Dispatcher::builder(
    Bot::new(&token),
    Update::filter_message()
      .branch(dptree::entry().filter_command::<Command>().endpoint(handle_command))
      .endpoint(move |bot, msg| handle_message(bot, msg, system.clone(), model.clone()))
  ).build();

  state.lock().unwrap().running_bots.push((dispatcher.shutdown_token(), token));

  dispatcher.dispatch().await;

  Ok(())
}

#[allow(unused_must_use)]
#[tauri::command(rename_all="snake_case")]
pub fn stop_bot(state: State<'_, Mutex<AppState>>, token: String) {
  let running_bots = &mut state.lock().unwrap().running_bots;
  if let Some((shutdown_token, _)) = running_bots.iter().find(|(_, t)| t == &token) {
    shutdown_token.shutdown();
  }

  running_bots.retain(|(_, t)| t != &token);
}