"use client";

import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { manageOllamaKey, useAppStore } from "~/store";

export function OllamaControl() {
  const { manageOllama, setManageOllama, isOllamaRunning, setIsOllamaRunning } = useAppStore();

  return (
    <div className="flex flex-col gap-2">
      <Button
        className="w-full text-lg"
        onClick={() => setIsOllamaRunning(!isOllamaRunning)}
      >
        {isOllamaRunning ? "Stop Ollama" : "Start Ollama"}
      </Button>

      <div className="flex items-center gap-3 cursor-pointer">
        <Switch
          id={manageOllamaKey}
          checked={manageOllama}
          onCheckedChange={() => setManageOllama(!manageOllama)}
        />
        <label
          htmlFor={manageOllamaKey}
          className="text-md font-medium cursor-pointer"
        >
          Autostart & stop Ollama
        </label>
      </div>
    </div>
  );
}
