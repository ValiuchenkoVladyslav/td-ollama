import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function ollamaErrorToast() {
  toast(
    <div className="flex flex-col gap-1">
      <div>
        <h1 className="text-red-600 text-xl font-bold">
          Failed to start Ollama!
        </h1>
        <p className="text-lg">Make sure it's installed on the system</p>
      </div>
      <a
        href="https://ollama.com/download"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-lg font-semibold opacity-70 hover:opacity-100 duration-300"
      >
        <ExternalLink />
        <span>Download Ollama</span>
      </a>
    </div>,
  );
}
