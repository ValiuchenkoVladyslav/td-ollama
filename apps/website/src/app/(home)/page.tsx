import { createMetadata } from "~/meta";
import { DownloadButton } from "./_download-button";

export const metadata = createMetadata("Download");

export default function Home() {
  return (
    <div className="flex items-center justify-center px-8">
      <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center">
        <video
          className="md:w-[740px] md:h-[410px]"
          controls
          loop
          muted
          autoPlay
          disablePictureInPicture
          controlsList="nodownload noremoteplayback noplaybackrate"
        >
          <source
            src="https://github.com/user-attachments/assets/14c6ef00-2eea-47fa-87fc-63a9d946461b"
            type="video/mp4"
          />
        </video>

        <section className="flex justify-start flex-col gap-2">
          <h1 className="text-2xl sm:text-4xl font-bold">
            TD-OLLAMA — Telegram & Discord <br className="hidden sm:block" />
            Ollama bot manager
          </h1>
          <p className="opacity-70 text-xl sm:text-2xl">
            An app that allows you to manage AI powered{" "}
            <br className="hidden sm:block" /> chatbots for your favorite
            messengers
          </p>
          <p className="text-xl sm:text-2xl font-semibold">
            🎀✨ Just take a look at this catgirl demo
          </p>
          <p className="opacity-70 text-xl sm:text-2xl md:max-w-[580px]">
            You can create bots from your own Telegram / Discord tokens using
            any Ollama model, including custom ones
          </p>

          <DownloadButton />
        </section>
      </div>
    </div>
  );
}
