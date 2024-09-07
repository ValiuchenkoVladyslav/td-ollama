"use client";

import { Plus } from "lucide-react";
import { useBotCards } from "~/store";
import { BotCard } from "./_bot-card";

export default function Home() {
	const { botCards, setBotCards } = useBotCards();

	return (
		<>
			{botCards
				.sort((a, b) => a.cardKey - b.cardKey)
				.map((card) => (
					<BotCard key={card.cardKey} {...card} />
				))}

			<button
				type="button"
				className="bg-slate-950 hover:opacity-95 duration-300 rounded-xl flex items-center justify-center gap-2"
				onClick={() => {
					let highestIndex = 0;

					for (const { cardKey } of botCards) {
						if (cardKey > highestIndex) highestIndex = cardKey;
					}

					botCards.push({
						token: "",
						allowed_ids: "",
						system: "",
						model: "",
						bot_type: "",
						cardKey: highestIndex + 1,
					});

					setBotCards(botCards);
				}}
			>
				<Plus size={46} />
				<span className="text-3xl font-semibold">ADD BOT PRESET</span>
			</button>
		</>
	);
}
