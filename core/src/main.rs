#![cfg_attr(not(debug_assertions), windows_subsystem="windows")]

mod bot;
mod ollama;
mod app_state;

use app_state::AppState;
use std::sync::Mutex;
use tauri::Manager;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let app_state = AppState::load(app.app_handle());

      if app_state.manage_ollama {
        ollama::start_ollama();
      }

      app.manage(Mutex::new(app_state));

      Ok(())
    })
    .on_window_event(|app, event| match event {
      tauri::WindowEvent::Destroyed => {
        let state_mutex = app.state::<Mutex<AppState>>();
        let app_state = state_mutex.lock().unwrap();

        if app_state.manage_ollama {
          ollama::stop_ollama();
        }

        app_state.save(app.app_handle());
      },
      _ => (),
    })
    // WARNING: UPDATE gui/src/core-api.ts WHENEVER YOU CHANGE COMMANDS
    .invoke_handler(tauri::generate_handler![
      bot::run_bot,
      bot::stop_bot,
      ollama::start_ollama,
      ollama::stop_ollama,
      ollama::check_ollama,
      ollama::set_manage_ollama,
    ])
    .run(tauri::generate_context!())
    .unwrap();
}
