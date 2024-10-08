// WARNING: UPDATE THIS FILE WHENEVER YOU CHANGE CORE COMMANDS
export enum API {
  RunBot = "run_bot",
  StopBot = "stop_bot",

  StartOllama = "start_ollama",
  StopOllama = "stop_ollama",
  CheckOllama = "check_ollama",
  SetManageOllama = "set_manage_ollama",
  ListModels = "list_models",
}

export type BotType = "telegram" | "discord";

export type Commands = {
  [API.RunBot]: {
    args: {
      token: string;
      system: string;
      model: string;
      allowed_ids: string[];
      bot_type: BotType;
    };
    return: void;
  };
  [API.StopBot]: {
    args: { token: string; bot_type: BotType };
    return: void;
  };

  [API.StartOllama]: {
    args: undefined;
    return: void;
  };
  [API.StopOllama]: {
    args: undefined;
    return: void;
  };
  [API.CheckOllama]: {
    args: undefined;
    return: boolean;
  };
  [API.SetManageOllama]: {
    args: { manage: boolean };
    return: void;
  };
  [API.ListModels]: {
    args: undefined;
    return: string[];
  };
};

export async function invoke<
  CommandName extends API,
  Command extends Commands[CommandName],
>(
  cmd: CommandName,
  args: Command["args"],
): Promise<{ error?: string; data?: Command["return"] }> {
  try {
    const { invoke } = await import("@tauri-apps/api/core");

    return { data: await invoke(cmd, args) };
  } catch (e) {
    return { error: String(e) };
  }
}
