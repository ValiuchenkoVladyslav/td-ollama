import { type Control, Controller, type FieldErrors } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type BotCardData, useOllamaStore } from "~/store";

export function ModelSelect(props: {
  isBotRunning: boolean;
  botCardData: BotCardData;
  errors: FieldErrors<BotCardData>;
  control: Control<BotCardData, unknown>;
  updateBotCard: (botCard: BotCardData) => void;
}) {
  const localModels = useOllamaStore((state) => state.localModels);

  return (
    <Controller
      control={props.control}
      name="model"
      defaultValue={props.botCardData.model}
      rules={{
        required: true,
        onChange: ({ target }) =>
          props.updateBotCard({
            ...props.botCardData,
            model: target.value,
          }),
      }}
      render={({ field }) => (
        <Select
          defaultValue={props.botCardData.model}
          onValueChange={field.onChange}
          disabled={props.isBotRunning}
        >
          <SelectTrigger
            className={"w-[140px] " + (props.errors.model && "border-red-600")}
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
  );
}
