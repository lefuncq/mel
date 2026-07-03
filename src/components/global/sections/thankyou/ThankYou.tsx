import { useInView } from "react-intersection-observer";
import Ampersand from "@/components/global/icons/ampersand.svg";
import { cn } from "@/lib/utils";

export default function ThankYou() {
	const { ref, inView } = useInView({
		triggerOnce: true,
		threshold: 0,
	});

	return (
		<section
			id="thankyou"
			className="w-screen bg-background flex items-center justify-center border-t border-foreground/30 py-24 md:py-36"
		>
			<div
				ref={ref}
				className={cn(
					"content-wrapper max-w-2xl text-center flex flex-col gap-6 items-center justify-center opacity-0",
					inView ? "animate-fade-in-up" : "",
				)}
			>
				<Ampersand className="w-10 h-10 fill-foreground" />
				<h2 className="text-4xl font-harmond">Un grand merci</h2>
				<p className="text-2xl leading-relaxed">
					Un grand merci d'avoir été là, tout simplement. D'avoir traversé la
					France — et parfois bien plus — pour célébrer notre amour à nos
					côtés. Vos rires, vos larmes de joie et votre présence ont fait de
					cette journée le plus beau jour de notre vie.
					<br />
					<br />
					Nous en garderons le souvenir pour toujours. Et si ces pages
					existent, c'est pour revivre ensemble, encore un peu, la magie de ce
					moment.
				</p>
				<h3 className="text-3xl bg-pink-100 inline-block">
					Avec tout notre amour,
					<br />
					Mélissa &amp; Théo
				</h3>
			</div>
		</section>
	);
}
