import { Ban, Play } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useOllamaStore } from "~/store";

export function RunBotButton(props: { isBotRunning: boolean }) {
	const isOllamaRunning = useOllamaStore((state) => state.isOllamaRunning);

	return (
		<Button
			type="submit"
			disabled={!isOllamaRunning}
			className="text-lg w-[160px]"
		>
			{props.isBotRunning ? <Ban size={20} /> : <Play size={20} />}
			<span className="pl-2">
				{props.isBotRunning ? "STOP BOT" : "START BOT"}
			</span>
		</Button>
	);
}
