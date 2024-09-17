import { create } from "zustand";
import { ollamaErrorToast } from "./components/ollama-error-toast";
import { API, type BotType, type Commands, invoke } from "./core-api";

const manageOllamaKey = "manageOllama";
const localModelsKey = "localModels";

function getCachedOr<T>(key: string, defaultValue: T): T {
  return typeof window === "undefined"
    ? defaultValue
    : JSON.parse(localStorage.getItem(key) ?? String(defaultValue));
}

// biome-ignore lint/suspicious/noExplicitAny: unknown breaks the type
export const useOllamaStore = create((_set: any, _get: any) => {
  const set: (typeof useOllamaStore)["setState"] = _set;
  const get: (typeof useOllamaStore)["getState"] = _get;

  return {
    manageOllama: getCachedOr(manageOllamaKey, false),
    setManageOllama(manageOllama: boolean) {
      localStorage.setItem(manageOllamaKey, String(manageOllama));
      invoke(API.SetManageOllama, { manage: manageOllama });

      set({ manageOllama });
    },

    isOllamaRunning: getCachedOr(manageOllamaKey, false),
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

    localModels: getCachedOr<string[]>(localModelsKey, []),

    async initStore() {
      const [isOllamaRunningRes, localModelsRes] = await Promise.all([
        invoke(API.CheckOllama, undefined),
        invoke(API.ListModels, undefined),
      ]);

      const isOllamaRunning = !!isOllamaRunningRes.data;
      const localModels = localModelsRes.data ?? [];

      if (get().manageOllama && !isOllamaRunning) {
        ollamaErrorToast();
      }

      set({ isOllamaRunning });

      // update local models cache
      if (isOllamaRunning) {
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

  return {
    runningBots: 0,
    setRunningBots(runningBots: number) {
      set({ runningBots });
    },

    botCards: getCachedOr<BotCardData[]>(botCardsKey, []),

    setBotCards(botCards: BotCardData[]) {
      localStorage.setItem(botCardsKey, JSON.stringify(botCards));
      set({ botCards });
    },
  };
});
