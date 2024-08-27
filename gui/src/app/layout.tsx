import { Separator } from "~/components/ui/separator";
import ClientInit from "./_client-init";
import { OllamaControl } from "./_ollama-control";
import WindowButtons from "./_window-buttons";
import { SquareChevronRight } from "lucide-react";
import "./globals.css";

export default function RootLayout({ children }: React.PropsWithChildren) {
	return (
		<html lang="en">
			<ClientInit />

			<body className="fixed w-screen h-screen flex flex-col">
				<header
					data-tauri-drag-region
					className="flex items-center justify-between h-9"
				>
					<h1 className="pl-3 text-lg font-medium opacity-70">
						TG-OLLAMA bot manager
					</h1>

					<menu className="flex *:grid *:place-content-center *:w-10 *:h-9">
						<WindowButtons />
					</menu>
				</header>

				<main className="flex h-[calc(100vh-36px)]">
					<section className="w-[340px] px-3 flex flex-col gap-6">
						<OllamaControl />

						<Separator />

						<div className="flex flex-col gap-2">
							<h1 className="text-xl font-bold flex items-center">
								<SquareChevronRight size={28} className="inline mr-2" />
								Additional info
							</h1>
							<p className="opacity-70">
								* Keep in mind ollama api has no option to unload the model,
                so after stopping the bot it just hangs in memory. Restart
                ollama server manually to get rid of it.
							</p>
						</div>
					</section>

					<section className="bg-white rounded-tl-md flex-1 overflow-y-scroll p-8">
		        <div className="grid grid-cols-2 gap-8 *:h-[320px]">
              {children}
		        </div>
					</section>
				</main>
			</body>
		</html>
	);
}
