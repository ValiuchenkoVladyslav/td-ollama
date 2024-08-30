export default function Home() {
	return (
		<div className="flex items-center justify-center gap-8">
			<section className="md:h-[380px] flex justify-start items-end flex-col gap-2">
				<h1 className="text-right text-4xl font-bold">
					TG-OLLAMA — <br />
					Telegram Ollama bot manager
				</h1>
				<p className="text-right opacity-70 text-2xl">
					An app that allows you to manage <br />
					AI powered Telegram chatbots
				</p>
				<p className="text-right text-2xl font-semibold">
					{"Just take a look at this catgirl demo 🎀✨ ->"}
				</p>
			</section>

			<video
				className="md:h-[380px] md:w-[674px]"
				controls
				loop
				muted
				autoPlay
				disablePictureInPicture
				controlsList="nodownload noremoteplayback noplaybackrate"
			>
				<source
					src="https://github.com/user-attachments/assets/038a9257-7d12-4cfd-8ac8-5551fd53ed9a"
					type="video/mp4"
				/>
			</video>
		</div>
	);
}
