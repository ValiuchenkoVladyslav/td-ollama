use std::sync::Mutex;
use tauri::State;
use crate::app_state::AppState;
use super::api::{self, OllamaModels};

const OLLAMA_PROCESSES: [&str; 3] = [
  "ollama app.exe",
  "ollama.exe",
  "ollama_llama_server.exe"
];

#[tauri::command(rename_all="snake_case")]
pub fn start_ollama() {
  use std::os::windows::process::CommandExt;

  std::process::Command::new("ollama")
    .arg("serve")
    .creation_flags(0x08000000) // CREATE_NO_WINDOW
    .spawn()
    .unwrap();
}

#[tauri::command(rename_all="snake_case")]
pub fn stop_ollama() {
  let mut system = sysinfo::System::new();
  system.refresh_processes(sysinfo::ProcessesToUpdate::All);

  for ollama_process in OLLAMA_PROCESSES {
    for process in system.processes_by_name(ollama_process.as_ref()) {
      process.kill();
    }
  }
}

#[tauri::command(rename_all="snake_case")]
pub fn check_ollama() -> bool {
  let mut system = sysinfo::System::new();
  system.refresh_processes(sysinfo::ProcessesToUpdate::All);

  for ollama_process in OLLAMA_PROCESSES {
    if system.processes_by_name(ollama_process.as_ref()).next().is_some() {
      return true;
    }
  }

  false
}

#[tauri::command(rename_all="snake_case")]
pub fn set_manage_ollama(state: State<'_, Mutex<AppState>>, manage: bool) {
  state.lock().unwrap().manage_ollama = manage;
}

#[tauri::command(rename_all="snake_case")]
pub async fn list_models() -> OllamaModels {
  api::list_models().await
}
