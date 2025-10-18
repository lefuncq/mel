import Link from "next/link";
import MapPin from "@/components/global/icons/map-pin.svg";
import Section from "../Section";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const FallingFlowers = dynamic(
	() => import("@/components/global/FallingFlowers/FallingFlowers"),
	{
		ssr: false,
	},
);

export default function WelcomeParty() {
	const { ref, inView } = useInView({
		/* Optional options */
		triggerOnce: true,
		threshold: 0,
	});

	return (
		<Section
			id="welcome-party"
			extraChildren={<FallingFlowers className="z-0 opacity-80" />}
			contentWrapperClassName="md:z-10 md:bg-welcome-party/30 md:backdrop-blur-sm"
			className="bg-welcome-party"
		>
			<div className="flex flex-row items-start justify-between w-full text-left flex-1">
				<div className="flex flex-col items-start justify-between w-full">
					<h1
						className={cn(
							"text-4xl -mt-4 opacity-0",
							inView ? "animate-fade-in-left delay-100" : "",
						)}
					>
						Welcome
					</h1>
					<h4
						className={cn(
							"text-8xl -mt-2 opacity-0",
							inView ? "animate-fade-in-right delay-200" : "",
						)}
					>
						Party
					</h4>
				</div>
				<div className="flex items-center justify-end w-full">
					<h4 className="text-3xl text-right">
						Le 28 juin 2026
						<br />à 15h
					</h4>
				</div>
			</div>
			<div className="flex items-center justify-center w-full">
				<div className="w-8/12 max-w-96 aspect-square rounded-full border border-foreground overflow-hidden flex items-center justify-center">
					<img
						src="/videos/welcome.gif"
						alt="Welcome Party"
						className="w-full object-fill md:rounded-4xl md:shadow-pink-300 object-center"
						ref={ref}
					/>
					{/* <video
							src="/videos/welcome.mp4"
							autoPlay
							muted
							loop
							playsInline={true}
							className="w-full object-fill md:rounded-4xl md:shadow-pink-300 object-center"
						/> */}
				</div>
			</div>
			<div className="flex flex-col items-center justify-center">
				<h3 className="text-3xl font-harmond text-center">Pool Party/Henné</h3>
				<h4 className="text-2xl bg-accent inline-block">Thème: Flower Power</h4>
				<h3 className="text-2xl">Domaine de la Galinière</h3>
				<Link
					href="https://waze.com/ul?q=Domaine+de+la+Galinière"
					target="_blank"
					className="text-pink-800 font-harmond flex items-end justify-center text-center gap-2 border border-pink-800 rounded-full px-4 py-2"
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
