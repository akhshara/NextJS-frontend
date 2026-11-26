import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/typography";
import { conditionLabels, listingPrice } from "@/features/listings/labels";

import type { Listing } from "../types";
import BookCover, { coverOf } from "./BookCover";

interface ListingCardProps {
	listing: Omit<Listing, "seller">;
	/** Listing status or ownership. */
	badge?: ReactNode;
	/** Under the price, e.g. a person's name or a hint. */
	meta?: ReactNode;
	/** Buttons along the bottom. */
	actions: ReactNode;
}

export default function ListingCard({ listing, badge, meta, actions }: ListingCardProps) {
	const { book } = listing;
	return (
		<article className="grid h-full grid-cols-[auto_minmax(0,1fr)] overflow-hidden rounded-2xl border bg-card md:flex md:flex-col md:rounded-xl md:shadow-sm">
			<div className="relative p-3 pr-0 md:bg-muted md:p-4">
				<BookCover
					src={coverOf(listing)}
					sizes="(min-width: 768px) 176px, 72px"
					className="w-18 md:mx-auto md:w-full md:max-w-44 md:shadow-md"
				/>
			</div>
			<div className="flex min-w-0 flex-1 flex-col gap-1 px-3 py-3 md:p-4">
				<div className="flex flex-wrap items-center gap-1 pb-1">
					<Badge tone="neutral" size="sm">
						{conditionLabels[listing.condition]}
					</Badge>
					{badge}
				</div>
				{(listing.course_code || book.edition) && (
					<Text variant="label-sm" tone="muted" className="flex flex-wrap gap-2 uppercase">
						{listing.course_code && (
							<span className="rounded bg-primary-container px-1.5 text-primary-container-foreground">
								{listing.course_code}
							</span>
						)}
						{book.edition && <span>{book.edition}</span>}
					</Text>
				)}
				<Text as="h3" variant="label-lg" className="line-clamp-2">
					{book.title}
				</Text>
				{book.authors && (
					<Text variant="body-sm" tone="muted" className="line-clamp-1">
						{book.authors}
					</Text>
				)}
				<div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1 md:justify-between md:pt-3">
					<Text as="span" variant="headline-sm" className="text-primary tabular-nums">
						{listingPrice(listing)}
					</Text>
					{meta && (
						<Text as="span" variant="body-sm" tone="muted" className="truncate">
							{meta}
						</Text>
					)}
				</div>
			</div>
			<div className="col-span-2 flex flex-wrap gap-2 border-t p-2.5 [&>*]:flex-1 max-md:[&_button]:min-h-11 max-md:[&_a]:min-h-11 md:p-3">
				{actions}
			</div>
		</article>
	);
}
