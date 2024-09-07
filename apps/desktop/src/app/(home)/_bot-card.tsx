"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { API, type BotType, invoke } from "~/core-api";
import { type BotCardData, useBotCards } from "~/store";
import { BotTypeSelect } from "./_bot-type-select";
import { DeleteCardButton } from "./_delete-card-button";
import { AllowedIdsInput } from "./_ids-input";
import { ModelSelect } from "./_model-select";
import { RunBotButton } from "./_run-bot-button";
import { SystemPromptInput } from "./_system-input";
import { TokenInput } from "./_token-input";

export function BotCard(props: BotCardData) {
  const { botCards, setBotCards, runningBots, setRunningBots } = useBotCards();
  const [isBotRunning, setIsBotRunning] = useState(false);

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
      setRunningBots(runningBots - 1);
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
      if (error) return setError("token", { message: "invalid" });

      setIsBotRunning(true);
      setRunningBots(runningBots + 1);
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
          <RunBotButton isBotRunning={isBotRunning} />

          <ModelSelect
            isBotRunning={isBotRunning}
            botCardData={props}
            errors={errors}
            control={control}
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
