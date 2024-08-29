import { create } from "zustand";
import { ollamaErrorToast } from "./components/ollama-error-toast";
import { API, invoke } from "./core-api";

const manageOllamaKey = "manageOllama";
const localModelsKey = "localModels";

// biome-ignore lint/suspicious/noExplicitAny: unknown breaks the type
export const useAppStore = create((_set: any) => {
	const set: (typeof useAppStore)["setState"] = _set;

	return {
		manageOllama: false,
		setManageOllama(manageOllama: boolean) {
			localStorage.setItem(manageOllamaKey, String(manageOllama));
			invoke(API.SetManageOllama, { manage: manageOllama });

			set({ manageOllama });
		},

		isOllamaRunning: false,
		async setIsOllamaRunning(setRunning: boolean) {
			if (!setRunning) {
				return await invoke(API.StopOllama, undefined);
			}

			const status = await invoke(API.StartOllama, undefined);
			if (status.error) return ollamaErrorToast();

			set({ isOllamaRunning: setRunning });

			// update local models cache
			const { data } = await invoke(API.ListModels, undefined);
			if (!data) return;

			set({ localModels: data });

			localStorage.setItem(localModelsKey, JSON.stringify(data));
		},

		localModels: [] as string[],

		async initStore() {
			const manageOllama = localStorage.getItem(manageOllamaKey) === "true";

			set({
				isOllamaRunning: manageOllama, // predictive update
				manageOllama,
				localModels:
					JSON.parse(localStorage.getItem(localModelsKey) ?? "") ?? [],
			});

			const isOllamaRunning = !!(await invoke(API.CheckOllama, undefined)).data;

			if (manageOllama && !isOllamaRunning) {
				ollamaErrorToast();
			}

			set({ isOllamaRunning });

			if (isOllamaRunning) {
				// update local models cache
				const localModels =
					(await invoke(API.ListModels, undefined)).data ?? [];

				set({ localModels });

				localStorage.setItem(localModelsKey, JSON.stringify(localModels));
			}
		},
	};
});
