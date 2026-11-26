import type { Metadata } from "next";

export const SITE_NAME = "Akshara";
export const HOME_TITLE = "Buy, Swap & Donate Campus Textbooks";
export const HOME_DESCRIPTION =
	"Find used textbooks from students on campus. Buy affordable books, swap copies for your next course, or pass them on for free with Akshara.";

function readSiteOrigin() {
	const configured = process.env.SITE_URL?.trim();
	if (!configured) return undefined;

	const url = new URL(configured);
	if (!["https:", "http:"].includes(url.protocol) || url.href !== `${url.origin}/`) {
		throw new Error("SITE_URL must be an HTTP(S) origin without a path, query, or fragment.");
	}
	return url.origin;
}

export const siteOrigin = readSiteOrigin();
export const allowIndexing =
	Boolean(siteOrigin) &&
	process.env.NODE_ENV === "production" &&
	(!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production") &&
	(!process.env.NEXT_PUBLIC_APP_ENV || process.env.NEXT_PUBLIC_APP_ENV === "production");

export const noIndex: Metadata["robots"] = { index: false, follow: true };

export function publicMetadata({
	title,
	description,
	path,
	index = true,
}: {
	title: string;
	description: string;
	path: string;
	index?: boolean;
}): Metadata {
	return {
		title,
		description,
		alternates: siteOrigin ? { canonical: new URL(path, siteOrigin).href } : undefined,
		robots: allowIndexing && index ? { index: true, follow: true } : noIndex,
	};
}
