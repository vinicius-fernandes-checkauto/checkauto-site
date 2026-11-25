import { beforeEach, describe, expect, it, vi } from "vitest";

import { clearSession, type Session, setSession } from "~/shared/lib/session";

import { requireAccountSession } from "./account-middleware";

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

const refreshPayload = Buffer.from(
	JSON.stringify({ exp: Math.floor((Date.now() + 60_000) / 1000) }),
).toString("base64url");

const session: Session = {
	user: {
		id: "u1",
		name: "Cliente Teste",
		email: "cliente@exemplo.com",
		profile: "4",
	},
	accessToken: "access",
	refreshToken: `header.${refreshPayload}.signature`,
	expires: Date.now() + 60_000,
};

beforeEach(() => {
	vi.stubGlobal("window", {
		location: { protocol: "https:" },
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	});
	vi.stubGlobal("document", cookieDocument());
	clearSession();
});

describe("requireAccountSession", () => {
	it("retorna a sessão quando autenticada", () => {
		setSession(session);

		expect(requireAccountSession()).toMatchObject({
			user: session.user,
			accessToken: session.accessToken,
			refreshToken: session.refreshToken,
		});
	});

	it("redireciona ao login quando não há sessão", () => {
		try {
			requireAccountSession();
			throw new Error("Era esperado redirecionar ao login.");
		} catch (error) {
			expect(error).toBeInstanceOf(Response);
			expect((error as Response).status).toBe(302);
			expect((error as Response).headers.get("Location")).toBe("/entrar");
		}
	});
});
