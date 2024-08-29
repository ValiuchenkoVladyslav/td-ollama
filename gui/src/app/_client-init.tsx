"use client";

import { useAppStore } from "~/store";
import { botCardsKey, useBotCards } from "./_bot_cards";

if (typeof window !== "undefined") {
	// init store on client side
	useAppStore.getState().initStore();
	useBotCards
		.getState()
		.setBotCards(JSON.parse(localStorage.getItem(botCardsKey) ?? "[]"));

	// disable some browser features so app feels more native
	if (process.env.NODE_ENV !== "development") {
		window.addEventListener("keydown", (e) => {
			if (["r", "f"].includes(e.key.toLowerCase()) && (e.ctrlKey || e.metaKey))
				e.preventDefault();

			if (e.key === "F5") e.preventDefault();
		});

		window.addEventListener("contextmenu", (e) => e.preventDefault());

		const noSelectStyles = document.createElement("style");
		noSelectStyles.textContent = `
      * {
        user-select: none;
      }
    `;
		document.head.appendChild(noSelectStyles);
	}
}

export default function ClientInit() {
	return null;
}
