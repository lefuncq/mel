import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Public wedding gallery: guests upload photos & videos, no auth required.
export const ourFileRouter = {
	weddingMedia: f({
		image: {
			maxFileSize: "16MB",
			maxFileCount: 30,
		},
		video: {
			maxFileSize: "256MB",
			maxFileCount: 10,
		},
	}).onUploadComplete(async ({ file }) => {
		// listFiles (in /api/photos) is the source of truth for the gallery,
		// so nothing to persist here. Return value is sent to the client.
		return { key: file.key };
	}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
