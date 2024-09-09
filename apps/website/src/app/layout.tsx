import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Blue from "~/images/blue.png";
import Pink from "~/images/pink.png";
import "./globals.css";
import { ExternalLink } from "~/components/external-link";

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head />

      <body className="flex flex-col min-h-[100dvh] bg-black text-white">
        <header className="horizontal-line">
          <Link
            href="/"
            className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-white"
          >
            TD-OLLAMA
          </Link>

          <Link href="/for-devs" className="font-semibold text-xl">
            for devs
          </Link>
        </header>

        <main className="flex-1 flex *:flex-1">{children}</main>

        <footer className="horizontal-line *:text-sm sm:*:text-lg">
          <ExternalLink
            href="https://github.com/ValiuchenkoVladyslav/td-ollama"
            className="flex gap-2 items-center font-semibold opacity-70 hover:opacity-100 duration-300"
          >
            <Github size={26} />
            Project GitHub
          </ExternalLink>

          <ExternalLink
            href="https://github.com/ValiuchenkoVladyslav"
            className="font-semibold opacity-70 hover:opacity-100 duration-300"
          >
            @ValiuchenkoVladyslav
          </ExternalLink>
        </footer>

        <div className="fixed z-[-1] top-0 left-0 w-full h-full overflow-hidden">
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
