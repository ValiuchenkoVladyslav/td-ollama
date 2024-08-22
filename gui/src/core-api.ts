// WARNING: UPDATE THIS FILE WHENEVER YOU CHANGE CORE COMMANDS
export enum API {
  RunBot = "run_bot",

  StartOllama = "start_ollama",
  StopOllama = "stop_ollama",
  CheckOllama = "check_ollama",
}

export async function invoke<
  CommandName extends API,
  Command extends {
    [API.RunBot]: {
      args: { token: string; model: string; };
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
  }[CommandName]
>(
  cmd: CommandName,
  args: Command["args"],
): Promise<{ error?: string; data?: Command["return"]; }> {
  try {
    const { invoke } = await import("@tauri-apps/api/core");

    return { data: await invoke(cmd, args) };
  } catch (e) {
    return { error: String(e) };
  }
}
