import { Github } from "lucide-react";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="./icon.png" sizes="any" />
			</head>

			<body className="flex flex-col min-h-screen bg-black text-white">
				<header className="vertical-line">
					<Link
						href="/"
						className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-600"
					>
						TG-OLLAMA
					</Link>

					<nav>123</nav>
				</header>

				<main className="flex-1 flex *:flex-1">{children}</main>

				<footer className="vertical-line">
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
			</body>
		</html>
	);
}
