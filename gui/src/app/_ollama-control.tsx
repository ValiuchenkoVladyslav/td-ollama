"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { invoke, API } from "~/core-api";

const autostartOllamaKey = "autostartOllama";

export function OllamaControl() {
  const [isOllamaRunning, setIsOllamaRunning] = useState(false);
  const [autostartOllama, setAutostartOllama] = useState(false);

  useEffect(() => {
    const _autostartOllama = localStorage.getItem(autostartOllamaKey) === "true";

    if (_autostartOllama) {
      invoke(API.StartOllama, undefined).then(() =>
        invoke(API.CheckOllama, undefined).then((res) =>
          setIsOllamaRunning(!!res.data)));
    }

    setAutostartOllama(_autostartOllama);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Button
        className="w-full text-lg"
        onClick={() => {
          if (isOllamaRunning) {
            invoke(API.StopOllama, undefined).then(() => setIsOllamaRunning(false));
            return;
          }

          invoke(API.StartOllama, undefined).then(() => setIsOllamaRunning(true));
        }}
      >
        {isOllamaRunning ? "Stop Ollama" : "Start Ollama"}
      </Button>

      <div className="flex items-center gap-3 cursor-pointer">
        <Switch
          id={autostartOllamaKey}
          checked={autostartOllama}
          onCheckedChange={() => {
            localStorage.setItem(autostartOllamaKey, String(!autostartOllama));
            setAutostartOllama(!autostartOllama);
          }}
        />
        <label
          htmlFor={autostartOllamaKey}
          className="text-md font-medium cursor-pointer"
        >
          Autostart & stop Ollama
        </label>
      </div>
    </div>
  );
}
