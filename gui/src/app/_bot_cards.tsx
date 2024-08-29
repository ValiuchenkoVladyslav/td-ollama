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
	allowed_ids: string;
	system: string;
	model: string;
	cardKey: number;
};

const BotCardsContext = createContext(
	{} as {
		botCards: BotCardData[];
		setBotCards: React.Dispatch<React.SetStateAction<BotCardData[]>>;
	},
);

const botCardsKey = "botcards";

export function BotCard(props: BotCardData) {
	const { setBotCards } = useContext(BotCardsContext);
	const [isBotRunning, setIsBotRunning] = useState(false);
	const isOllamaRunning = useAppStore((state) => state.isOllamaRunning);
	const localModels = useAppStore((state) => state.localModels);

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<BotCardData>();

	function updateBotCard(botCard: BotCardData) {
		setBotCards((prevBotCards) => {
			prevBotCards[
				prevBotCards.findIndex((card) => card.cardKey === botCard.cardKey)
			] = botCard;
			localStorage.setItem(botCardsKey, JSON.stringify(prevBotCards));

			return [...prevBotCards];
		});
	}

	const submitBotData = handleSubmit((data) => {
		if (isBotRunning) {
			invoke(API.StopBot, { token: data.token });
			return setIsBotRunning(false);
		}

		const allowed_ids = data.allowed_ids.split(",").map(Number);

		for (const id of allowed_ids) {
			if (Number.isNaN(id))
				return setError("allowed_ids", { message: "invalid" });
		}

		invoke(API.RunBot, {
			...data,
			allowed_ids,
		}).then(({ error }) => {
			if (!error) return setIsBotRunning(true);

			setError("token", { message: "invalid" });
		});
	});
	console.log(errors);
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
				className={errors.allowed_ids && "border-red-600"}
				defaultValue={props.allowed_ids}
				{...register("allowed_ids", {
					onChange: ({ target }) =>
						updateBotCard({ ...props, allowed_ids: target.value }),
				})}
			/>

			<Textarea
				className="h-full resize-none"
				placeholder="System prompt"
				disabled={isBotRunning}
				defaultValue={props.system}
				{...register("system", {
					onChange: ({ target }) =>
						updateBotCard({ ...props, system: target.value }),
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
					<DropdownMenuTrigger asChild className="text-lg">
						<Button variant="destructive" disabled={isBotRunning}>
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
									setBotCards((prevBotCards) => {
										const updatedBotCards = prevBotCards.filter(
											({ cardKey }) => cardKey !== props.cardKey,
										);
										localStorage.setItem(
											botCardsKey,
											JSON.stringify(updatedBotCards),
										);

										return updatedBotCards;
									});
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

export function BotCardsList() {
	const [botCards, setBotCards] = useState<BotCardData[]>([]);

	useEffect(() => {
		setBotCards(JSON.parse(localStorage.getItem(botCardsKey) ?? "[]"));
	}, []);

	return (
		<BotCardsContext.Provider value={{ botCards, setBotCards }}>
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
						cardKey: highestIndex + 1,
					});

					localStorage.setItem(botCardsKey, JSON.stringify(botCards));

					setBotCards([...botCards]);
				}}
			>
				<Plus size={46} />
				<span className="text-3xl font-semibold">ADD BOT PRESET</span>
			</button>
		</BotCardsContext.Provider>
	);
}
