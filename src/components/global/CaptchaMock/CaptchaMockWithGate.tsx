"use client";
import React, { useState } from "react";
import CaptchaMock from "./CaptchaMock";
import type { CaptchaProps } from "./CaptchaMock";

type GateProps = CaptchaProps & {
	gateLabel?: string;
	gateSubtext?: string;
	verifyMinMs?: number;
	verifyMaxMs?: number;
};

export default function CaptchaMockWithGate({
	gateLabel = "I'm not a robot",
	gateSubtext = "This is a playful check — not affiliated with Google.",
	verifyMinMs = 700,
	verifyMaxMs = 1400,
	className,
	onSolve,
	...quizProps
}: GateProps) {
	const [stage, setStage] = useState<"gate" | "loading" | "quiz" | "done">(
		"gate",
	);
	const [checked, setChecked] = useState(false);

	const startVerify = () => {
		if (stage !== "gate") return;
		setStage("loading");
		const ms =
			Math.floor(Math.random() * (verifyMaxMs - verifyMinMs + 1)) + verifyMinMs;
		window.setTimeout(() => setStage("quiz"), ms);
	};

	const handleSolve = (ids: string[]) => {
		onSolve?.(ids);
		setStage("done");
		setChecked(true);
	};

	const resetAll = () => {
		setChecked(false);
		setStage("gate");
	};

	return (
		<div
			className={`max-w-lg mx-auto p-4 border rounded-md bg-white shadow-sm ${className ?? ""}`}
			role="region"
			aria-label="Human verification"
		>
			{/* Checkbox row */}
			<div className="flex items-center gap-3">
				<div className="relative w-6 h-6">
					{stage === "loading" ? (
						<div
							aria-hidden
							className="w-6 h-6 rounded-sm border-2 border-gray-300 flex items-center justify-center"
						>
							<span className="spinner" />
						</div>
					) : stage === "done" ? (
						<div
							aria-hidden
							className="w-6 h-6 rounded-sm border-2 border-green-500 bg-green-500 flex items-center justify-center"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="white"
								className="w-4 h-4"
							>
								<path
									fillRule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.414 0l-3.2-3.2a1 1 0 111.414-1.414l2.493 2.493 6.493-6.493a1 1 0 011.414 0z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
					) : (
						<input
							id="robot-check"
							type="checkbox"
							className="w-6 h-6 rounded-sm border-2 border-gray-300 checked:bg-indigo-600 checked:border-indigo-600 focus:ring-2 focus:ring-indigo-500"
							checked={checked}
							onChange={(e) => {
								const v = e.target.checked;
								setChecked(v);
								if (v) startVerify();
								else resetAll();
							}}
							// @ts-ignore
							disabled={stage === "loading" || stage === "done"}
							aria-describedby="robot-check-help"
						/>
					)}
				</div>

				<label
					htmlFor="robot-check"
					className="select-none text-sm text-gray-800 font-medium"
				>
					{gateLabel}
				</label>

				<div className="ml-auto text-[10px] text-gray-500 flex items-center gap-1">
					<span
						className={`inline-block w-2 h-2 rounded-full ${
							stage === "done" ? "bg-green-500" : "bg-emerald-500"
						}`}
					/>
					<span>{stage === "done" ? "verified" : "human check active"}</span>
				</div>
			</div>

			{/* <div id="robot-check-help" className="mt-1 text-xs text-gray-500">
				{gateSubtext}
			</div> */}

			<div className="my-3 h-px bg-gray-200" />

			{/* dynamic body */}
			{stage === "gate" && (
				<div className="text-sm text-gray-600">
					Appuyez sur la case à cocher pour continuer.
				</div>
			)}

			{stage === "loading" && (
				<div className="flex items-center gap-2 text-sm text-gray-700">
					<span className="inline-block w-4 h-4 border-2 border-gray-300 rounded-full relative">
						<span className="spinner absolute inset-0" />
					</span>
					Verifying you’re not a robot…
				</div>
			)}

			{stage === "quiz" && (
				<>
					<CaptchaMock {...quizProps} onSolve={handleSolve} className="mt-2" />
					<div className="mt-3">
						<button
							type="button"
							onClick={resetAll}
							className="px-3 py-1 rounded-md text-xs border bg-white hover:bg-gray-50"
						>
							Start over
						</button>
					</div>
				</>
			)}

			{stage === "done" && (
				<div className="flex items-center text-green-600 text-sm mt-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="w-4 h-4 mr-1"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M5 13l4 4L19 7"
						/>
					</svg>
					Verifié — vous êtes humain 🎉
				</div>
			)}

			<style jsx>{`
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top-color: rgba(99, 102, 241, 1);
          border-right-color: rgba(99, 102, 241, 0.6);
          border-radius: 9999px;
          animation: spin 0.9s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
		</div>
	);
}
