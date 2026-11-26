import { type LucideIcon, SearchX } from "lucide-react";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

interface EmptyStateProps {
	title: string;
	hint: string;
	icon?: LucideIcon;
	className?: string;
}

export default function EmptyState({
	title,
	hint,
	icon: Icon = SearchX,
	className,
}: EmptyStateProps) {
	return (
		<div className={cn("flex flex-col items-center gap-2 px-4 py-14 text-center", className)}>
			<Icon aria-hidden className="size-6 text-muted-foreground" />
			<Text variant="label-lg">{title}</Text>
			<Text variant="body-sm" tone="muted">
				{hint}
			</Text>
		</div>
	);
}
