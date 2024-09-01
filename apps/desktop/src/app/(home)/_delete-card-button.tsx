import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { BotCardData } from "./_bot-cards-store";

export function DeleteCardButton(props: {
	isBotRunning: boolean;
	botCardData: BotCardData;
	setBotCards: (botCards: BotCardData[]) => void;
	botCards: BotCardData[];
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="text-lg">
				<Button variant="destructive" disabled={props.isBotRunning}>
					DELETE
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel className="text-lg">
					Delete bot preset?
					<br />
					<p className="text-sm opacity-75">
						This will permanently delete your bot preset
					</p>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuItem className="flex items-center gap-2 p-1">
					<Button
						variant="destructive"
						className="text-lg"
						size="sm"
						onClick={() =>
							props.setBotCards(
								props.botCards.filter(
									({ cardKey }) => cardKey !== props.botCardData.cardKey,
								),
							)
						}
					>
						DELETE
					</Button>
					<Button variant="secondary" size="sm">
						Cancel
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
