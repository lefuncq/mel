"use client";
import React, { useEffect, useMemo, useState } from "react";

export type CaptchaImage = {
	id: string;
	src: string;
	alt?: string;
	isTarget?: boolean;
};

export type CaptchaProps = {
	images: CaptchaImage[];
	targetLabel?: string;
	question?: string;
	rows?: number;
	cols?: number;
	requiredSelections?: number;
	shuffle?: boolean;
	onSolve?: (correctIds: string[]) => void;
	onFail?: () => void;
	className?: string;
};

export default function CaptchaMock({
	images,
	targetLabel = "Select the couple",
	question = "Which images show the couple?",
	rows = 3,
	cols = 3,
	requiredSelections,
	shuffle = true,
	onSolve,
	onFail,
	className,
}: CaptchaProps) {
	const autoRequired = useMemo(
		() => images.filter((i) => i.isTarget).length || 1,
		[images],
	);
	const required = requiredSelections ?? autoRequired;

	const [shuffled, setShuffled] = useState(() => {
		const copy = [...images].slice(0, rows * cols);
		if (shuffle) {
			for (let i = copy.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[copy[i], copy[j]] = [copy[j], copy[i]];
			}
		}
		return copy;
	});

	const [selected, setSelected] = useState<Record<string, boolean>>({});
	const [solved, setSolved] = useState(false);
	const [attempted, setAttempted] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		setSelected({});
		setSolved(false);
		setAttempted(false);
		setMessage(null);
		setShuffled(() => {
			const copy = [...images].slice(0, rows * cols);
			if (shuffle) {
				for (let i = copy.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[copy[i], copy[j]] = [copy[j], copy[i]];
				}
			}
			return copy;
		});
	}, [images, rows, cols, shuffle]);

	const toggle = (id: string) => {
		if (solved) return;
		setSelected((s) => ({ ...s, [id]: !s[id] }));
	};

	const submit = () => {
		setAttempted(true);
		const chosenIds = Object.keys(selected).filter((k) => selected[k]);
		const correctChosen = chosenIds.filter(
			(id) => shuffled.find((i) => i.id === id)?.isTarget === true,
		);
		const allCorrectCount = shuffled.filter((i) => i.isTarget).length;
		const isPerfect =
			correctChosen.length === allCorrectCount &&
			chosenIds.length === correctChosen.length &&
			correctChosen.length === required;

		if (isPerfect) {
			setSolved(true);
			setMessage("Nice! You're in. 🎉");
			onSolve?.(correctChosen);
		} else {
			setMessage("Not quite — try again.");
			onFail?.();
		}
	};

	const reset = () => {
		setSelected({});
		setAttempted(false);
		setMessage(null);
		setSolved(false);
		if (shuffle) {
			setShuffled((prev) => {
				const copy = [...images].slice(0, rows * cols);
				for (let i = copy.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[copy[i], copy[j]] = [copy[j], copy[i]];
				}
				return copy;
			});
		}
	};

	const gridStyle = { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` };

	return (
		<div
			className={`max-w-lg mx-auto p-4 border rounded-md bg-gray-50 ${className ?? ""}`}
		>
			<div className="mb-2 text-xl font-medium text-gray-700">
				{targetLabel}
			</div>
			<div className="mb-3 text-xs text-gray-600">{question}</div>

			<div
				className="grid gap-2 w-full mb-3"
				style={gridStyle}
				role="group"
				aria-label={question}
			>
				{shuffled.map((img) => {
					const isSel = !!selected[img.id];
					const isWrongSelected =
						attempted && !solved && isSel && img.isTarget !== true;
					return (
						<button
							key={img.id}
							onClick={() => toggle(img.id)}
							type="button"
							aria-pressed={isSel}
							className={`relative aspect-square overflow-hidden rounded-md border focus:outline-none focus:ring-2 focus:ring-offset-1
                ${isSel ? "ring-2 ring-offset-2 ring-indigo-500 scale-[.995]" : "border-gray-200"}
                ${isWrongSelected ? "animate-shake" : ""}
              `}
							style={{
								transition: "transform .12s ease, box-shadow .12s ease",
							}}
						>
							<img
								src={img.src}
								alt={img.alt ?? "captcha-image"}
								className="object-cover w-full h-full"
								draggable={false}
							/>
							<span
								aria-hidden
								className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold
                  ${isSel ? "bg-indigo-600" : "bg-black/30"}`}
							>
								{isSel ? "✓" : ""}
							</span>
						</button>
					);
				})}
			</div>

			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={submit}
					disabled={solved}
					className={`px-3 py-1 rounded-md text-sm font-semibold ${
						solved
							? "bg-green-400 text-white"
							: "bg-indigo-600 text-white hover:bg-indigo-700"
					} disabled:opacity-60`}
				>
					Verify
				</button>

				<button
					type="button"
					onClick={reset}
					className="px-3 py-1 rounded-md text-sm border bg-white"
				>
					Reset
				</button>

				<div className="ml-auto text-xs text-gray-500">
					{Object.keys(selected).filter((k) => selected[k]).length}/{required}
				</div>
			</div>

			{message && (
				<div
					role="status"
					className={`mt-3 text-sm ${solved ? "text-green-700" : "text-red-600"}`}
				>
					{message}
				</div>
			)}

			<style jsx>{`
        .animate-shake { animation: shake 420ms; }
        @keyframes shake {
          0% { transform: translateX(0) }
          25% { transform: translateX(-4px) }
          50% { transform: translateX(4px) }
          75% { transform: translateX(-2px) }
          100% { transform: translateX(0) }
        }
      `}</style>
		</div>
	);
}
