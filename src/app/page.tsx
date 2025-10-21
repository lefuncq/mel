"use client";

import { useRef, useState } from "react";
import Home from "@/components/global/sections/home/Home";
import Mairie from "@/components/global/sections/mairie/Mairie";
import WelcomeParty from "@/components/global/sections/wp/WelcomeParty";
import Soiree from "@/components/global/sections/soiree/Soiree";
import Merci from "@/components/global/sections/merci/merci";
import Sejour from "@/components/global/sections/sejour/Sejour";
import Splash from "@/components/global/sections/Splash/Splash";
import RSVP from "@/components/global/sections/rsvp/RSVP";
import { cn } from "@/lib/utils";
import Photos from "@/components/global/sections/photos/Photos";

export default function OnePage() {
	const [showSplash, setShowSplash] = useState(true);
	const videoRef = useRef<HTMLVideoElement>(null);

	const handleEnter = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		setShowSplash(false);

		const v = videoRef.current;
		if (!v) return;

		// Ensure it starts fresh with sound
		v.currentTime = 0;
		v.muted = false;
		v.playsInline = true;

		// Safari may need the play call wrapped in the user gesture
		v.play().catch((err) => {
			console.warn("Video play blocked:", err);
		});
	};

	return (
		<main className="flex flex-col items-center md:items-start max-w-screen">
			<Splash
				className={cn(
					"transition-opacity duration-1000 z-50",
					showSplash ? "opacity-100" : "opacity-0 pointer-events-none",
				)}
				onClick={handleEnter}
			/>

			{/* Video section */}
			<Home videoRef={videoRef} />

			<Merci />
			<Mairie />
			<WelcomeParty />
			<Soiree />
			<Sejour />
			<RSVP />
			<Photos />
		</main>
	);
}
