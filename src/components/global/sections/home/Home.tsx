import Link from "next/link";
import ArrowRight from "@/components/global/icons/arrow-right.svg";
import { Button } from "@/components/ui/button";
import Ampersand from "@/components/global/icons/ampersand.svg";
import { type RefObject } from "react";

export default function Home({
	videoRef,
}: {
	videoRef: RefObject<HTMLVideoElement>;
}) {
	return (
		<section
			id="home"
			className="h-svh -mt-17 md:py-17 md:flex md:flex-col md:items-center md:justify-center relative md:content-wrapper"
		>
			<div className="h-full md:flex md:items-center md:justify-center md:max-w-screen md:gap-10 md:h-6/12 md:flex-1 relative">
				<div className="h-full md:h-3/4 md:flex-1 md:flex md:items-center md:justify-center">
					{/** biome-ignore lint/a11y/useMediaCaption: wedding video */}
					<video
						ref={videoRef}
						src="/videos/homecpplus.mp4"
						playsInline
						loop
						preload="metadata"
						poster="/images/homeposter.jpg" // fallback image (optional)
						controls={false}
						className="h-full md:h-[600px] md:w-auto md:max-w-full object-cover md:rounded-4xl md:shadow-[0px_4px_100px_0px] md:shadow-pink-300"
					/>
				</div>

				{/* your right-side content remains unchanged */}
				<div className="md:flex-1 hidden md:flex md:flex-col md:gap-10 items-start justify-center text-center">
					<div>
						<div className="md:flex-1 hidden md:flex items-center justify-center">
							<div className="flex flex-col gap-4">
								<div className="flex flex-row gap-4">
									<h1 className="text-3xl font-bold max-w-md">
										Sabine et Jacques-Laurent
										<br />
										<strong className="bg-pink-100 text-6xl">Herszkorn</strong>
									</h1>
									<div className="flex items-center justify-center">
										<Ampersand className="w-10 h-10 stroke-foreground" />
									</div>
									<h1 className="text-3xl font-bold max-w-md">
										Penina et Xavier <br />
										<strong className="bg-pink-100 text-6xl">Strubel</strong>
									</h1>
								</div>
								<h3 className="text-3xl font-bold max-w-md">
									Sont heureux de vous convier au mariage de leurs enfants
								</h3>
								<h1 className="text-6xl font-bold max-w-md">
									<strong className="bg-pink-100">Melissa et Théo</strong>
								</h1>
							</div>
						</div>
						<Button variant="outline" className="mt-10">
							<Link href="#mairie" className="flex items-center gap-2">
								<ArrowRight className="w-4 h-4" />
								Cliquez ici pour les détails
							</Link>
						</Button>
					</div>
				</div>

				<div className="w-full h-svh md:h-full pointer-events-none absolute top-0 left-0 right-0 flex justify-center items-end pb-10">
					<Link href="#mairie" className="scroll-indicator h-10">
						<span className="!border-white md:!border-foreground"></span>
						<span className="!border-white md:!border-foreground"></span>
						<span className="!border-white md:!border-foreground"></span>
					</Link>
				</div>
			</div>
		</section>
	);
}
