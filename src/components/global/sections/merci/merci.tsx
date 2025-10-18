import Ampersand from "@/components/global/icons/ampersand.svg";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

function Merci() {
	const { ref, inView } = useInView({
		/* Optional options */
		triggerOnce: true,
		threshold: 0,
	});

	return (
		<section
			id="merci"
			className="md:hidden w-screen bg-background flex items-center justify-center border-t border-foreground/30 py-36"
		>
			<div className="max-h-svh content-wrapper text-center flex flex-col gap-4 items-center justify-center">
				<div className="flex gap-10 w-full items-center justify-center">
					<h1 className="inline-block w-fit text-4xl text-center">
						<span className="text-[20px]">Pénina et Xavier</span>
						<br />
						<strong className="bg-accent">Strubel</strong>
					</h1>
					<h1 className="inline-block w-fit text-4xl text-center">
						<span className="text-[20px]">Sabine et Jacques-Laurent</span>
						<br />
						<strong className="bg-accent">Herszkorn</strong>
					</h1>
				</div>
				<Ampersand className="w-10 h-10 fill-foreground" />
				<h3 className="inline-block w-fit text-3xl text-center">
					Sont heureux de vous convier au mariage de leurs enfants
				</h3>
				<h1
					className={cn(
						"inline-block w-fit text-4xl bg-accent text-center opacity-0",
						inView ? "animate-fade-in-up" : "",
					)}
					ref={ref}
				>
					Mélissa et Théo
				</h1>
			</div>
		</section>
	);
}

export default Merci;
