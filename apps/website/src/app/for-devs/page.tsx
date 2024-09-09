import { ExternalLink as ELIcon } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ExternalLink } from "~/components/external-link";
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
            <ExternalLink
              href="https://github.com/ValiuchenkoVladyslav/td-ollama/blob/main/docs/DEVELOPMENT.md"
              className="text-xl font-semibold flex gap-3 items-center"
            >
              <ELIcon />
              Edit this page on GitHub
            </ExternalLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
