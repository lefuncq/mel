"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing";

type GalleryItem = {
	key: string;
	name: string;
	url: string;
	type: "image" | "video";
};

// QR code points guests to this page, where they upload directly.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://melissa-theo.fr";
const PHOTOS_URL = `${SITE_URL}/photos`;

export default function Photos() {
	const [items, setItems] = useState<GalleryItem[]>([]);
	const [loadingGallery, setLoadingGallery] = useState(true);
	const [progress, setProgress] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);

	const fetchGallery = useCallback(async () => {
		try {
			const res = await fetch("/api/photos", { cache: "no-store" });
			const data = await res.json();
			setItems(data.files ?? []);
		} catch {
			// Gallery just stays as-is on a transient error.
		} finally {
			setLoadingGallery(false);
		}
	}, []);

	useEffect(() => {
		fetchGallery();
	}, [fetchGallery]);

	const { startUpload, isUploading } = useUploadThing("weddingMedia", {
		onClientUploadComplete: () => {
			toast.success("Merci ! Vos souvenirs ont été ajoutés 💕");
			setProgress(0);
			fetchGallery();
		},
		onUploadError: (e) => {
			toast.error(`Échec de l'envoi : ${e.message}`);
			setProgress(0);
		},
		onUploadProgress: (p) => setProgress(p),
	});

	const handleFiles = (fileList: FileList | null) => {
		if (!fileList || fileList.length === 0) return;
		startUpload(Array.from(fileList));
		// Reset so selecting the same file again still fires onChange.
		if (inputRef.current) inputRef.current.value = "";
	};

	return (
		<section
			id="photos"
			className="w-full md:max-w-[900px] md:mx-auto min-h-screen md:min-h-fit bg-white flex items-center justify-center text-foreground border-y border-foreground/30 py-10 md:py-20"
		>
			<div className="content-wrapper flex flex-col items-center text-center gap-8 w-full">
				<div className="flex flex-col items-center gap-3">
					<h1 className="text-6xl md:text-7xl text-foreground">
						Galerie Photos
					</h1>
					<p className="text-lg md:text-xl font-sans max-w-md text-foreground/80">
						Partagez vos photos et vidéos du mariage de Melissa &amp; Théo —
						avant, pendant et après la fête.
					</p>
				</div>

				{/* Upload CTA + QR code */}
				<div className="flex flex-col items-center gap-5">
					<input
						ref={inputRef}
						type="file"
						accept="image/*,video/*"
						multiple
						className="hidden"
						onChange={(e) => handleFiles(e.target.files)}
					/>
					<button
						type="button"
						disabled={isUploading}
						onClick={() => inputRef.current?.click()}
						className="font-sans font-medium inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-lg transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{isUploading ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								Envoi… {progress}%
							</>
						) : (
							<>
								<Camera className="w-5 h-5" />
								Ajouter vos photos &amp; vidéos
							</>
						)}
					</button>

					<div className="flex flex-col items-center gap-2">
						<div className="rounded-2xl bg-white p-3 border border-foreground/15 shadow-sm">
							<QRCodeSVG
								value={PHOTOS_URL}
								size={140}
								marginSize={0}
								className="h-auto w-[140px]"
							/>
						</div>
						<span className="text-sm font-sans text-foreground/60">
							Ou scannez ce QR code
						</span>
					</div>
				</div>

				{/* Live gallery */}
				<div className="w-full max-w-[800px]">
					{loadingGallery ? (
						<div className="flex items-center justify-center py-10 text-foreground/50">
							<Loader2 className="w-6 h-6 animate-spin" />
						</div>
					) : items.length === 0 ? (
						<p className="font-sans text-foreground/50 py-10">
							Soyez les premiers à partager un souvenir ✨
						</p>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
							{items.map((item) =>
								item.type === "video" ? (
									<video
										key={item.key}
										src={item.url}
										controls
										preload="metadata"
										className="w-full aspect-square object-cover rounded-xl bg-foreground/5"
									>
										<track kind="captions" />
									</video>
								) : (
									<a
										key={item.key}
										href={item.url}
										target="_blank"
										rel="noopener noreferrer"
										className="block aspect-square overflow-hidden rounded-xl bg-foreground/5"
									>
										<img
											src={item.url}
											alt={item.name}
											loading="lazy"
											className="w-full h-full object-cover transition hover:scale-105"
										/>
									</a>
								),
							)}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
