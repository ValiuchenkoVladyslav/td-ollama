use crate::app_state::CommandState;

#[cfg(target_os = "windows")]
#[tauri::command(rename_all = "snake_case")]
pub fn start_ollama() -> Result<(), ()> {
  use std::os::windows::process::CommandExt;

  let cmd = std::process::Command::new("ollama")
    .arg("serve")
    .creation_flags(0x08000000) // CREATE_NO_WINDOW
    .spawn();

  match cmd {
    Ok(_) => Ok(()),
    Err(_) => Err(()),
  }
}

#[cfg(not(target_os = "windows"))]
#[tauri::command(rename_all = "snake_case")]
pub fn start_ollama() -> Result<(), ()> {
  match std::process::Command::new("ollama").arg("serve").spawn() {
    Ok(_) => Ok(()),
    Err(_) => Err(()),
  }
}

#[tauri::command(rename_all = "snake_case")]
pub fn stop_ollama() {
  let mut system = sysinfo::System::new();
  system.refresh_processes(sysinfo::ProcessesToUpdate::All);

  for process in system.processes().values() {
    let process_name = process.name().to_string_lossy();
    if process_name.contains("ollama") && !process_name.contains("td-ollama") {
      process.kill();
    }
  }
}

#[tauri::command(rename_all = "snake_case")]
pub fn check_ollama() -> bool {
  let mut system = sysinfo::System::new();
  system.refresh_processes(sysinfo::ProcessesToUpdate::All);

  for process in system.processes().values() {
    let process_name = process.name().to_string_lossy();
    if process_name.contains("ollama") && !process_name.contains("td-ollama") {
      return true;
    }
  }

  false
}

#[tauri::command(rename_all = "snake_case")]
pub fn set_manage_ollama(state: CommandState, manage: bool) {
  state.lock().unwrap().manage_ollama = manage;
}

#[tauri::command(rename_all = "snake_case")]
pub async fn list_models() -> Vec<String> {
  super::api::list_models()
    .await
    .models
    .iter()
    .map(|model| model.name.clone())
    .collect()
}
