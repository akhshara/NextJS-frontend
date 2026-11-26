"use client";

import { BadgeCheck, BookOpen, CircleCheck, Handshake, Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";
import { formatNumber } from "@/lib/utils/format";

import { useAvailableListingCount, useCompletedExchangeCount, useExchangeCount } from "../queries";
import { useStudent } from "../session";
import ListBookButton from "./ListBookButton";

function Stat({
	label,
	value,
	hint,
	icon: Icon,
}: {
	label: string;
	value?: number;
	hint: ReactNode;
	icon: LucideIcon;
}) {
	return (
		<div className="relative flex flex-col-reverse rounded-xl bg-card py-2.5 pr-2 pl-[3.375rem] ring-1 ring-border md:block md:bg-muted md:px-4 md:py-3 md:ring-0">
			<Text as="dt" variant="label-sm" tone="muted" className="md:uppercase md:tracking-wider">
				{label}
			</Text>
			<Text
				as="dd"
				variant="headline-md"
				className="text-lg font-bold leading-6 text-primary tabular-nums md:text-headline-md"
			>
				<span
					aria-hidden
					className="absolute top-1/2 left-3 grid size-8 -translate-y-1/2 place-items-center rounded-lg bg-primary-95 text-primary md:hidden"
				>
					<Icon className="size-4" />
				</span>
				{value === undefined ? "–" : formatNumber(value)}
			</Text>
			<Text as="dd" variant="body-sm" tone="muted" className="hidden md:block">
				{hint}
			</Text>
		</div>
	);
}

/** Who is signed in, and how their exchanges stand. */
export default function ProfileSummary() {
	const student = useStudent();
	const available = useAvailableListingCount();
	const review = useExchangeCount("review");
	const accepted = useExchangeCount("accepted");
	const completed = useCompletedExchangeCount();
	const details = [student.department, student.student_id && `ID ${student.student_id}`];

	return (
		<Card className="gap-3 border-0 bg-transparent p-0 shadow-none md:gap-6 md:border md:bg-card md:p-6 md:shadow-sm">
			<div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-4 overflow-hidden rounded-2xl bg-primary px-4 py-5 text-primary-foreground md:flex md:gap-4 md:overflow-visible md:bg-transparent md:p-0 md:text-card-foreground">
				<Avatar name={student.full_name} size="lg" />
				<div className="min-w-0 flex-1 space-y-1">
					<div className="flex flex-wrap items-center gap-2">
						<Text as="h1" variant="headline-md" className="break-words font-bold">
							{student.full_name}
						</Text>
						<Badge tone="success" size="sm">
							<BadgeCheck />
							Verified student
						</Badge>
					</div>
					<Text variant="body-sm" className="truncate text-primary-95 md:text-muted-foreground">
						{[...details, student.email].filter(Boolean).join(" · ")}
					</Text>
				</div>
				<ListBookButton
					size="lg"
					className="col-span-2 rounded-xl max-md:bg-primary-foreground max-md:text-primary max-md:hover:bg-primary-95 md:self-center"
				/>
			</div>
			<dl className="grid grid-cols-2 gap-2.5 md:gap-3 lg:grid-cols-4">
				<Stat
					icon={BookOpen}
					label="On the shelf"
					value={available.data}
					hint="Listings others can request"
				/>
				<Stat icon={Inbox} label="To review" value={review.data} hint="Requests for your books" />
				<Stat
					icon={Handshake}
					label="Accepted"
					value={accepted.data}
					hint="Waiting to change hands"
				/>
				<Stat
					icon={CircleCheck}
					label="Completed"
					value={completed.data}
					hint="Books exchanged so far"
				/>
			</dl>
		</Card>
	);
}
