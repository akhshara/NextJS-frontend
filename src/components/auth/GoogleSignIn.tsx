"use client";

import Script from "next/script";
import { useEffect, useEffectEvent, useRef, useState } from "react";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

type GoogleIdentity = {
	initialize(options: {
		client_id: string;
		callback: (response: { credential: string }) => void;
	}): void;
	renderButton(
		parent: HTMLElement,
		options: { type: "standard"; size: "large"; text: "continue_with"; width: string },
	): void;
};

type GoogleWindow = Window & { google?: { accounts: { id: GoogleIdentity } } };

type GoogleSignInProps = {
	disabled: boolean;
	onCredential: (credential: string) => void;
};

export default function GoogleSignIn({ disabled, onCredential }: GoogleSignInProps) {
	const container = useRef<HTMLDivElement>(null);
	const [identity, setIdentity] = useState<GoogleIdentity>();
	const [unavailable, setUnavailable] = useState(false);
	const receiveCredential = useEffectEvent(onCredential);

	useEffect(() => {
		const parent = container.current;
		if (!clientId || !identity || !parent) return;

		let active = true;
		identity.initialize({
			client_id: clientId,
			callback: ({ credential }) => {
				if (active) receiveCredential(credential);
			},
		});
		let renderedWidth = 0;
		const renderButton = () => {
			// Google caps the rendered button at 400px.
			const width = Math.min(parent.clientWidth, 400);
			if (!width || width === renderedWidth) return;

			parent.replaceChildren();
			identity.renderButton(parent, {
				type: "standard",
				size: "large",
				text: "continue_with",
				width: String(width),
			});
			renderedWidth = width;
		};
		renderButton();
		const observer = new ResizeObserver(renderButton);
		observer.observe(parent);

		return () => {
			active = false;
			observer.disconnect();
			parent.replaceChildren();
		};
	}, [identity]);

	if (!clientId) return null;

	// Next can settle a cached script load after a route remount, even after an error.
	function handleScriptLoad() {
		const sdk = (window as GoogleWindow).google?.accounts?.id;
		if (sdk) setIdentity(sdk);
		else setUnavailable(true);
	}

	return (
		<div className="mt-5">
			<Script
				src="https://accounts.google.com/gsi/client"
				onReady={handleScriptLoad}
				onLoad={handleScriptLoad}
				onError={() => setUnavailable(true)}
			/>
			{unavailable ? (
				<p role="status" className="text-center text-sm text-muted-foreground">
					Google sign-in is unavailable. You can sign in with email.
				</p>
			) : (
				<div
					ref={container}
					inert={disabled}
					className="mx-auto w-full max-w-[400px] inert:opacity-50"
				/>
			)}
		</div>
	);
}
