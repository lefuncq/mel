import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Ampersand from "@/components/global/icons/ampersand.svg";
import { ArrowRight } from "lucide-react";
import { NumberInput } from "@/components/ui/input-number";
import { toast } from "sonner";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import CaptchaMockWithGate from "../../CaptchaMock/CaptchaMockWithGate";

const images = [
	{
		id: "1",
		src: "/images/mt.jpg",
		alt: "Melissa & Teo",
		isTarget: true,
	},
	{
		id: "2",
		src: "/images/jy.webp",
		alt: "Melissa & Teo",
	},
	{ id: "3", src: "/images/bj.jpg", alt: "Guest", isTarget: false },
	{ id: "4", src: "/images/bc.avif", alt: "Guest", isTarget: false },
	{ id: "5", src: "/images/dm.webp", alt: "Guest", isTarget: false },
	{ id: "6", src: "/images/eb.jpg", alt: "Guest", isTarget: false },
	{ id: "7", src: "/images/bm.jpeg", alt: "Guest", isTarget: false },
	{ id: "8", src: "/images/sbci.webp", alt: "Guest", isTarget: false },
	{ id: "9", src: "/images/rjlm.jpg", alt: "Guest", isTarget: false },
];
export default function RSVP() {
	const { ref, inView } = useInView({
		/* Optional options */
		triggerOnce: true,
		threshold: 0,
	});
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const [mairieNumber, setMairieNumber] = useState(0);
	const [welcomePartyNumber, setWelcomePartyNumber] = useState(0);
	const [soireeNumber, setSoireeNumber] = useState(0);
	const [address, setAddress] = useState("");
	const [captchaSolved, setCaptchaSolved] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		toast("Bien reçu, à très vite !", {
			position: "top-center",
			duration: 5000,
			icon: <Ampersand className="w-6 h-6" />,
			description: "Hâte de faire la fête avec nous !",
		});
		const emailBody = `Voici ma réponse au RSVP pour le mariage de Melissa et Théo.\n
		Nom: ${name}
		Adresse: ${address}
		Nombre de personnes pour la mairie: ${mairieNumber}
		Nombre de personnes pour la welcome party: ${welcomePartyNumber}
		Nombre de personnes pour la soirée: ${soireeNumber}
		Message: ${message}
		`;
		window.location.href = `mailto:melissatheogaliniere@hotmail.com?subject=RSVP&body=${encodeURIComponent(emailBody)}`;
	};

	return (
		<section
			id="rsvp"
			className={cn(
				"w-full md:max-w-[800px] md:mx-auto min-h-screen bg-white flex items-center justify-center text-foreground mb-10 opacity-0 transition-all duration-500 ease-in-out",
				inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
			)}
		>
			<div className="md:scale-100 p-10 px-7 w-full mx-3 md:mx-0 content-wrapper flex-row gap-10 items-center justify-center bg-accent/20 border border-foreground/30 rounded-4xl">
				<h1 className="text-6xl font-bold">RSVP</h1>
				<form className="w-full flex flex-col gap-10" onSubmit={handleSubmit}>
					<FieldGroup>
						<FieldSet>
							<FieldLegend className="flex items-center justify-start gap-1">
								Merci de nous répondre au plus vite{" "}
								<Ampersand className="w-6 h-6 mt-1" />
							</FieldLegend>
							<FieldGroup className="gap-4">
								<Field>
									<FieldLabel htmlFor="first-name-last-name" ref={ref}>
										Prénom & Nom
									</FieldLabel>
									<Input
										id="first-name-last-name"
										required
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="address">Votre adresse</FieldLabel>
									<Input
										id="address"
										required
										placeholder="Ex: 123 Rue de la Paix, 75000 Paris"
										value={address}
										onChange={(e) => setAddress(e.target.value)}
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="mairie">Mairie</FieldLabel>
									<NumberInput
										id="mairie"
										required
										defaultValue={0}
										min={0}
										max={10}
										value={mairieNumber}
										onChange={(e) => setMairieNumber(Number(e.target.value))}
									/>
									<FieldDescription>
										Entrez le nombre de personnes pour la mairie
									</FieldDescription>
								</Field>
								<Field>
									<FieldLabel htmlFor="welcome-party">
										Welcome Party/Henné
									</FieldLabel>
									<NumberInput
										id="welcome-party"
										required
										defaultValue={0}
										min={0}
										max={10}
										value={welcomePartyNumber}
										onChange={(e) =>
											setWelcomePartyNumber(Number(e.target.value))
										}
									/>
									<FieldDescription>
										Entrez le nombre de personnes pour la welcome party
									</FieldDescription>
								</Field>
								<Field>
									<FieldLabel htmlFor="soiree">Soirée</FieldLabel>
									<NumberInput
										id="soiree"
										required
										defaultValue={0}
										min={0}
										max={10}
										value={soireeNumber}
										onChange={(e) => setSoireeNumber(Number(e.target.value))}
									/>
									<FieldDescription>
										Entrez le nombre de personnes pour la soirée
									</FieldDescription>
								</Field>
								<FieldSeparator />
								<Field>
									<FieldLabel htmlFor="message">
										Message pour les mariés
									</FieldLabel>
									<Textarea
										id="message"
										placeholder="Trop musclé théo !"
										value={message}
										onChange={(e) => setMessage(e.target.value)}
									/>
									<FieldDescription>Entrez votre message</FieldDescription>
								</Field>
							</FieldGroup>
						</FieldSet>
					</FieldGroup>
					<CaptchaMockWithGate
						images={images}
						targetLabel="Trouvez Mélissa & Théo"
						question="Tapez sur chaque image qui contient Mélissa & Théo"
						gateLabel="Je ne suis pas un robot"
						rows={3}
						cols={3}
						shuffle
						onSolve={() => {
							setCaptchaSolved(true);
						}}
					/>
					<Button type="submit" disabled={!captchaSolved}>
						<ArrowRight className="size-4" /> Envoyer
					</Button>
				</form>
			</div>
		</section>
	);
}
