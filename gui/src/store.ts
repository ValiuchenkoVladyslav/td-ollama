import { create } from "zustand";
import { API, invoke } from "./core-api";

const manageOllamaKey = "manageOllama";
const localModelsKey = "localModels";

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
      const isOllamaRunning = !!(await invoke(API.CheckOllama, undefined)).data;

      const localModels = isOllamaRunning
        ? (await invoke(API.ListModels, undefined)).data?.models.map(model => model.name)
        : JSON.parse(localStorage.getItem(localModelsKey) ?? "") ?? [];

      if (isOllamaRunning) localStorage.setItem(localModelsKey, JSON.stringify(localModels));

      set(({
        isOllamaRunning,
        manageOllama: localStorage.getItem(manageOllamaKey) === "true",
        localModels
      }));
    }
  };
});
