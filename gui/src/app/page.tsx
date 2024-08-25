import { BotCardsList } from "./_bot_card";

export default function Home() {
	return (
		<div className="grid grid-cols-2 gap-8 *:h-[320px]">
			<BotCardsList />
		</div>
	);
}
