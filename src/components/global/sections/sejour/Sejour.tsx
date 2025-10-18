import Link from "next/link";
import Phone from "@/components/global/icons/phone.svg";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

export default function Sejour() {
	const { ref, inView } = useInView({
		/* Optional options */
		triggerOnce: true,
		threshold: 0,
	});
	return (
		<section
			id="sejour"
			className="w-full md:max-w-[800px] md:mx-auto bg-white flex items-center justify-center text-foreground pt-17 pb-5"
		>
			<div className="md:pt-20 md:pb-20 max-h-svh content-wrapper grid grid-rows-[min-content_1fr_min-content] md:grid-rows-[min-content_min-content_min-content] md:border md:border-white md:w-fit md:rounded-4xl gap-10 items-center justify-center">
				<div className="flex flex-row items-start justify-between w-full text-left flex-1">
					<h1
						className={cn(
							"text-7xl text-foreground-text opacity-0",
							inView ? "animate-fade-in-down" : "",
						)}
						ref={ref}
					>
						Votre Séjour
					</h1>
				</div>
				<div className="flex flex-col items-center justify-center w-full gap-10">
					<div className="flex flex-row items-center justify-center w-full gap-10">
						<img
							src="/images/mercurestvictoire.webp"
							alt="Votre Séjour"
							className="w-full h-full object-cover rounded-4xl aspect-square max-w-1/3 md:max-w-1/4 flex-1"
						/>
						<div className="flex-1 items-center justify-center text-center">
							<h3 className="text-2xl">Hôtel Mercure Sainte Victoire</h3>
							<Link
								href="tel:0442202151"
								target="_blank"
								className="font-sans text-sm text-foreground inline-flex items-end justify-center text-center gap-2 border border-foreground rounded-full px-4 py-2"
							>
								<Phone className="w-4 h-4" />
								<strong>04 42 20 21 51</strong>
							</Link>
						</div>
					</div>
					<hr className="w-full border-foreground/30 my-4" />
					<div className="flex flex-row items-center justify-center w-full gap-10">
						<div className="flex-1 items-center justify-center text-center">
							<h3 className="text-2xl">Hôtel Mount Ventùri</h3>
							<Link
								href="tel:0442681919"
								target="_blank"
								className="font-sans text-sm text-foreground inline-flex items-end justify-center text-center gap-2 border border-foreground rounded-full px-4 py-2"
							>
								<Phone className="w-4 h-4" />
								<strong>04 42 68 19 19</strong>
							</Link>
						</div>
						<img
							src="/images/mountventuri.webp"
							alt="Votre Séjour"
							className="w-full h-full object-cover rounded-4xl aspect-square max-w-1/3 md:max-w-1/4 flex-1"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
("");
