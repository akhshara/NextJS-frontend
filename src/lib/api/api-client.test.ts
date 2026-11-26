import { beforeEach, describe, expect, it, vi } from "vitest";

import { authService } from "@/services/auth.service";

import { ApiRequestError, requestApi, tokenStorage } from "./api-client";

function memoryStorage() {
	const items = new Map<string, string>();
	return {
		getItem: (key: string) => items.get(key) ?? null,
		setItem: (key: string, value: string) => items.set(key, value),
		removeItem: (key: string) => items.delete(key),
	};
}

function json(status: number, body: unknown) {
	return new Response(JSON.stringify(body), { status });
}

beforeEach(() => {
	vi.stubGlobal("localStorage", memoryStorage());
	vi.stubGlobal("sessionStorage", memoryStorage());
});

describe("tokenStorage", () => {
	it("keeps remembered sessions in localStorage", () => {
		tokenStorage.set("a", "r", true);
		expect(localStorage.getItem("aksaraRefreshToken")).toBe("r");
		expect(sessionStorage.getItem("aksaraRefreshToken")).toBeNull();
		expect(tokenStorage.getAccess()).toBe("a");
		expect(tokenStorage.isRemembered()).toBe(true);
	});

	it("keeps other sessions in sessionStorage", () => {
		tokenStorage.set("a", "r", false);
		expect(localStorage.getItem("aksaraRefreshToken")).toBeNull();
		expect(tokenStorage.getAccess()).toBe("a");
		expect(tokenStorage.isRemembered()).toBe(false);
	});

	it("moves tokens when a later sign in changes the choice", () => {
		tokenStorage.set("a1", "r1", true);
		tokenStorage.set("a2", "r2", false);
		expect(localStorage.getItem("aksaraRefreshToken")).toBeNull();
		expect(tokenStorage.getRefresh()).toBe("r2");
	});

	it("clears both stores", () => {
		tokenStorage.set("a", "r", true);
		sessionStorage.setItem("aksaraAccessToken", "stale");
		tokenStorage.clear();
		expect(tokenStorage.getAccess()).toBeNull();
		expect(sessionStorage.getItem("aksaraAccessToken")).toBeNull();
	});
});

describe("requestApi token refresh", () => {
	it.each([
		["password", () => authService.login("student@university.edu", "password", false)],
		["Google", () => authService.loginWithGoogle("google-credential", false)],
	] as const)(
		"does not send or refresh an existing session when %s sign-in fails",
		async (_, login) => {
			tokenStorage.set("old-access", "old-refresh", true);
			const fetchMock = vi.fn().mockResolvedValue(json(401, { detail: "Credential rejected." }));
			vi.stubGlobal("fetch", fetchMock);

			await expect(login()).rejects.toThrow("Credential rejected.");

			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: { Accept: "application/json", "Content-Type": "application/json" },
				}),
			);
			expect(tokenStorage.getRefresh()).toBe("old-refresh");
		},
	);

	it.each([true, false])("stores the Google session with remember=%s", async (remember) => {
		const user = { id: 1, email: "student@university.edu" };
		const fetchMock = vi
			.fn()
			.mockResolvedValue(json(200, { access: "new-access", refresh: "new-refresh", user }));
		vi.stubGlobal("fetch", fetchMock);

		await expect(authService.loginWithGoogle("google-credential", remember)).resolves.toEqual(user);
		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringMatching(/\/api\/auth\/social\/google\/$/),
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({ id_token: "google-credential" }),
			}),
		);
		expect(tokenStorage.getAccess()).toBe("new-access");
		expect(tokenStorage.getRefresh()).toBe("new-refresh");
		expect(tokenStorage.isRemembered()).toBe(remember);
	});

	it.each([true, false])(
		"keeps remember=%s after refreshing an expired token",
		async (remember) => {
			tokenStorage.set("old-access", "old-refresh", remember);
			const fetchMock = vi
				.fn()
				.mockResolvedValueOnce(json(401, { detail: "expired" }))
				.mockResolvedValueOnce(json(200, { access: "new-access", refresh: "new-refresh" }))
				.mockResolvedValueOnce(json(200, { ok: true }));
			vi.stubGlobal("fetch", fetchMock);

			await expect(requestApi("/api/me/")).resolves.toEqual({ ok: true });
			expect(tokenStorage.getAccess()).toBe("new-access");
			expect(tokenStorage.isRemembered()).toBe(remember);
			expect(fetchMock).toHaveBeenLastCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({ Authorization: "Bearer new-access" }),
				}),
			);
		},
	);

	it("signs out when the refresh token is rejected", async () => {
		tokenStorage.set("old-access", "old-refresh", true);
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValueOnce(json(401, { detail: "expired" }))
				.mockResolvedValueOnce(json(401, { detail: "invalid" })),
		);

		await expect(requestApi("/api/me/")).rejects.toThrow("expired");
		expect(tokenStorage.getRefresh()).toBeNull();
	});
});

describe("requestApi errors", () => {
	it("reports a server error as one, not as field errors", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response("<h1>Server Error (500)</h1>", { status: 500 })),
		);

		await expect(requestApi("/api/admin/slides/")).rejects.toThrow(
			"Something went wrong on the server",
		);
	});

	it("keeps the API's own message", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json(400, { detail: "Not allowed." })));

		await expect(requestApi("/api/x/")).rejects.toThrow("Not allowed.");
	});

	it("uses a bare list of messages as the message", async () => {
		const body = ["This listing is no longer available."];
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json(400, body)));

		await expect(requestApi("/api/x/")).rejects.toThrow("This listing is no longer available.");
	});

	it("names errors inside lists by their path", async () => {
		const body = { title: ["Too long."], items: [{}, { text: ["Required."] }] };
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json(400, body)));

		const error = await requestApi("/api/x/").catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiRequestError);
		expect((error as ApiRequestError).message).toBe("Too long. Required.");
		expect((error as ApiRequestError).fields).toEqual({
			title: ["Too long."],
			"items.1.text": ["Required."],
		});
	});
});
