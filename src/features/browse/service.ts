import { type Paginated, requestApi } from "@/lib/api/api-client";

import { BROWSE_PAGE_SIZE } from "./constants";
import type { BrowseListing, BrowseQuery } from "./types";

const LISTINGS = "/api/listings/";

export function browseListEndpoint(
	{ search, listing_type, page }: BrowseQuery,
	pageSize = BROWSE_PAGE_SIZE,
) {
	const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
	if (search) params.set("search", search);
	if (listing_type) params.set("listing_type", listing_type);
	return `${LISTINGS}?${params}`;
}

export const browseListingEndpoint = (id: number) => `${LISTINGS}${id}/`;

export const browseService = {
	list: (query: BrowseQuery) => requestApi<Paginated<BrowseListing>>(browseListEndpoint(query)),
	listing: (id: number) => requestApi<BrowseListing>(browseListingEndpoint(id)),
};
