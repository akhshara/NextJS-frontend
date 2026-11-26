import { cache } from "react";

import type { Paginated } from "@/lib/api/api-client";
import { SERVER_API_URL, toPublicUrl } from "@/services/cms.service";

import { BROWSE_PAGE_SIZE } from "./constants";
import { browseListEndpoint, browseListingEndpoint } from "./service";
import type { BrowseListing, BrowseQuery } from "./types";

async function getPublicListings<T>(path: string, revalidate: number): Promise<T | null> {
	const response = await fetch(SERVER_API_URL + path, {
		headers: { Accept: "application/json" },
		next: { revalidate },
		signal: AbortSignal.timeout(5000),
	});

	if (response.status === 404) return null;
	if (!response.ok) throw new Error(`Public listings API returned ${response.status}`);
	return response.json() as Promise<T>;
}

function publicListing(listing: BrowseListing): BrowseListing {
	return {
		...listing,
		seller: null,
		is_owner: false,
		has_active_request: false,
		book: { ...listing.book, cover_url: toPublicUrl(listing.book.cover_url) },
		images: listing.images.map((image) => ({ ...image, image: toPublicUrl(image.image) })),
	};
}

export const getBrowsePage = cache(
	async (
		search: string,
		listingType: BrowseQuery["listing_type"],
		page: number,
		pageSize = BROWSE_PAGE_SIZE,
	) => {
		const result = await getPublicListings<Paginated<BrowseListing>>(
			browseListEndpoint({ search, listing_type: listingType, page }, pageSize),
			search || listingType ? 0 : 60,
		);
		return result && { ...result, results: result.results.map(publicListing) };
	},
);

export const getBrowseListing = cache(async (id: number) => {
	const listing = await getPublicListings<BrowseListing>(browseListingEndpoint(id), 0);
	return listing && publicListing(listing);
});
