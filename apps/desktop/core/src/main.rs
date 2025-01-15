#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app_state;
mod bot;
mod ollama;

use app_state::AppState;
use parking_lot::Mutex;
use tauri::Manager;

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .setup(|app| {
      let app_state = AppState::load(app.app_handle());

      if app_state.manage_ollama {
        let _ = ollama::commands::start_ollama();
      }

      app.manage(Mutex::new(app_state));

      Ok(())
    })
    .on_window_event(|app, event| {
      if let tauri::WindowEvent::Destroyed = event {
        let state_mutex = app.state::<Mutex<AppState>>();
        let app_state = state_mutex.lock();

        if app_state.manage_ollama {
          ollama::commands::stop_ollama();
        }

        app_state.save(app.app_handle());
      }
    })
    // WARNING: UPDATE ../../src/core-api.ts WHENEVER YOU CHANGE COMMANDS
    .invoke_handler(tauri::generate_handler![
      bot::commands::run_bot,
      bot::commands::stop_bot,
      ollama::commands::start_ollama,
      ollama::commands::stop_ollama,
      ollama::commands::check_ollama,
      ollama::commands::set_manage_ollama,
      ollama::commands::list_models,
    ])
    .run(tauri::generate_context!())
    .unwrap();
}
