import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

interface PaginationProps {
	/** 1-based. */
	page: number;
	pageCount: number;
	onPageChange: (page: number) => void;
	pageHref?: (page: number) => string;
	/** Shown on the left, e.g. "42 students". */
	summary: ReactNode;
	className?: string;
}

function Pagination({
	page,
	pageCount,
	onPageChange,
	pageHref,
	summary,
	className,
}: PaginationProps) {
	function arrow(target: number, label: string, icon: ReactNode) {
		const disabled = target < 1 || target > pageCount;
		const href = disabled ? undefined : pageHref?.(target);

		return (
			<IconButton
				asChild={Boolean(href)}
				variant="outlined"
				size="icon-sm"
				className="rounded-md"
				label={label}
				disabled={disabled || undefined}
				onClick={href ? undefined : () => onPageChange(target)}
			>
				{href ? (
					<Link href={href} prefetch={false} scroll={false}>
						{icon}
					</Link>
				) : (
					icon
				)}
			</IconButton>
		);
	}

	return (
		<nav
			aria-label="Pagination"
			className={cn("flex flex-wrap items-center justify-between gap-3 px-4 py-3", className)}
		>
			<Text variant="body-sm" tone="muted">
				{summary}
			</Text>
			<div className="flex items-center gap-2">
				{arrow(page - 1, "Previous page", <ChevronLeft />)}
				<Text as="span" variant="label-md" aria-live="polite">
					Page {page} of {pageCount}
				</Text>
				{arrow(page + 1, "Next page", <ChevronRight />)}
			</div>
		</nav>
	);
}

export { Pagination };
