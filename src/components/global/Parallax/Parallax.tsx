// components/Parallax.tsx
import React from "react";
import { useParallax } from "@/hooks/useParallax"; // your smoother mobile-friendly hook
import { cn } from "@/lib/utils";

const hasCSSScrollAnim = () =>
	typeof window !== "undefined" &&
	// This is the best single-feature probe for modern engines
	CSS?.supports?.("animation-timeline: view()");

type Props = {
	children: React.ReactNode;
	as?: keyof JSX.IntrinsicElements;
	className?: string;
	/** CSS version strength, in rem. e.g., 18–26rem feels nice. */
	shiftRem?: number;
	/** JS fallback knobs */
	strength?: number;
	speed?: number;
};

export function Parallax({
	children,
	as: Tag = "div",
	className,
	shiftRem = 20, // strength for CSS path
	strength = 160, // strength for JS fallback
	speed = 0.32, // speed for JS fallback
}: Props) {
	const supported = hasCSSScrollAnim();

	if (supported) {
		// Pure CSS path — buttery smooth
		return (
			<Tag
				className={cn("parallax-y", className)}
				style={{ ["--shift" as any]: `${shiftRem}rem` }}
				aria-live="off"
			>
				{children}
			</Tag>
		);
	}

	// JS fallback path (mobile-friendly hook you added earlier)
	const { ref, style } = useParallax({ strength, speed, clamp: true });
	return (
		<Tag ref={ref as any} style={style} className={className} aria-live="off">
			{children}
		</Tag>
	);
}
