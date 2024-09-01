import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import Blue from "~/images/blue.png";
import Pink from "~/images/pink.png";
import "./globals.css";

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<head />

			<body className="flex flex-col min-h-[100dvh] bg-black text-white">
				<header className="horizontal-line">
					<Link
						href="/"
						className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-white"
					>
						TG-OLLAMA
					</Link>

					<a
						href="https://github.com/ValiuchenkoVladyslav/tg-ollama/blob/main/docs/DEVELOPMENT.md"
						target="_blank"
						rel="noopener noreferrer"
						className="font-semibold text-lg"
					>
						for devs
					</a>
				</header>

				<main className="flex-1 flex *:flex-1">{children}</main>

				<footer className="horizontal-line *:text-sm sm:*:text-lg">
					<a
						href="https://github.com/ValiuchenkoVladyslav/tg-ollama"
						target="_blank"
						rel="noopener noreferrer"
						className="flex gap-2 items-center font-semibold opacity-70 hover:opacity-100 duration-300"
					>
						<Github size={26} />
						Project GitHub
					</a>

					<a
						href="https://github.com/ValiuchenkoVladyslav"
						target="_blank"
						rel="noopener noreferrer"
						className="font-semibold opacity-70 hover:opacity-100 duration-300"
					>
						@ValiuchenkoVladyslav
					</a>
				</footer>

				<div className="absolute z-[-1] top-0 left-0 w-screen h-[100dvh] overflow-hidden">
					<Image
						alt=""
						src={Blue}
						width={500}
						className="absolute !w-[max(50vw,500px)]"
					/>
					<Image
						alt=""
						src={Pink}
						width={500}
						className="absolute right-0 bottom-0 opacity-35 !w-[max(50vw,500px)]"
					/>
				</div>
			</body>
		</html>
	);
}
