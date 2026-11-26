import { notFound } from "next/navigation";

import ListingDetailView from "@/features/browse/components/ListingDetailView";
import { browseListingPath } from "@/features/browse/routes";
import { getBrowseListing } from "@/features/browse/server";
import { conditionLabels, listingPrice } from "@/features/listings/labels";
import { publicMetadata } from "@/lib/seo/site";

async function loadListing(params: PageProps<"/browse/[id]">["params"]) {
	const id = Number((await params).id);
	if (!Number.isSafeInteger(id) || id < 1) notFound();

	const listing = await getBrowseListing(id);
	if (!listing) notFound();
	return listing;
}

export async function generateMetadata({ params }: PageProps<"/browse/[id]">) {
	const listing = await loadListing(params);
	const { book } = listing;
	const title = book.authors ? `${book.title} by ${book.authors}` : book.title;
	const course = listing.course_code ? ` for ${listing.course_code}` : "";

	return publicMetadata({
		title,
		description: `${title}${course}. ${conditionLabels[listing.condition]} condition · ${listingPrice(listing)}. View this campus textbook listing on Akshara.`,
		path: browseListingPath(listing.id),
		index: listing.status === "available",
	});
}

export default async function ListingPage({ params }: PageProps<"/browse/[id]">) {
	const listing = await loadListing(params);
	return <ListingDetailView listing={listing} />;
}
