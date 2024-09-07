import type { Metadata } from "next";
import Icon from "~/images/icon.png";

export const APP_URL = "https://td-ollama.vercel.app";

export function createMetadata(title: string): Metadata {
  return {
    icons: [
      {
        url: Icon.src,
        sizes: "any",
      },
    ],
    title: `TD-OLLAMA — ${title}`,
    description:
      "An app that allows you to manage AI powered Telegram chatbots",
    openGraph: {
      type: "website",
      url: APP_URL,
      title: `TD-OLLAMA — ${title}`,
      description:
        "An app that allows you to manage AI powered Telegram chatbots",
      images: Icon.src,
    },
    twitter: {
      description:
        "An app that allows you to manage AI powered Telegram chatbots",
      images: Icon.src,
    },
  };
}
