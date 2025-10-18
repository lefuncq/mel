"use client";

import Flower from "@/components/global/icons/flower.svg";
import Logo from "@/components/global/icons/logo.svg";
import VolumeOff from "@/components/global/icons/volume-off.svg";
import Volume2 from "@/components/global/icons/volume-2.svg";
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const scrollToSection = (id: string) => {
	const el = document.getElementById(id);
	if (!el) return;

	const headerHeight = 0; // adjust for your sticky navbar height
	const y = el.getBoundingClientRect().top + window.scrollY - headerHeight;

	window.scrollTo({ top: y, behavior: "smooth" });
};

function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [isMuted, setIsMuted] = useState(false);

	// lock/unlock scroll
	useEffect(() => {
		const root = document.documentElement;
		if (isOpen) {
			const sbw = window.innerWidth - root.clientWidth;
			root.style.overflow = "hidden";
			root.style.paddingRight = `${sbw}px`;
		} else {
			root.style.overflow = "";
			root.style.paddingRight = "";
		}
		return () => {
			root.style.overflow = "";
			root.style.paddingRight = "";
		};
	}, [isOpen]);

	const handleMute = (previousIsMuted: boolean) => {
		setIsMuted(!previousIsMuted);
		document.querySelectorAll("video, audio").forEach((elem: Element) => {
			if (
				elem instanceof HTMLVideoElement ||
				elem instanceof HTMLAudioElement
			) {
				elem.muted = !previousIsMuted;
			}
		});
	};

	return (
		<>
			<header className="w-full sticky top-0 left-0 z-50 bg-background/80 backdrop-blur-sm text-foreground">
				<div className="border-b border-gray-400 h-17">
					<div className="w-full h-full flex justify-between items-center px-5 md:content-wrapper">
						<Logo className="w-20" />
						<div className="flex items-center gap-2">
							<button
								type="button"
								className={cn(
									"cursor-pointer group inline-flex w-8 h-8 text-slate-800 bg-background text-center items-center justify-center rounded shadow-[0_1px_0_theme(colors.slate.950/.04),0_1px_2px_theme(colors.slate.950/.12),inset_0_-2px_0_theme(colors.slate.950/.04)] hover:shadow-[0_1px_0_theme(colors.slate.950/.04),0_4px_8px_theme(colors.slate.950/.12),inset_0_-2px_0_theme(colors.slate.950/.04)] transition",
									isMuted ? "bg-accent" : "bg-background",
								)}
								aria-pressed={isMuted ? "true" : "false"}
								onClick={() => {
									handleMute(isMuted);
								}}
							>
								{isMuted ? (
									<VolumeOff className="w-4 h-4" />
								) : (
									<Volume2 className="w-4 h-4" />
								)}
							</button>
							<button
								type="button"
								className="cursor-pointer group inline-flex w-8 h-8 text-slate-800 bg-background text-center items-center justify-center rounded shadow-[0_1px_0_theme(colors.slate.950/.04),0_1px_2px_theme(colors.slate.950/.12),inset_0_-2px_0_theme(colors.slate.950/.04)] hover:shadow-[0_1px_0_theme(colors.slate.950/.04),0_4px_8px_theme(colors.slate.950/.12),inset_0_-2px_0_theme(colors.slate.950/.04)] transition"
								aria-pressed={isOpen ? "true" : "false"}
								onClick={() => {
									setIsOpen(!isOpen);
								}}
							>
								<span className="sr-only">Menu</span>
								<svg
									className="w-4 h-4 fill-current pointer-events-none"
									viewBox="0 0 16 16"
									xmlns="http://www.w3.org/2000/svg"
								>
									<title>Menu</title>
									<rect
										className="origin-center -translate-y-[5px] translate-x-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-[[aria-pressed=true]]:translate-x-0 group-[[aria-pressed=true]]:translate-y-0 group-[[aria-pressed=true]]:rotate-[315deg]"
										y="7"
										width="9"
										height="2"
										rx="1"
									></rect>
									<rect
										className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-[[aria-pressed=true]]:rotate-45"
										y="7"
										width="16"
										height="2"
										rx="1"
									></rect>
									<rect
										className="origin-center translate-y-[5px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-[[aria-pressed=true]]:translate-y-0 group-[[aria-pressed=true]]:rotate-[135deg]"
										y="7"
										width="9"
										height="2"
										rx="1"
									></rect>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Fullscreen overlay OUTSIDE the header */}
			<div
				id="mobile-menu"
				aria-hidden={!isOpen}
				className={cn(
					"fixed inset-0 z-40 bg-background/80 backdrop-blur-md transition-opacity ease-out duration-300 w-screen h-screen text-foreground",
					isOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none",
				)}
			>
				{/* push content below header height */}
				<div className="h-full w-full">
					<NavigationMenu className="w-full h-full max-w-full">
						<NavigationMenuList className="flex flex-col items-start justify-center p-4 w-full">
							<NavigationMenuItem
								className={cn(
									"transition-all duration-500 ease-out",
									isOpen
										? "translate-y-0 opacity-100"
										: "translate-y-12 opacity-0",
								)}
							>
								<NavigationMenuLink
									onSelect={() => {
										setIsOpen(false);
										scrollToSection("mairie");
									}}
									className="flex duration-150 ease-out flex-row items-end gap-2 text-foreground"
								>
									<Flower className="size-7 text-foreground stroke-1" />
									<span className="leading-[20px]">Accueil</span>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem
								className={cn(
									"transition-all duration-500 ease-out",
									isOpen
										? "translate-y-0 opacity-100"
										: "translate-y-12 opacity-0",
								)}
							>
								<NavigationMenuLink
									onSelect={() => {
										setIsOpen(false);
										scrollToSection("mairie");
									}}
									className="flex duration-150 ease-out flex-row items-end gap-2 text-foreground"
								>
									<Flower className="size-7 text-foreground stroke-1" />
									<span className="leading-[20px]">Mairie</span>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem
								className={cn(
									"transition-all duration-500 ease-out",
									isOpen
										? "translate-y-0 opacity-100"
										: "translate-y-12 opacity-0",
								)}
							>
								<NavigationMenuLink
									onSelect={() => {
										setIsOpen(false);
										scrollToSection("welcome-party");
									}}
									className="flex duration-150 ease-out flex-row items-end gap-2 text-foreground"
								>
									<Flower className="size-7 text-foreground stroke-1" />
									<span className="leading-[15px]">Welcome Party</span>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem
								className={cn(
									"transition-all duration-500 ease-out",
									isOpen
										? "translate-y-0 opacity-100"
										: "translate-y-12 opacity-0",
								)}
							>
								<NavigationMenuLink
									onSelect={() => {
										setIsOpen(false);
										scrollToSection("soiree");
									}}
									className="flex duration-150 ease-out flex-row items-end gap-2 text-foreground"
								>
									<Flower className="size-7 text-foreground stroke-1" />
									<span className="leading-[15px]">Soirée</span>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem
								className={cn(
									"transition-all duration-500 ease-out",
									isOpen
										? "translate-y-0 opacity-100"
										: "translate-y-12 opacity-0",
								)}
							>
								<NavigationMenuLink
									onSelect={() => {
										setIsOpen(false);
										scrollToSection("sejour");
									}}
									className="flex duration-150 ease-out flex-row items-end gap-2 text-foreground"
								>
									<Flower className="size-7 text-foreground stroke-1" />
									<span className="leading-[15px]">Votre Séjour</span>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem
								className={cn(
									"transition-all duration-500 ease-out",
									isOpen
										? "translate-y-0 opacity-100"
										: "translate-y-12 opacity-0",
								)}
							>
								<NavigationMenuLink
									onSelect={() => {
										setIsOpen(false);
										scrollToSection("rsvp");
									}}
									className="flex duration-150 ease-out flex-row items-end gap-2 text-foreground"
								>
									<Flower className="size-7 text-foreground stroke-1" />
									<span className="leading-[15px]">RSVP</span>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem
								className={cn(
									"transition-all duration-500 ease-out",
									isOpen
										? "translate-y-0 opacity-100"
										: "translate-y-12 opacity-0",
								)}
							>
								<NavigationMenuLink
									onSelect={() => {
										setIsOpen(false);
									}}
									href="/photos"
									className="flex duration-150 ease-out flex-row items-end gap-2 text-foreground"
								>
									<Flower className="size-7 text-foreground stroke-1" />
									<span className="leading-[15px]">Gallerie Photos</span>
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
			</div>
		</>
	);
}

export default Navbar;
