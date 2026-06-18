"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Camera, Download, Loader2 } from "lucide-react";
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
	const [savingKey, setSavingKey] = useState<string | null>(null);
	const [zipping, setZipping] = useState(false);
	const [zipProgress, setZipProgress] = useState(0);
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

	// Save a media file: native share sheet on mobile ("Save to Photos"),
	// direct download on desktop. Relies on ufs.sh CORS (access-control-allow-origin: *).
	const saveMedia = async (item: GalleryItem) => {
		setSavingKey(item.key);
		try {
			const res = await fetch(item.url);
			const blob = await res.blob();
			const file = new File([blob], item.name, { type: blob.type });
			if (navigator.canShare?.({ files: [file] })) {
				await navigator.share({ files: [file] });
			} else {
				const url = URL.createObjectURL(blob);
				const a = Object.assign(document.createElement("a"), {
					href: url,
					download: item.name,
				});
				document.body.appendChild(a);
				a.click();
				a.remove();
				URL.revokeObjectURL(url);
			}
		} catch (err) {
			// User dismissing the share sheet throws AbortError — ignore that.
			if ((err as Error)?.name !== "AbortError") {
				toast.error("Téléchargement impossible. Réessayez.");
			}
		} finally {
			setSavingKey(null);
		}
	};

	// Download the whole gallery as a single ZIP, fetched lazily so it streams
	// rather than holding every file in memory at once. On desktop Chromium it
	// streams straight to disk via the File System Access API.
	const downloadAll = async () => {
		if (items.length === 0 || zipping) return;
		setZipping(true);
		setZipProgress(0);
		try {
			const { downloadZip } = await import("client-zip");
			async function* entries() {
				let done = 0;
				for (const [i, item] of items.entries()) {
					const res = await fetch(item.url);
					// Prefix with an index to avoid name collisions between guests.
					yield {
						name: `${String(i + 1).padStart(3, "0")}-${item.name}`,
						input: res,
					};
					done += 1;
					setZipProgress(done);
				}
			}

			const zip = downloadZip(entries());
			const fileName = "mariage-melissa-theo.zip";
			const picker = (
				window as unknown as {
					showSaveFilePicker?: (opts: {
						suggestedName?: string;
					}) => Promise<{ createWritable: () => Promise<WritableStream> }>;
				}
			).showSaveFilePicker;

			if (picker && zip.body) {
				const handle = await picker({ suggestedName: fileName });
				const writable = await handle.createWritable();
				await zip.body.pipeTo(writable);
			} else {
				const blob = await zip.blob();
				const url = URL.createObjectURL(blob);
				const a = Object.assign(document.createElement("a"), {
					href: url,
					download: fileName,
				});
				document.body.appendChild(a);
				a.click();
				a.remove();
				URL.revokeObjectURL(url);
			}
		} catch (err) {
			// User cancelling the save dialog throws AbortError — ignore that.
			if ((err as Error)?.name !== "AbortError") {
				toast.error("Le téléchargement groupé a échoué. Réessayez.");
			}
		} finally {
			setZipping(false);
			setZipProgress(0);
		}
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
						<>
							<div className="flex items-center justify-between gap-3 mb-3">
								<span className="text-sm font-sans text-foreground/60">
									{items.length} souvenir{items.length > 1 ? "s" : ""}
								</span>
								<button
									type="button"
									onClick={downloadAll}
									disabled={zipping}
									className="font-sans hidden md:inline-flex items-center gap-2 rounded-full border border-foreground/30 px-4 py-2 text-sm transition hover:bg-foreground/5 disabled:opacity-60 disabled:cursor-not-allowed"
								>
									{zipping ? (
										<>
											<Loader2 className="w-4 h-4 animate-spin" />
											Préparation… {zipProgress}/{items.length}
										</>
									) : (
										<>
											<Download className="w-4 h-4" />
											Tout télécharger
										</>
									)}
								</button>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
								{items.map((item) => (
									<div
										key={item.key}
										className="group relative aspect-square overflow-hidden rounded-xl bg-foreground/5"
									>
										{item.type === "video" ? (
											<video
												src={item.url}
												controls
												preload="metadata"
												className="w-full h-full object-cover"
											>
												<track kind="captions" />
											</video>
										) : (
											<a
												href={item.url}
												target="_blank"
												rel="noopener noreferrer"
												className="block w-full h-full"
											>
												<img
													src={item.url}
													alt={item.name}
													loading="lazy"
													className="w-full h-full object-cover transition group-hover:scale-105"
												/>
											</a>
										)}
										<button
											type="button"
											onClick={() => saveMedia(item)}
											disabled={savingKey === item.key}
											aria-label="Télécharger / enregistrer"
											className="absolute top-2 right-2 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75 disabled:opacity-60"
										>
											{savingKey === item.key ? (
												<Loader2 className="w-4 h-4 animate-spin" />
											) : (
												<Download className="w-4 h-4" />
											)}
										</button>
									</div>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
