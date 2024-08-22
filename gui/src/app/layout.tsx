import { Separator } from "~/components/ui/separator";
import ClientInit from "./_client-init";
import { OllamaControl } from "./_ollama-control";
import WindowButtons from "./_window-buttons";
import "./globals.css";
import { SquareChevronRight } from "lucide-react";

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <ClientInit />

      <body className="fixed w-screen h-screen flex flex-col">
        <header
          data-tauri-drag-region
          className="flex items-center justify-between h-9"
        >
          <h1 className="pl-3 text-lg font-medium opacity-70">TG-LLAMA bot manager</h1>

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
                Bot commands info
              </h1>
              <p className="text-sm opacity-70">
                <code>/addUser [user id]</code> — Add allowed user
              </p>
              <p className="text-sm opacity-70">
                <code>/removeUser [user id]</code> — Remove allowed user
              </p>
              <p className="text-sm opacity-70">
                <code>/system [message]</code> — Edit system message
              </p>
              <p className="text-sm opacity-70">
                <code>/stop</code> — Stop the bot
              </p>
            </div>
          </section>

          <section className="bg-white rounded-tl-md flex-1 overflow-y-scroll p-8">
            {children}
          </section>
        </main>
      </body>
    </html>
  );
}
