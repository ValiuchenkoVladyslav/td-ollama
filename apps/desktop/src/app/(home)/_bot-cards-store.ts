import { create } from "zustand";

export type BotCardData = {
	token: string;
	allowed_ids: string;
	system: string;
	model: string;
	cardKey: number;
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
