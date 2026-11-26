import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { HOME_DESCRIPTION, HOME_TITLE, noIndex, SITE_NAME } from "@/lib/seo/site";

import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: { default: `${HOME_TITLE} · ${SITE_NAME}`, template: `%s · ${SITE_NAME}` },
	description: HOME_DESCRIPTION,
	robots: noIndex,
	icons: { icon: "/icons/favicon.png", apple: "/icons/favicon.png" },
};

const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-plus-jakarta-sans",
});

export const viewport: Viewport = {
	themeColor: "#003262",
	viewportFit: "cover",
	interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={plusJakartaSans.variable}>
			<body className="min-h-screen antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
