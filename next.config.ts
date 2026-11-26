import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async headers() {
		if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim()) return [];
		return [
			{
				// Client-side navigation to login inherits the document's opener policy.
				source: "/:path*",
				headers: [{ key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" }],
			},
		];
	},
	async redirects() {
		return [
			// Auth pages used to live under /auth. Keeps old links working, including the
			// verification and password reset links in emails sent before the move.
			{ source: "/auth/:path*", destination: "/:path*", permanent: true },
			// The admin console has no overview page: open its first section.
			{ source: "/admin", destination: "/admin/students", permanent: false },
		];
	},
};

export default nextConfig;
