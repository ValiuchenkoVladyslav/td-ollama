import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { PasswordInput } from "~/components/ui/password-input";
import type { BotCardData } from "~/store";

export function TokenInput(props: {
  isBotRunning: boolean;
  formRegister: UseFormRegister<BotCardData>;
  updateBotCard: (botCard: BotCardData) => void;
  botCardData: BotCardData;
  errors: FieldErrors<BotCardData>;
}) {
  return (
    <PasswordInput
      placeholder="Bot token"
      defaultValue={props.botCardData.token}
      disabled={props.isBotRunning}
      className={props.errors.token && "border-red-600"}
      {...props.formRegister("token", {
        required: true,
        onChange: ({ target }) =>
          props.updateBotCard({ ...props.botCardData, token: target.value }),
      })}
    />
  );
}
