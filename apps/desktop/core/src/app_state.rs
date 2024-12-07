use std::{collections::HashMap, fs::File};
use tauri::{AppHandle, Manager};

#[derive(Default, serde::Serialize, serde::Deserialize)]
pub struct AppState {
  pub manage_ollama: bool,

  #[serde(skip)]
  pub running_tg_bots: HashMap<String, teloxide::dispatching::ShutdownToken>,
  #[serde(skip)]
  pub running_ds_bots: HashMap<String, std::sync::Arc<serenity::all::ShardManager>>,
}

impl AppState {
  fn config_file_path(handle: &AppHandle) -> std::path::PathBuf {
    handle.path().app_data_dir().unwrap().join("app_state.json")
  }

  pub fn save(&self, handle: &AppHandle) {
    let config_file = Self::config_file_path(handle);

    std::fs::create_dir_all(config_file.parent().unwrap()).unwrap();

    serde_json::to_writer(File::create(config_file).unwrap(), self).unwrap();
  }

  pub fn load(handle: &AppHandle) -> Self {
    File::open(Self::config_file_path(handle))
      .map(|config| serde_json::from_reader(config).unwrap())
      .unwrap_or_default()
  }
}

pub type CmdState<'s> = tauri::State<'s, std::sync::Mutex<AppState>>;
