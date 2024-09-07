import { ExternalLink } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Button } from "~/components/ui/button";
import { createMetadata } from "~/meta";

export const metadata = createMetadata("For Developers");

export default async function ForDevsPage() {
  const source = await fetch(
    "https://raw.githubusercontent.com/ValiuchenkoVladyslav/td-ollama/main/docs/DEVELOPMENT.md",
  );

  return (
    <div className="prose prose-invert md:prose-lg lg:prose-xl py-36">
      <div className="!w-[100vw] px-8 md:px-[16vw]">
        <MDXRemote source={await source.text()} />

        <div className="w-full flex justify-center pt-12">
          <Button size="lg" asChild>
            <a
              href="https://github.com/ValiuchenkoVladyslav/td-ollama/blob/main/docs/DEVELOPMENT.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold flex gap-3 items-center"
            >
              <ExternalLink />
              Edit this page on GitHub
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
