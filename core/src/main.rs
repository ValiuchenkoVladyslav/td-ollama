#![cfg_attr(not(debug_assertions), windows_subsystem="windows")]

mod bot;
mod ollama;


fn main() {
  tauri::Builder::default()
    .on_window_event(|_, event| match event {
      tauri::WindowEvent::Destroyed => ollama::stop_ollama(),
      _ => (),
    })
    // WARNING: UPDATE gui/src/core-api.ts WHENEVER YOU CHANGE COMMANDS
    .invoke_handler(tauri::generate_handler![
      bot::run_bot,
      ollama::start_ollama,
      ollama::stop_ollama,
      ollama::check_ollama
    ])
    .run(tauri::generate_context!())
    .unwrap();
}
