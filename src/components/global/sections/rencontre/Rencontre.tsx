import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

export default function Rencontre() {
	const { ref, inView } = useInView({
		triggerOnce: true,
		threshold: 0,
	});

	return (
		<section
			id="rencontre"
			className="w-screen bg-background flex items-center justify-center border-t border-foreground/30 py-17 md:py-20"
		>
			<div className="content-wrapper flex flex-col gap-10 items-center justify-center">
				<h1
					ref={ref}
					className={cn(
						"text-6xl md:text-7xl text-center opacity-0",
						inView ? "animate-fade-in-down" : "",
					)}
				>
					La Rencontre
				</h1>
				<div className="w-full max-w-[600px] flex items-center justify-center">
					{/** biome-ignore lint/a11y/useMediaCaption: wedding video */}
					<video
						src="https://jsqbvimr6o.ufs.sh/f/y4gNqH1U0qENkc5GlR1MHOGdDPRm75bQe4p3fcB6VMkFjoUi"
						playsInline
						controls
						preload="metadata"
						className="w-full h-auto object-cover rounded-4xl shadow-[0px_4px_100px_0px] shadow-pink-300"
					/>
				</div>
			</div>
		</section>
	);
}
