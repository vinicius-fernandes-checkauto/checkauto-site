import { beforeEach, describe, expect, it, vi } from "vitest";

import {
	clearSession,
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
	return {
		user: {
			id: "u1",
			name: "Cliente Teste",
			email: "cliente@exemplo.com",
			profile: "4",
		},
		accessToken: "access",
		refreshToken: "refresh",
		expires,
	};
}

beforeEach(() => {
	const data = new Map<string, string>();
	vi.stubGlobal("window", {
		localStorage: {
			getItem: (key: string) => data.get(key) ?? null,
			setItem: (key: string, value: string) => data.set(key, value),
			removeItem: (key: string) => data.delete(key),
		},
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	});
	clearSession();
});

describe("session", () => {
	it("guarda e lê a sessão", () => {
		const value = session(Date.now() + 60_000);
		setSession(value);
		expect(getSession()).toEqual(value);
		expect(getSession()).toBe(getSession());
	});

	it("descarta sessão vencida", () => {
		setSession(session(Date.now() - 1));
		expect(getSession()).toBeNull();
	});

	it("descarta a sessão quando ela vence depois de lida", () => {
		vi.useFakeTimers();
		setSession(session(Date.now() + 1_000));
		expect(getSession()).not.toBeNull();
		vi.advanceTimersByTime(1_001);
		expect(getSession()).toBeNull();
		vi.useRealTimers();
	});

	it("limpa a sessão", () => {
		setSession(session(Date.now() + 60_000));
		clearSession();
		expect(getSession()).toBeNull();
	});

	it("lê a expiração do token", () => {
		expect(tokenExpiresAt(jwt(2_000_000_000))).toBe(2_000_000_000_000);
		expect(tokenExpiresAt("invalido")).toBe(0);
	});
});
