import type { UseFormRegister } from "react-hook-form";
import { Textarea } from "~/components/ui/textarea";
import type { BotCardData } from "./_bot-cards-store";

export function SystemPromptInput(props: {
	isBotRunning: boolean;
	formRegister: UseFormRegister<BotCardData>;
	updateBotCard: (botCard: BotCardData) => void;
	botCardData: BotCardData;
}) {
	return (
		<Textarea
			className="h-full resize-none"
			placeholder="System prompt"
			disabled={props.isBotRunning}
			defaultValue={props.botCardData.system}
			{...props.formRegister("system", {
				onChange: ({ target }) =>
					props.updateBotCard({
						...props.botCardData,
						system: target.value,
					}),
			})}
		/>
	);
}
