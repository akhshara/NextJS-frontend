"use client";

import { ArrowRight, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

import AuthFooter from "@/components/auth/AuthFooter";
import AuthHeading from "@/components/auth/AuthHeading";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import FormInput from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TextLink } from "@/components/ui/text-link";
import { safeReturnPath } from "@/features/student/session";
import { getErrorMessage, getFieldErrors, readForm } from "@/lib/utils/page-helpers";
import { authService, type User } from "@/services/auth.service";

export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState<"email" | "google" | null>(null);
	const signingIn = useRef(false);
	const remember = useRef<HTMLInputElement>(null);
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	async function signIn(method: "email" | "google", authenticate: () => Promise<User>) {
		if (signingIn.current) return;
		signingIn.current = true;
		setLoading(method);
		setErrors({});
		try {
			const user = await authenticate();
			const next = new URLSearchParams(window.location.search).get("next");
			router.push(user.is_superuser ? "/admin" : safeReturnPath(next));
		} catch (error) {
			setErrors(getFieldErrors(error));
			toast.error(getErrorMessage(error));
			signingIn.current = false;
			setLoading(null);
		}
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const { email, password } = readForm(event, "email", "password");
		void signIn("email", () =>
			authService.login(email, password, remember.current?.checked ?? false),
		);
	}

	return (
		<>
			<AuthHeading
				eyebrow="Student access"
				title="Welcome back"
				description="Sign in with your university email to buy, sell and swap textbooks."
			/>
			<form className="space-y-5" onSubmit={handleSubmit}>
				<FormInput
					id="email"
					label="University email"
					type="email"
					icon={<Mail />}
					autoComplete="email"
					placeholder="you@university.edu"
					errors={errors.email}
				/>
				<FormInput
					id="password"
					label="Password"
					type="password"
					icon={<Lock />}
					autoComplete="current-password"
					errors={errors.password}
				/>
				<div className="flex items-center justify-between">
					<Label>
						<Checkbox name="remember" ref={remember} />
						Remember me
					</Label>
					<TextLink href="/forgot-password">Forgot password?</TextLink>
				</div>
				<Button type="submit" size="lg" className="w-full" disabled={loading !== null}>
					{loading === "email" ? "Signing in…" : "Sign in"}
					{loading !== "email" && <ArrowRight />}
				</Button>
			</form>
			<GoogleSignIn
				disabled={loading !== null}
				onCredential={(credential) => {
					void signIn("google", () =>
						authService.loginWithGoogle(credential, remember.current?.checked ?? false),
					);
				}}
			/>
			{loading === "google" && (
				<p role="status" className="mt-2 text-center text-sm text-muted-foreground">
					Signing in with Google…
				</p>
			)}
			<AuthFooter prompt="New to Akshara?" label="Create an account" href="/register" />
		</>
	);
}
