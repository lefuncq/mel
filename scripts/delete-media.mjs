#!/usr/bin/env bun
/**
 * Delete gallery media from UploadThing by URL.
 *
 * Usage:
 *   bun scripts/delete-media.mjs <url1> <url2> ...
 *   bun scripts/delete-media.mjs --file urls.txt
 *   pbpaste | bun scripts/delete-media.mjs          # paste a list, then run
 *   bun scripts/delete-media.mjs --dry-run <urls>   # preview only, no delete
 *
 * Input can be messy (headers, blank lines, extra text) — only the file keys
 * after "/f/" in ufs.sh URLs are extracted. Reads the token from .env.
 */
import { UTApi } from "uploadthing/server";
import { readFileSync, existsSync } from "node:fs";

// --- load UPLOADTHING_TOKEN from .env (if not already in the environment) ---
if (!process.env.UPLOADTHING_TOKEN) {
	try {
		const env = readFileSync(new URL("../.env", import.meta.url), "utf8");
		const m = env.match(/UPLOADTHING_TOKEN=['"]?([^'"\n\r]+)/);
		if (m) process.env.UPLOADTHING_TOKEN = m[1];
	} catch {
		// no .env — rely on the ambient environment
	}
}
if (!process.env.UPLOADTHING_TOKEN) {
	console.error("✖ UPLOADTHING_TOKEN is not set (checked env and .env).");
	process.exit(1);
}

// --- collect input text from args, --file, and stdin ---
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
let text = args.filter((a) => a !== "--dry-run" && a !== "--file").join("\n");

const fileIdx = args.indexOf("--file");
if (fileIdx !== -1 && args[fileIdx + 1]) {
	const p = args[fileIdx + 1];
	if (existsSync(p)) text += `\n${readFileSync(p, "utf8")}`;
	else {
		console.error(`✖ File not found: ${p}`);
		process.exit(1);
	}
}

// stdin (when piped)
if (!process.stdin.isTTY) {
	try {
		text += `\n${readFileSync(0, "utf8")}`;
	} catch {
		// nothing on stdin
	}
}

// --- extract unique file keys from ufs.sh URLs (segment after /f/) ---
const keys = [...text.matchAll(/\/f\/([A-Za-z0-9]+)/g)].map((m) => m[1]);
const unique = [...new Set(keys)];

if (unique.length === 0) {
	console.error(
		"✖ No file keys found. Pass ufs.sh URLs as args, via --file, or piped on stdin.",
	);
	process.exit(1);
}

console.log(`Found ${unique.length} unique file key(s):`);
for (const k of unique) console.log(`  • ${k}`);

if (dryRun) {
	console.log("\n(dry-run) Nothing deleted.");
	process.exit(0);
}

// --- delete ---
const api = new UTApi();
const res = await api.deleteFiles(unique);
console.log(
	`\n✓ Deletion request sent — success: ${res.success}, deletedCount: ${res.deletedCount}`,
);
if (res.deletedCount < unique.length) {
	console.log(
		`  Note: ${unique.length - res.deletedCount} key(s) were already gone or not found.`,
	);
}
