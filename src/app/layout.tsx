import localFont from "next/font/local";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/global/navbar/Navbar";
import { Toaster } from "sonner";

const harmondFont = localFont({
	src: "../../public/fonts/Harmond/Harmond-SemiBoldCondensed.otf",
	variable: "--font-harmond",
});

const geistFont = Manrope({
	subsets: ["latin"],
	variable: "--font-text",
});

export const metadata: Metadata = {
	title: "Mariage de Melissa et Théo",
	description: "Rendez-vous au mariage de Melissa et Théo",
	openGraph: {
		title: "Mariage de Melissa et Théo",
		description: "Rendez-vous au mariage de Melissa et Théo",
		url: "https://melissa-theo.fr",
		siteName: "Mariage de Melissa et Théo",
		locale: "fr_FR",
		type: "website",
		images: ["/images/meta.png"],
	},
	twitter: {
		card: "summary_large_image",
		title: "Mariage de Melissa et Théo",
		description: "Rendez-vous au mariage de Melissa et Théo",
		images: ["/images/meta.png"], // full URL required
	},
	robots: {
		index: false,
		follow: false,
		googleBot: {
			index: false,
			follow: false,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistFont.variable} ${harmondFont.variable} antialiased`}
		>
			<body>
				<Toaster />
				<Navbar />
				{children}
			</body>
		</html>
	);
}
