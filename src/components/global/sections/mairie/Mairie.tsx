import Link from "next/link";
import MapPin from "@/components/global/icons/map-pin.svg";
import Section from "../Section";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

export default function Mairie() {
	const { ref, inView } = useInView({
		/* Optional options */
		triggerOnce: true,
		threshold: 0,
	});

	return (
		<Section id="mairie" className="bg-mairie">
			<div className="flex flex-row w-full justify-between text-right flex-1">
				<h1
					className={cn(
						"text-7xl -mt-4 opacity-0",
						inView ? "animate-fade-in-left delay-100" : "",
					)}
				>
					Mairie
				</h1>
				<h4 className="text-3xl mt-2">
					Le 17 juin 2026
					<br />à 13h40
				</h4>
			</div>
			<div className="flex items-center justify-center w-full">
				<div className="w-8/12 max-w-96 aspect-square rounded-full border border-foreground overflow-hidden flex items-center justify-center">
					<img
						src="/videos/mairie.gif"
						alt="Mairie"
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
			<div className="inline-flex flex-col w-fit mx-auto">
				<div className="justify-center text-center">
					<h3 className="text-2xl font-harmond text-center">
						À la mairie de Neuilly Sur Seine.
					</h3>
					<Link
						href="https://waze.com/ul?q=96AvAchillePeretti"
						target="_blank"
						className="text-pink-800 font-harmond inline-flex items-end justify-center text-center gap-2  border border-pink-800 rounded-full px-4 py-2"
					>
						<MapPin className="w-4 h-4" />
						<strong className="leading-[12px]">
							96 Av. Achille Peretti, 92200 Neuilly-sur-Seine
						</strong>
					</Link>
				</div>
				<hr className="flex-1 w-full border-foreground/30 my-4" />
				<div className="text-center">
					<h3 className="text-center text-2xl font-harmond">After Mairie</h3>
					<Link
						href="https://waze.com/ul?q=11rueSaintJames"
						target="_blank"
						className="text-pink-800 font-harmond inline-flex items-end justify-center text-center gap-2 border border-pink-800 rounded-full px-4 py-2"
					>
						<MapPin className="w-4 h-4" />
						<strong className="leading-[12px]">
							11 rue Saint James, 92200 Neuilly-sur-Seine
						</strong>
					</Link>
				</div>
			</div>
		</Section>
	);
}
