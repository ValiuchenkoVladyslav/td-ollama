import { Ban, Play } from "lucide-react";
import { Button } from "~/components/ui/button";

export function RunBotButton(props: {
	isBotRunning: boolean;
	isOllamaRunning: boolean;
}) {
	return (
		<Button
			type="submit"
			disabled={!props.isOllamaRunning}
			className="text-lg w-[160px]"
		>
			{props.isBotRunning ? <Ban size={20} /> : <Play size={20} />}
			<span className="pl-2">
				{props.isBotRunning ? "STOP BOT" : "START BOT"}
			</span>
		</Button>
	);
}
