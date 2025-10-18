import Link from "next/link";
import MapPin from "@/components/global/icons/map-pin.svg";
import Section from "../Section";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

export default function Soiree() {
	const { ref, inView } = useInView({
		/* Optional options */
		triggerOnce: true,
		threshold: 0,
	});

	return (
		<Section id="soiree" className="bg-black text-white">
			<div className="flex flex-row items-start justify-between w-full text-right flex-1">
				<h1
					className={cn(
						"text-7xl text-soiree -mt-4 opacity-0",
						inView ? "animate-fade-in-left delay-100" : "",
					)}
				>
					Soirée
				</h1>
				<h4 className="text-3xl mt-2">
					Le 29 juin 2026
					<br />à 17h30
				</h4>
			</div>
			<div className="flex items-center justify-center w-full">
				<div className="w-8/12 max-w-96 aspect-square rounded-full border border-foreground overflow-hidden flex items-center justify-center">
					<img
						src="/videos/soiree.gif"
						alt="Soirée"
						className="w-full object-fill md:rounded-4xl md:shadow-pink-300 object-center"
						ref={ref}
					/>
					{/* <video
							src="/videos/mairie.mp4"
							autoPlay
							muted
							loop
							playsInline={true}
							className="w-full object-fill md:rounded-4xl md:shadow-pink-300 object-center"
						/> */}
				</div>
			</div>
			<div className="flex-1 items-center justify-center text-center">
				<h3 className="text-2xl">Domaine de la Galinière</h3>
				<Link
					href="https://waze.com/ul?q=Domaine+de+la+Galinière"
					target="_blank"
					className="text-soiree font-harmond inline-flex items-end justify-center text-center gap-2 border border-soiree rounded-full px-4 py-2"
				>
					<MapPin className="w-4 h-4" />
					<strong className="leading-[12px]">
						D7N, 13790 Châteauneuf-le-Rouge
					</strong>
				</Link>
			</div>
		</Section>
	);
}
