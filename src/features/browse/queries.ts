import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/components/landing/session";
import { listingsKey } from "@/features/listings/keys";
import type { Paginated } from "@/lib/api/api-client";

import { browseService } from "./service";
import type { BrowseListing, BrowseQuery } from "./types";

/**
 * Under the listings root, so a request sent from these pages refreshes them. Keyed by the
 * viewer too: a visitor gets no sellers, and signing out must not leave a student's view.
 */
const browseKeys = {
	page: (viewer: number | null, query: BrowseQuery) =>
		[...listingsKey, "public", viewer, query] as const,
	listing: (viewer: number | null, id: number) =>
		[...listingsKey, "public", viewer, "detail", id] as const,
};

/** The signed-in user's id, `null` for visitors, `undefined` while the session loads. */
function useViewer() {
	const { user } = useSession();
	return user === undefined ? undefined : (user?.id ?? null);
}

export function useBrowsePage(query: BrowseQuery, initialData?: Paginated<BrowseListing>) {
	const viewer = useViewer();
	return useQuery({
		queryKey: browseKeys.page(viewer ?? null, query),
		queryFn: () => browseService.list(query),
		enabled: viewer !== undefined,
		initialData: viewer == null ? initialData : undefined,
		initialDataUpdatedAt: 0,
	});
}

export function useBrowseListing(id: number, initialData?: BrowseListing) {
	const viewer = useViewer();
	return useQuery({
		queryKey: browseKeys.listing(viewer ?? null, id),
		queryFn: () => browseService.listing(id),
		initialData: viewer == null ? initialData : undefined,
		initialDataUpdatedAt: 0,
		enabled: viewer !== undefined,
	});
}
