import { create } from "zustand";
import { API, invoke } from "./core-api";

export const manageOllamaKey = "manageOllama";

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
    async initStore() {
      set(({
        isOllamaRunning: !!(await invoke(API.CheckOllama, undefined)).data,
        manageOllama: localStorage.getItem(manageOllamaKey) === "true",
      }));
    }
  };
});
