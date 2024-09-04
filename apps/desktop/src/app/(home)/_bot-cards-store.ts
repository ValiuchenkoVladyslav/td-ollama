import { create } from "zustand";
import type { Commands } from "~/core-api";

export type BotCardData = Omit<
	Commands["run_bot"]["args"],
	"allowed_ids" | "bot_type"
> & {
	cardKey: number;
	allowed_ids: string;
	bot_type: "telegram" | "discord" | "";
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
		botCards: [] as BotCardData[],
		setBotCards(botCards: BotCardData[]) {
			localStorage.setItem(botCardsKey, JSON.stringify(botCards));
			set({ botCards });
		},
	};
});
