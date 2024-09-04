"use client";

import { Plus } from "lucide-react";
import { useReducer } from "react";
import { useForm } from "react-hook-form";
import { API, type BotType, invoke } from "~/core-api";
import { useAppStore } from "~/store";
import { type BotCardData, useBotCards } from "./_bot-cards-store";
import { BotTypeSelect } from "./_bot-type-select";
import { DeleteCardButton } from "./_delete-card-button";
import { AllowedIdsInput } from "./_ids-input";
import { ModelSelect } from "./_model-select";
import { RunBotButton } from "./_run-bot-button";
import { SystemPromptInput } from "./_system-input";
import { TokenInput } from "./_token-input";

export function BotCard(props: BotCardData) {
	const { botCards, setBotCards, runningBots, setRunningBots } = useBotCards();
	const isOllamaRunning = useAppStore((state) => state.isOllamaRunning);
	const localModels = useAppStore((state) => state.localModels);
	const [isBotRunning, setIsBotRunning] = useReducer(
		(_: boolean, runBot: boolean) => {
			setRunningBots(runningBots + (runBot ? 1 : -1));
			return runBot;
		},
		false,
	);

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<BotCardData>();

	function updateBotCard(botCard: BotCardData) {
		botCards[botCards.findIndex((card) => card.cardKey === botCard.cardKey)] =
			botCard;

		setBotCards(botCards);
	}

	const submitBotData = handleSubmit((_data: BotCardData) => {
		// validated via RHK
		const data = _data as Omit<BotCardData, "bot_type"> & { bot_type: BotType };

		if (isBotRunning) {
			invoke(API.StopBot, data);
			return setIsBotRunning(false);
		}

		const allowed_ids = data.allowed_ids.split(",");

		// validate if every id can be converted to a number at least
		for (const id of allowed_ids.map(Number)) {
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

	return (
		<form
			onSubmit={submitBotData}
			className="rounded-xl bg-slate-950 p-8 flex flex-col gap-4"
		>
			<div className="flex gap-4">
				<BotTypeSelect
					isBotRunning={isBotRunning}
					control={control}
					updateBotCard={updateBotCard}
					botCardData={props}
					errors={errors}
				/>

				<TokenInput
					isBotRunning={isBotRunning}
					formRegister={register}
					updateBotCard={updateBotCard}
					botCardData={props}
					errors={errors}
				/>
			</div>

			<AllowedIdsInput
				isBotRunning={isBotRunning}
				formRegister={register}
				updateBotCard={updateBotCard}
				botCardData={props}
				errors={errors}
			/>

			<SystemPromptInput
				isBotRunning={isBotRunning}
				formRegister={register}
				updateBotCard={updateBotCard}
				botCardData={props}
			/>

			<div className="flex justify-between">
				<div className="flex gap-4">
					<RunBotButton
						isBotRunning={isBotRunning}
						isOllamaRunning={isOllamaRunning}
					/>

					<ModelSelect
						isBotRunning={isBotRunning}
						botCardData={props}
						errors={errors}
						control={control}
						localModels={localModels}
						updateBotCard={updateBotCard}
					/>
				</div>

				<DeleteCardButton
					isBotRunning={isBotRunning}
					botCardData={props}
					setBotCards={setBotCards}
					botCards={botCards}
				/>
			</div>
		</form>
	);
}

export function BotCardsList() {
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
