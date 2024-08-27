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

export async function invoke<
	CommandName extends API,
	Command extends {
		[API.RunBot]: {
			args: { token: string; system: string; model: string; allowed_ids: string[]; };
			return: void;
		};
		[API.StopBot]: {
			args: { token: string };
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
	}[CommandName],
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
