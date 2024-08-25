"use client";

import { Ban, Play, Plus } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { PasswordInput } from "~/components/ui/password-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { API, invoke } from "~/core-api";
import { useAppStore } from "~/store";

type BotCardData = {
	token: string;
	allowedIds: string;
	systemPrompt: string;
	model: string;
};

type BotCardProps = BotCardData & {
	cardKey: string;
};

const BotCardsContext = createContext(
	{} as {
		botCards: BotCardProps[];
		setBotCards: React.Dispatch<React.SetStateAction<BotCardProps[]>>;
	},
);

export function BotCard(props: BotCardProps) {
	const { setBotCards } = useContext(BotCardsContext);
	const [isBotRunning, setIsBotRunning] = useState(false);
	const isOllamaRunning = useAppStore((state) => state.isOllamaRunning);
	const localModels = useAppStore((state) => state.localModels);

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<BotCardData>();

	function updateBotCard(botCard: BotCardProps) {
		localStorage.setItem(props.cardKey, JSON.stringify(botCard));
		setBotCards((prevBotCards) =>
			prevBotCards.map((card) =>
				card.cardKey === props.cardKey ? botCard : card,
			),
		);
	}

	const submitBotData = handleSubmit((data) => {
		if (isBotRunning) {
			invoke(API.StopBot, { token: data.token });
			setIsBotRunning(false);
			return;
		}

		invoke(API.RunBot, { ...data, system: data.systemPrompt });
		setIsBotRunning(true);
	});

	return (
		<form
			onSubmit={submitBotData}
			className="rounded-xl bg-slate-950 p-8 flex flex-col gap-4"
		>
			<PasswordInput
				placeholder="Telegram bot token"
				defaultValue={props.token}
				disabled={isBotRunning}
				className={errors.token && "border-red-600"}
				{...register("token", {
					required: true,
					onChange: ({ target }) =>
						updateBotCard({ ...props, token: target.value }),
				})}
			/>

			<Input
				placeholder="Allowed IDs (comma separated)"
				disabled={isBotRunning}
				autoComplete="off"
				defaultValue={props.allowedIds}
				{...register("allowedIds", {
					onChange: ({ target }) =>
						updateBotCard({ ...props, allowedIds: target.value }),
				})}
			/>

			<Textarea
				className="h-full resize-none"
				placeholder="System prompt"
				disabled={isBotRunning}
				defaultValue={props.systemPrompt}
				{...register("systemPrompt", {
					onChange: ({ target }) =>
						updateBotCard({ ...props, systemPrompt: target.value }),
				})}
			/>

			<div className="flex justify-between">
				<div className="flex gap-4">
					<Button disabled={!isOllamaRunning} className="text-lg w-[160px]">
						{isBotRunning ? <Ban size={20} /> : <Play size={20} />}
						<span className="pl-2">
							{isBotRunning ? "STOP BOT" : "START BOT"}
						</span>
					</Button>

					<Controller
						control={control}
						name="model"
						defaultValue={props.model}
						rules={{
							required: true,
							onChange: ({ target }) =>
								updateBotCard({ ...props, model: target.value }),
						}}
						render={({ field }) => (
							<Select
								required
								name={field.name}
								defaultValue={props.model}
								onValueChange={field.onChange}
								disabled={isBotRunning}
							>
								<SelectTrigger
									aria-invalid={!!errors.model}
									className="w-[140px] aria-[invalid=true]:border-red-600"
								>
									<SelectValue placeholder="Model" />
								</SelectTrigger>
								<SelectContent>
									{localModels.map((model) => (
										<SelectItem key={model} value={model}>
											{model}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="destructive"
							className="text-lg"
							disabled={isBotRunning}
						>
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
								onClick={() => {
									localStorage.removeItem(props.cardKey);
									setBotCards((prevBotCards) =>
										prevBotCards.filter(
											(card) => card.cardKey !== props.cardKey,
										),
									);
								}}
							>
								DELETE
							</Button>
							<Button variant="secondary" size="sm">
								Cancel
							</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</form>
	);
}

let highestIndex = 0;
const botCardPrefix = "botcard-";

export function BotCardsList() {
	const [botCards, setBotCards] = useState<BotCardProps[]>([]);

	useEffect(() => {
		const parsedBotCards: BotCardProps[] = [];
		for (const key of Object.keys(localStorage)) {
			if (!key.startsWith(botCardPrefix)) continue;

			const botCardIndex = +key.split("-").pop()!;
			if (botCardIndex > highestIndex) highestIndex = botCardIndex;

			const parsedCard = JSON.parse(localStorage.getItem(key)!);
			parsedCard.cardKey = key;

			parsedBotCards.push(parsedCard);
		}

		setBotCards(parsedBotCards);
	}, []);

	return (
		<BotCardsContext.Provider value={{ botCards, setBotCards }}>
			{botCards
				.sort((a, b) =>
					+a.cardKey.split("-").pop()! > +b.cardKey.split("-").pop()! ? 1 : -1,
				)
				.map((card) => (
					<BotCard key={card.cardKey} {...card} />
				))}

			<button
				type="button"
				className="bg-slate-950 hover:opacity-95 duration-300 rounded-xl flex items-center justify-center gap-2"
				onClick={() => {
					highestIndex += 1;

					const newBotCard: BotCardProps = {
						token: "",
						allowedIds: "",
						systemPrompt: "",
						model: "",
						cardKey: botCardPrefix + highestIndex,
					};

					localStorage.setItem(newBotCard.cardKey, JSON.stringify(newBotCard));
					setBotCards([...botCards, newBotCard]);
				}}
			>
				<Plus size={46} />
				<span className="text-3xl font-semibold">ADD BOT PRESET</span>
			</button>
		</BotCardsContext.Provider>
	);
}
