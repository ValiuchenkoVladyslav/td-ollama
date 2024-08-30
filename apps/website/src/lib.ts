import type { Metadata } from "next";

export function createMetadata(title: string): Metadata {
	return {
		title: `TG-OLLAMA — ${title}`,
		description:
			"An app that allows you to manage AI powered Telegram chatbots",
	};
}
