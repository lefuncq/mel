import { UTApi } from "uploadthing/server";

// Always fetch fresh so new guest uploads show up immediately.
export const dynamic = "force-dynamic";

const utapi = new UTApi();

const VIDEO_EXT = new Set(["mp4", "mov", "webm", "m4v", "avi", "mkv", "ogg"]);

/** The v7 token is base64-encoded JSON containing the appId. */
function getAppId(): string | null {
	const token = process.env.UPLOADTHING_TOKEN;
	if (!token) return null;
	try {
		const decoded = JSON.parse(
			Buffer.from(token, "base64").toString("utf8"),
		) as { appId?: string };
		return decoded.appId ?? null;
	} catch {
		return null;
	}
}

export async function GET() {
	const appId = getAppId();
	if (!appId) {
		return Response.json(
			{ files: [], error: "UPLOADTHING_TOKEN missing or invalid" },
			{ status: 200 },
		);
	}

	// listFiles caps at 500 per call, so page through until we've got everything
	// (the browser then lazy-loads thumbnails, so rendering ~hundreds is fine).
	type UTFile = Awaited<ReturnType<typeof utapi.listFiles>>["files"][number];
	const PAGE_SIZE = 500;
	const SAFETY_CAP = 5000;
	const files: UTFile[] = [];
	for (let offset = 0; offset < SAFETY_CAP; offset += PAGE_SIZE) {
		const page = await utapi.listFiles({ limit: PAGE_SIZE, offset });
		files.push(...page.files);
		if (page.files.length < PAGE_SIZE) break;
	}

	const data = files
		.filter((file) => file.status === "Uploaded")
		.sort((a, b) => b.uploadedAt - a.uploadedAt) // newest first
		.map((file) => {
			const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
			return {
				key: file.key,
				name: file.name,
				url: `https://${appId}.ufs.sh/f/${file.key}`,
				type: VIDEO_EXT.has(ext) ? ("video" as const) : ("image" as const),
			};
		});

	return Response.json({ files: data });
}
