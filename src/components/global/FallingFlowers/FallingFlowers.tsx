import React, { useMemo } from "react";

type FallingFlowersProps = {
	/** Image URL for the flower sprite */
	imageSrc?: string;
	/** How many flowers to render at once */
	count?: number;
	/** Minimum and maximum rendered width in pixels */
	sizeRangePx?: [number, number];
	/** Fall duration range in seconds (slower = more floaty) */
	fallDurationRangeSec?: [number, number];
	/** Horizontal sway duration range in seconds */
	swayDurationRangeSec?: [number, number];
	/** Rotation duration range in seconds */
	spinDurationRangeSec?: [number, number];
	/** Optional className for the absolute container */
	className?: string;
};

export default function FallingFlowers({
	imageSrc = "/images/flower.png",
	count = 15,
	sizeRangePx = [22, 35],
	fallDurationRangeSec = [12, 24],
	swayDurationRangeSec = [3.5, 7.5],
	spinDurationRangeSec = [6, 16],
	className = "",
}: FallingFlowersProps) {
	// precompute seeds so the layout is stable between renders
	const flowers = useMemo(() => {
		const rand = (min: number, max: number) =>
			Math.random() * (max - min) + min;
		const arr = Array.from({ length: count }, (_, i) => {
			const left = Math.random() * 90; // percentage across the screen
			const width = rand(sizeRangePx[0], sizeRangePx[1]);
			const fall = rand(fallDurationRangeSec[0], fallDurationRangeSec[1]);
			const sway = rand(swayDurationRangeSec[0], swayDurationRangeSec[1]);
			const spin = rand(spinDurationRangeSec[0], spinDurationRangeSec[1]);
			const delay = -Math.random() * fall; // negative delay to desync starts
			const swayAmp = (Math.random() * 18 + 6) * (Math.random() < 0.5 ? -1 : 1); // px
			const spinDir = Math.random() < 0.5 ? -1 : 1;
			const opacity = Math.random() * 0.4 + 0.4; // 0.4–0.8
			return {
				id: i,
				left,
				width,
				fall,
				sway,
				spin,
				delay,
				swayAmp,
				spinDir,
				opacity,
			};
		});
		return arr;
	}, [
		count,
		sizeRangePx,
		fallDurationRangeSec,
		swayDurationRangeSec,
		spinDurationRangeSec,
	]);

	return (
		<div
			className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
			aria-hidden="true"
		>
			<style>{`
        /* Container keyframes */
        @keyframes ff-fall {
          from { transform: translateY(-10vh); }
          to   { transform: translateY(110vh); }
        }
        @keyframes ff-sway {
          from { transform: translateX(var(--ff-sway-start, -8px)); }
          to   { transform: translateX(var(--ff-sway-end, 8px)); }
        }
        @keyframes ff-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(var(--ff-rot, 360deg)); }
        }

        .ff-flower {
          position: absolute;
          top: -10vh;
          will-change: transform;
          filter: drop-shadow(0 2px 2px rgba(0,0,0,0.08));
        }
        .ff-fall {
          animation-name: ff-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .ff-sway {
          animation-name: ff-sway;
          animation-direction: alternate;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .ff-spin {
          animation-name: ff-spin;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          transform-origin: 50% 50%;
          will-change: transform;
          display: block;
        }

        /* Accessibility: drastically reduce motion if the user prefers */
        @media (prefers-reduced-motion: reduce) {
          .ff-fall, .ff-sway, .ff-spin {
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

			{flowers.map((f) => (
				<div
					key={f.id}
					className="ff-flower"
					style={{
						left: `${f.left}%`,
						// fall layer
					}}
				>
					<div
						className="ff-fall"
						style={{
							animationDuration: `${f.fall}s`,
							animationDelay: `${f.delay}s`,
						}}
					>
						<div
							className="ff-sway"
							style={{
								// sway amplitude via CSS vars (start/end)
								// randomize direction by swapping start/end with the sign of swayAmp
								["--ff-sway-start" as any]: `${-f.swayAmp}px`,
								["--ff-sway-end" as any]: `${f.swayAmp}px`,
								animationDuration: `${f.sway}s`,
								animationDelay: `${Math.random() * 2}s`,
							}}
						>
							<img
								src={imageSrc}
								alt=""
								className="ff-spin"
								style={{
									width: `${f.width}px`,
									opacity: f.opacity,
									animationDuration: `${f.spin}s`,
									animationDelay: `${Math.random() * 2}s`,
									["--ff-rot" as any]: `${360 * f.spinDir}deg`,
								}}
								draggable={false}
							/>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
