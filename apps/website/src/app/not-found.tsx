import { createMetadata } from "~/meta";

export const metadata = createMetadata("Page not found!");

export default function NotFound() {
	return (
		<div className="flex items-center justify-center flex-col gap-4">
			<h1 className="text-3xl sm:text-5xl font-extrabold">
				PAGE NOT FOUND O.0
			</h1>
			<p className="text-xl sm:text-2xl opacity-75">
				btw how did you get there?
			</p>
		</div>
	);
}
