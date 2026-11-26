"use client";

import { SendHorizontal } from "lucide-react";
import { type FormEvent, type KeyboardEvent, useState } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { Textarea } from "@/components/ui/textarea";

import { MAX_MESSAGE_LENGTH } from "../constants";
import { useSendMessage } from "../queries";

/** Enter sends; Shift+Enter starts a new line. */
export default function MessageComposer({ conversationId }: { conversationId: number }) {
	const send = useSendMessage(conversationId);
	const [body, setBody] = useState("");
	const text = body.trim();

	function submit(event?: FormEvent) {
		event?.preventDefault();
		if (!text || send.isPending) return;
		send.mutate(text, { onSuccess: () => setBody("") });
	}

	function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
			event.preventDefault();
			submit();
		}
	}

	return (
		<form onSubmit={submit} className="flex items-end gap-2 border-t p-3">
			<Textarea
				aria-label="Message"
				placeholder="Write a message"
				rows={1}
				maxLength={MAX_MESSAGE_LENGTH}
				value={body}
				onChange={(event) => setBody(event.target.value)}
				onKeyDown={handleKeyDown}
				className="max-h-32 min-h-11 resize-none text-base md:min-h-10 md:text-body-md"
			/>
			<IconButton
				type="submit"
				label="Send"
				className="max-md:size-11"
				disabled={!text || send.isPending}
			>
				<SendHorizontal />
			</IconButton>
		</form>
	);
}
