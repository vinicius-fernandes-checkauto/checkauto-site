import { describe, expect, it } from "vitest";

import type { LoginResponse } from "~/domains/auth/types/auth.types";

import {
	authOptions,
	getAuthRedirect,
	getCompleteProfileRedirect,
	getGuestRedirect,
	redirectAfterSignIn,
} from "./auth.service";

function jwt(exp: number) {
	const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
	return `header.${payload}.signature`;
}

function login(overrides: Partial<LoginResponse> = {}): LoginResponse {
	return {
		access: "access",
		refresh: jwt(Math.floor(Date.now() / 1000) + 3600),
		id: "u1",
		name: "Cliente Teste",
		email: "cliente@exemplo.com",
		profile: "4",
		...overrides,
	};
}

const complete = authOptions.callbacks.session(login());
const incomplete = authOptions.callbacks.session(
	login({ profile_complete: false }),
);

describe("callbacks.session", () => {
	it("transforma a resposta do login em sessão", () => {
		expect(complete).toMatchObject({
			user: {
				id: "u1",
				name: "Cliente Teste",
				email: "cliente@exemplo.com",
				profile: "4",
				profileComplete: true,
			},
			accessToken: "access",
		});
		expect(complete.expires).toBeGreaterThan(Date.now());
	});

	it("recusa refresh token vencido", () => {
		expect(() =>
			authOptions.callbacks.session(login({ refresh: jwt(1) })),
		).toThrow();
	});
});

describe("redirecionamentos", () => {
	it("protege a conta", () => {
		expect(getAuthRedirect(null)).toBe("/entrar");
		expect(getAuthRedirect(incomplete)).toBe("/completar-cadastro");
		expect(getAuthRedirect(complete)).toBeNull();
	});

	it("tira quem já entrou das telas de login", () => {
		expect(getGuestRedirect(null)).toBeNull();
		expect(getGuestRedirect(complete)).toBe("/conta");
		expect(getGuestRedirect(incomplete)).toBe("/completar-cadastro");
	});

	it("decide o destino depois do login", () => {
		expect(redirectAfterSignIn(complete)).toBe("/conta");
		expect(redirectAfterSignIn(incomplete)).toBe("/completar-cadastro");
	});

	it("libera completar cadastro só para quem precisa", () => {
		expect(getCompleteProfileRedirect(null)).toBe("/entrar");
		expect(getCompleteProfileRedirect(complete)).toBe("/conta");
		expect(getCompleteProfileRedirect(incomplete)).toBeNull();
	});
});
