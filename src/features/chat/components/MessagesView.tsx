"use client";

import { MessagesSquare } from "lucide-react";
import { useSearchParams } from "next/navigation";

import EmptyState from "@/components/feedback/EmptyState";
import QueryState from "@/components/feedback/QueryState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";
import { useStudent } from "@/features/student/session";
import { cn } from "@/lib/utils/utils";

import { useConversations } from "../queries";
import ConversationList from "./ConversationList";
import ConversationThread from "./ConversationThread";

/** The inbox beside the open conversation; on phones, one or the other. */
export default function MessagesView() {
	const student = useStudent();
	const conversations = useConversations();
	const selected = Number(useSearchParams().get("c")) || null;

	return (
		<>
			<header className={selected ? "hidden lg:block" : undefined}>
				<Text as="h1" variant="headline-md" className="font-bold text-primary md:text-headline-lg">
					Messages
				</Text>
			</header>
			<Card
				className={cn(
					"flex-row gap-0 overflow-hidden rounded-2xl py-0 shadow-none lg:h-[calc(100dvh-12rem)] lg:min-h-[28rem] lg:rounded-xl lg:shadow-sm",
					selected &&
						"max-lg:min-h-56 max-lg:h-[calc(100dvh-6rem-env(safe-area-inset-top))] max-md:h-[calc(100dvh-5.5rem-env(safe-area-inset-top)-var(--student-bottom-bar))]",
				)}
			>
				<div
					className={cn(
						"w-full flex-col overflow-y-auto lg:flex lg:border-r lg:w-80 lg:shrink-0",
						selected ? "hidden" : "flex",
					)}
				>
					<QueryState
						isPending={conversations.isPending}
						error={conversations.error}
						onRetry={conversations.refetch}
					/>
					{conversations.isSuccess &&
						(conversations.data.length === 0 ? (
							<EmptyState
								icon={MessagesSquare}
								title="No messages yet"
								hint="Open the chat from one of your exchanges to talk it through."
							/>
						) : (
							<>
								<ConversationList
									conversations={conversations.data}
									selectedId={selected}
									studentId={student.id}
								/>
								{conversations.hasNextPage && (
									<Button
										variant="ghost"
										size="sm"
										className="m-3"
										onClick={() => conversations.fetchNextPage()}
										disabled={conversations.isFetchingNextPage}
									>
										Show more
									</Button>
								)}
							</>
						))}
				</div>
				<div className={cn("min-w-0 flex-1", selected ? "block" : "hidden lg:block")}>
					{selected ? (
						<ConversationThread key={selected} id={selected} studentId={student.id} />
					) : (
						<EmptyState
							icon={MessagesSquare}
							title="Pick a conversation"
							hint="Choose a chat on the left to read and reply."
						/>
					)}
				</div>
			</Card>
		</>
	);
}
