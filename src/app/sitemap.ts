import type { MetadataRoute } from "next";

import { BROWSE, browseListingPath } from "@/features/browse/routes";
import { getBrowsePage } from "@/features/browse/server";
import { allowIndexing, siteOrigin } from "@/lib/seo/site";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	if (!allowIndexing) return [];

	const urls: MetadataRoute.Sitemap = [{ url: `${siteOrigin}/` }];
	try {
		const page = await getBrowsePage("", "", 1, 100);
		if (page?.results.length) {
			urls.push({ url: `${siteOrigin}${BROWSE}` });
			for (const listing of page.results) {
				urls.push({
					url: `${siteOrigin}${browseListingPath(listing.id)}`,
					lastModified: listing.updated_at,
				});
			}
		}
	} catch (error) {
		console.error("Could not load sitemap listings.", error);
	}
	return urls;
}
