import { ArrowDownToLine } from "lucide-react";
import { Button } from "~/components/ui/button";
import { createMetadata } from "~/meta";

export const metadata = createMetadata("Download");

export default function Home() {
	return (
		<div className="flex items-center justify-center px-8">
			<div className="flex flex-wrap gap-x-8 gap-y-4 justify-center">
				<video
					className="md:w-[740px]"
					controls
					loop
					muted
					autoPlay
					disablePictureInPicture
					controlsList="nodownload noremoteplayback noplaybackrate"
				>
					<source
						src="https://github.com/user-attachments/assets/038a9257-7d12-4cfd-8ac8-5551fd53ed9a"
						type="video/mp4"
					/>
				</video>

				<section className="flex justify-start flex-col gap-2">
					<h1 className="text-2xl sm:text-4xl font-bold">
						TG-OLLAMA — <br className="hidden sm:block" />
						Telegram Ollama bot manager
					</h1>
					<p className="opacity-70 text-xl sm:text-2xl">
						An app that allows you to manage <br className="hidden sm:block" />{" "}
						AI powered Telegram chatbots
					</p>
					<p className="pt-4 text-xl sm:text-2xl font-semibold">
						🎀✨ Just take a look at this catgirl demo
					</p>

					<Button
						asChild
						size="lg"
						className="text-lg font-bold gap-2 mt-12 w-full sm:w-[320px]"
					>
						<a
							href="https://github.com/ValiuchenkoVladyslav/tg-ollama/releases/download/1.0.0/tg-ollama_1.0.0_x64_en-US.msi"
							download="tg-ollama-installer.msi"
						>
							<ArrowDownToLine size={26} />
							Download TG-OLLAMA
						</a>
					</Button>
				</section>
			</div>
		</div>
	);
}
