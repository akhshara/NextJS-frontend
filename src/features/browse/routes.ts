import { writeBrowseQuery } from "./query-params";
import type { BrowseQuery } from "./types";

export const BROWSE = "/browse";

export function browsePath(query: BrowseQuery) {
	const params = writeBrowseQuery(query);
	return params ? `${BROWSE}?${params}` : BROWSE;
}

export const browseListingPath = (id: number) => `${BROWSE}/${id}`;
