import { notFound } from "next/navigation";
import { Suspense } from "react";

import PageHeader from "@/components/layout/PageHeader";
import BrowseView from "@/features/browse/components/BrowseView";
import { readBrowseQuery } from "@/features/browse/query-params";
import { browsePath } from "@/features/browse/routes";
import { getBrowsePage } from "@/features/browse/server";
import { publicMetadata } from "@/lib/seo/site";

const description =
	"Browse used textbooks students are selling, swapping and giving away on campus. Search by book title, author, ISBN or course code.";

async function loadBrowse(searchParams: PageProps<"/browse">["searchParams"]) {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(await searchParams)) {
		const first = Array.isArray(value) ? value[0] : value;
		if (first !== undefined) params.set(key, first);
	}
	const query = readBrowseQuery(params);
	const result = await getBrowsePage(query.search, query.listing_type, query.page).catch(
		(error) => {
			console.error("Could not render the public catalog.", error);
			return undefined;
		},
	);
	if (result === null && !query.search && !query.listing_type && query.page > 1) notFound();
	return { query, result };
}

export async function generateMetadata({ searchParams }: PageProps<"/browse">) {
	const { query, result } = await loadBrowse(searchParams);
	return publicMetadata({
		title:
			query.page === 1
				? "Browse Used Campus Textbooks"
				: `Browse Used Campus Textbooks · Page ${query.page}`,
		description,
		path: browsePath(query),
		index: !query.search && !query.listing_type && Boolean(result?.results.length),
	});
}

export default async function BrowsePage({ searchParams }: PageProps<"/browse">) {
	const { query, result } = await loadBrowse(searchParams);
	return (
		<>
			<PageHeader
				title="Browse books"
				description="Textbooks students are selling, swapping and giving away on campus."
			/>
			<Suspense>
				<BrowseView initialQuery={query} initialPage={result ?? undefined} />
			</Suspense>
		</>
	);
}
