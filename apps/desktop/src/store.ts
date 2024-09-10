import { create } from "zustand";
import { ollamaErrorToast } from "./components/ollama-error-toast";
import { API, type BotType, type Commands, invoke } from "./core-api";

const manageOllamaKey = "manageOllama";
const localModelsKey = "localModels";

// biome-ignore lint/suspicious/noExplicitAny: unknown breaks the type
export const useOllamaStore = create((_set: any, _get: any) => {
  const set: (typeof useOllamaStore)["setState"] = _set;
  const get: (typeof useOllamaStore)["getState"] = _get;

  const isBrowser = typeof window !== "undefined";

  return {
    manageOllama: isBrowser && localStorage.getItem(manageOllamaKey) === "true",
    setManageOllama(manageOllama: boolean) {
      localStorage.setItem(manageOllamaKey, String(manageOllama));
      invoke(API.SetManageOllama, { manage: manageOllama });

      set({ manageOllama });
    },

    isOllamaRunning:
      isBrowser && localStorage.getItem(manageOllamaKey) === "true", // predictive update
    async setIsOllamaRunning(setRunning: boolean) {
      if (!setRunning) {
        set({ isOllamaRunning: false });
        return await invoke(API.StopOllama, undefined);
      }

      if ((await invoke(API.StartOllama, undefined)).error)
        return ollamaErrorToast();

      set({ isOllamaRunning: true });

      // update local models cache
      const { data } = await invoke(API.ListModels, undefined);
      if (!data) return;

      set({ localModels: data });

      localStorage.setItem(localModelsKey, JSON.stringify(data));
    },

    localModels: (isBrowser
      ? JSON.parse(localStorage.getItem(localModelsKey) ?? "[]")
      : []) as string[],

    async initStore() {
      const isOllamaRunning = !!(await invoke(API.CheckOllama, undefined)).data;

      if (get().manageOllama && !isOllamaRunning) {
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

export type BotCardData = Omit<
  Commands["run_bot"]["args"],
  "allowed_ids" | "bot_type"
> & {
  cardKey: number;
  allowed_ids: string;
  bot_type: BotType | "";
};

export const botCardsKey = "botcards";

// biome-ignore lint/suspicious/noExplicitAny: unknown breaks the type
export const useBotCards = create((_set: any) => {
  const set: (typeof useBotCards)["setState"] = _set;

  const isBrowser = typeof window !== "undefined";

  return {
    runningBots: 0,
    setRunningBots(runningBots: number) {
      set({ runningBots });
    },

    botCards: (isBrowser
      ? JSON.parse(localStorage.getItem(botCardsKey) ?? "[]")
      : []) as BotCardData[],
    setBotCards(botCards: BotCardData[]) {
      localStorage.setItem(botCardsKey, JSON.stringify(botCards));
      set({ botCards });
    },
  };
});
