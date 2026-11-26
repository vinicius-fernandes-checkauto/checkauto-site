import { beforeEach, describe, expect, it, vi } from "vitest";

import {
	clearSession,
	getPublicSession,
	getSession,
	type Session,
	setSession,
	tokenExpiresAt,
} from "./session";

function jwt(exp: number) {
	const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
	return `header.${payload}.signature`;
}

function session(expires: number): Session {
	const expiration = Math.floor(expires / 1000) * 1000;
	const refreshPayload = Buffer.from(
		JSON.stringify({ exp: expiration / 1000 }),
	).toString("base64url");

	return {
		user: {
			id: "u1",
			name: "Cliente Teste",
			email: "cliente@exemplo.com",
			profile: "4",
			authProvider: "credentials",
		},
		accessToken: "access",
		refreshToken: `header.${refreshPayload}.signature`,
		expires: expiration,
	};
}

function cookieDocument() {
	const values = new Map<string, string>();

	return Object.defineProperty({}, "cookie", {
		get: () =>
			Array.from(values, ([name, value]) => `${name}=${value}`).join("; "),
		set: (cookie: string) => {
			const [pair, ...attributes] = cookie.split("; ");
			const separator = pair.indexOf("=");
			const name = pair.slice(0, separator);
			const value = pair.slice(separator + 1);
			if (attributes.includes("Max-Age=0")) values.delete(name);
			else values.set(name, value);
		},
	}) as Document;
}

beforeEach(() => {
	vi.stubGlobal("window", {
		location: { protocol: "https:" },
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	});
	vi.stubGlobal("document", cookieDocument());
	clearSession();
});

describe("session", () => {
	it("guarda e lê a sessão", () => {
		const value = session(Date.now() + 60_000);
		setSession(value);
		expect(getSession()).toEqual(value);
		expect(getSession()).toBe(getSession());
		expect(document.cookie).toMatch(/^__Secure-checkauto\.session-token=/);
		expect(document.cookie.split("; ")).toHaveLength(1);
	});

	it("expõe um snapshot público estável sem tokens", () => {
		const value = session(Date.now() + 60_000);
		setSession(value);

		expect(getPublicSession()).toEqual({ user: value.user });
		expect(getPublicSession()).toBe(getPublicSession());
	});

	it("descarta sessão vencida", () => {
		const { expires: _, ...expired } = session(Date.now() - 1_000);
		document.cookie = `__Secure-checkauto.session-token=${encodeURIComponent(JSON.stringify(expired))}`;
		expect(getSession()).toBeNull();
	});

	it("descarta a sessão quando ela vence depois de lida", () => {
		vi.useFakeTimers();
		setSession(session(Date.now() + 3_000));
		expect(getSession()).not.toBeNull();
		vi.advanceTimersByTime(3_001);
		expect(getSession()).toBeNull();
		vi.useRealTimers();
	});

	it("limpa a sessão", () => {
		setSession(session(Date.now() + 60_000));
		clearSession();
		expect(getSession()).toBeNull();
		expect(document.cookie).toBe("");
	});

	it("lê a expiração do token", () => {
		expect(tokenExpiresAt(jwt(2_000_000_000))).toBe(2_000_000_000_000);
		expect(tokenExpiresAt("invalido")).toBe(0);
	});
});
