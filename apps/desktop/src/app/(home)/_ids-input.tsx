import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "~/components/ui/input";
import type { BotCardData } from "./_bot-cards-store";

export function AllowedIdsInput(props: {
	isBotRunning: boolean;
	formRegister: UseFormRegister<BotCardData>;
	updateBotCard: (botCard: BotCardData) => void;
	botCardData: BotCardData;
	errors: FieldErrors<BotCardData>;
}) {
	return (
		<Input
			placeholder="Allowed user IDs (comma separated)"
			disabled={props.isBotRunning}
			autoComplete="off"
			className={props.errors.allowed_ids && "border-red-600"}
			defaultValue={props.botCardData.allowed_ids}
			{...props.formRegister("allowed_ids", {
				onChange: ({ target }) =>
					props.updateBotCard({
						...props.botCardData,
						allowed_ids: target.value,
					}),
			})}
		/>
	);
}
