use crate::app_state::CommandState;

#[tauri::command(rename_all="snake_case")]
pub async fn run_bot(state: CommandState<'_>, token: String, system: String, model: String, allowed_ids: Vec<String>) -> Result<(), ()> {
  use teloxide::{self as tl, dispatching::{UpdateFilterExt, Dispatcher}};
  use super::handlers::{handle_message, BotChats};

  let mut dispatcher = Dispatcher::builder(
    tl::Bot::new(&token),
    tl::types::Update::filter_message().endpoint(
      move |bot, chats, msg| handle_message(bot, chats, msg, system.clone(), allowed_ids.clone(), model.clone())
    )
  )
    .dependencies(tl::dptree::deps![BotChats::default()])
    .build();

  state.lock().unwrap().running_bots.push((dispatcher.shutdown_token(), token));

  dispatcher.dispatch().await;

  Ok(())
}

#[allow(unused_must_use)]
#[tauri::command(rename_all="snake_case")]
pub fn stop_bot(state: CommandState, token: String) {
  let running_bots = &mut state.lock().unwrap().running_bots;
  if let Some((shutdown_token, _)) = running_bots.iter().find(|(_, t)| t == &token) {
    shutdown_token.shutdown();
  }

  running_bots.retain(|(_, t)| t != &token);
}