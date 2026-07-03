"use client";

import { Suspense, useRef, useState } from "react";
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
import ThankYou from "@/components/global/sections/thankyou/ThankYou";
import Rencontre from "@/components/global/sections/rencontre/Rencontre";
import Navbar from "@/components/global/navbar/Navbar";
import { parseAsBoolean, useQueryState } from "nuqs";

// useQueryState() lit useSearchParams() : doit vivre sous un <Suspense>.
function OnePageContent() {
	const [showSplash, setShowSplash] = useState(true);
	// "Montrer les évènements passés" — piloté par le switch de la navbar
	const [showPast] = useQueryState("passe", parseAsBoolean);
	const videoRef = useRef<HTMLVideoElement>(null);

	const handleEnter = () => {
		// Deep-link to the gallery (QR / #photos): stay on the Photos section
		// instead of scrolling back to the top.
		if (window.location.hash.includes("photos")) {
			document.getElementById("photos")?.scrollIntoView();
		} else {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
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
		<>
			<Navbar />
			<main className="flex flex-col items-center md:items-start max-w-screen">
				<Splash
					className={cn(
						"transition-opacity duration-1000 z-50",
						showSplash ? "opacity-100" : "opacity-0 pointer-events-none",
					)}
					onClick={handleEnter}
				/>

				{/* Video section */}
				<Home videoRef={videoRef} showPast={!!showPast} />

				<Merci />
				<ThankYou />
				<Rencontre />
				{/* Évènements passés — affichés via le switch "Montrer les évènements passés" */}
				{showPast && (
					<Suspense fallback={<div>Loading...</div>}>
						<Mairie />
					</Suspense>
				)}
				{showPast && <WelcomeParty />}
				{showPast && <Soiree />}
				{showPast && <Sejour />}
				{showPast && (
					<Suspense fallback={<div>Loading...</div>}>
						<RSVP />
					</Suspense>
				)}
				<Photos />
			</main>
		</>
	);
}

export default function OnePage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<OnePageContent />
		</Suspense>
	);
}
