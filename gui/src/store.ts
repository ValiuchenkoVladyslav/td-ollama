import { create } from "zustand";
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
		setIsOllamaRunning(setRunning: boolean) {
			set({ isOllamaRunning: setRunning });

			invoke(setRunning ? API.StartOllama : API.StopOllama, undefined);
		},

		localModels: [] as string[],

		async initStore() {
			set({
				manageOllama: localStorage.getItem(manageOllamaKey) === "true",
				localModels:
					JSON.parse(localStorage.getItem(localModelsKey) ?? "") ?? [],
			});

			const isOllamaRunning = !!(await invoke(API.CheckOllama, undefined)).data;

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
