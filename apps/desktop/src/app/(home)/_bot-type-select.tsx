import { type Control, Controller, type FieldErrors } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import type { BotCardData } from "./_bot-cards-store";

export function BotTypeSelect(props: {
	isBotRunning: boolean;
	botCardData: BotCardData;
	errors: FieldErrors<BotCardData>;
	control: Control<BotCardData, unknown>;
	updateBotCard: (botCard: BotCardData) => void;
}) {
	return (
		<Controller
			control={props.control}
			name="bot_type"
			defaultValue={props.botCardData.bot_type}
			rules={{
				required: true,
				onChange: ({ target }) =>
					props.updateBotCard({
						...props.botCardData,
						bot_type: target.value,
					}),
			}}
			render={({ field }) => (
				<Select
					defaultValue={props.botCardData.bot_type}
					onValueChange={field.onChange}
					disabled={props.isBotRunning}
				>
					<SelectTrigger
						className={
							"!w-[160px] " + (props.errors.bot_type && "border-red-600")
						}
					>
						<SelectValue placeholder="Bot Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="telegram">
							<div className="flex gap-2 items-center font-semibold h-[26px]">
								<svg
									width="30px"
									height="30px"
									viewBox="0 0 24 24"
									fill="none"
									className="ml-[-2px]"
								>
									<path
										d="M12 4C10.4178 4 8.87103 4.46919 7.55544 5.34824C6.23985 6.22729 5.21447 7.47672 4.60897 8.93853C4.00347 10.4003 3.84504 12.0089 4.15372 13.5607C4.4624 15.1126 5.22433 16.538 6.34315 17.6569C7.46197 18.7757 8.88743 19.5376 10.4393 19.8463C11.9911 20.155 13.5997 19.9965 15.0615 19.391C16.5233 18.7855 17.7727 17.7602 18.6518 16.4446C19.5308 15.129 20 13.5823 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4ZM15.93 9.48L14.62 15.67C14.52 16.11 14.26 16.21 13.89 16.01L11.89 14.53L10.89 15.46C10.8429 15.5215 10.7824 15.5715 10.7131 15.6062C10.6438 15.6408 10.5675 15.6592 10.49 15.66L10.63 13.66L14.33 10.31C14.5 10.17 14.33 10.09 14.09 10.23L9.55 13.08L7.55 12.46C7.12 12.33 7.11 12.03 7.64 11.83L15.35 8.83C15.73 8.72 16.05 8.94 15.93 9.48Z"
										fill="white"
									/>
								</svg>
								<span className="ml-[-2px]">Telegram</span>
							</div>
						</SelectItem>
						<SelectItem value="discord">
							<div className="flex gap-2 items-center font-semibold h-[26px]">
								<svg width="26px" height="26px" viewBox="0 0 24 24" fill="none">
									<path
										d="M18.59 5.88997C17.36 5.31997 16.05 4.89997 14.67 4.65997C14.5 4.95997 14.3 5.36997 14.17 5.69997C12.71 5.47997 11.26 5.47997 9.83001 5.69997C9.69001 5.36997 9.49001 4.95997 9.32001 4.65997C7.94001 4.89997 6.63001 5.31997 5.40001 5.88997C2.92001 9.62997 2.25001 13.28 2.58001 16.87C4.23001 18.1 5.82001 18.84 7.39001 19.33C7.78001 18.8 8.12001 18.23 8.42001 17.64C7.85001 17.43 7.31001 17.16 6.80001 16.85C6.94001 16.75 7.07001 16.64 7.20001 16.54C10.33 18 13.72 18 16.81 16.54C16.94 16.65 17.07 16.75 17.21 16.85C16.7 17.16 16.15 17.42 15.59 17.64C15.89 18.23 16.23 18.8 16.62 19.33C18.19 18.84 19.79 18.1 21.43 16.87C21.82 12.7 20.76 9.08997 18.61 5.88997H18.59ZM8.84001 14.67C7.90001 14.67 7.13001 13.8 7.13001 12.73C7.13001 11.66 7.88001 10.79 8.84001 10.79C9.80001 10.79 10.56 11.66 10.55 12.73C10.55 13.79 9.80001 14.67 8.84001 14.67ZM15.15 14.67C14.21 14.67 13.44 13.8 13.44 12.73C13.44 11.66 14.19 10.79 15.15 10.79C16.11 10.79 16.87 11.66 16.86 12.73C16.86 13.79 16.11 14.67 15.15 14.67Z"
										fill="white"
									/>
								</svg>
								Discord
							</div>
						</SelectItem>
					</SelectContent>
				</Select>
			)}
		/>
	);
}
