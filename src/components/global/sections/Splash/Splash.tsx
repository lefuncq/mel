import { Button } from "@/components/ui/button";
import Ampersand from "@/components/global/icons/ampersand.svg";
import { cn } from "@/lib/utils";
import FallingFlowers from "@/components/global/FallingFlowers/FallingFlowers";

export default function Splash({
	onClick,
	className,
}: {
	onClick: () => void;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"fixed top-0 left-0 w-screen h-screen bg-background flex flex-col items-center justify-center",
				className,
			)}
		>
			<FallingFlowers />
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<h1
				className="text-6xl md:text-8xl font-bold text-center"
				onClick={onClick}
			>
				Mariage de
				<br />
				<strong className="bg-pink-100 flex flex-row items-center justify-center gap-2">
					<span>Mélissa</span>
					<Ampersand className="size-12 md:size-17" /> <span>Théo</span>
				</strong>
			</h1>
			<Button variant="outline" className="mt-10" size="lg" onClick={onClick}>
				C'est parti !
			</Button>
		</div>
	);
}
