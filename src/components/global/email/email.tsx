interface EmailTemplateProps {
	name: string;
	message: string;
	mairieNumber: number;
	welcomePartyNumber: number;
	soireeNumber: number;
}

export function EmailTemplate({
	name,
	message,
	mairieNumber,
	welcomePartyNumber,
	soireeNumber,
}: EmailTemplateProps) {
	return (
		<div>
			<h1>Welcome, {name}!</h1>
			<p>{message}</p>
			<p>Mairie: {mairieNumber}</p>
			<p>Welcome Party: {welcomePartyNumber}</p>
			<p>Soirée: {soireeNumber}</p>
		</div>
	);
}
