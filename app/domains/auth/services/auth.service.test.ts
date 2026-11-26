import { describe, expect, it } from "vitest";

import type { LoginResponse } from "~/domains/auth/types/auth.types";

import {
	authOptions,
	canChangePassword,
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

const session = authOptions.callbacks.session(login());
const googleSession = authOptions.callbacks.session(login(), "google");

describe("callbacks.session", () => {
	it("transforma a resposta do login em sessão", () => {
		expect(session).toMatchObject({
			user: {
				id: "u1",
				name: "Cliente Teste",
				email: "cliente@exemplo.com",
				profile: "4",
				authProvider: "credentials",
			},
			accessToken: "access",
		});
		expect(session.expires).toBeGreaterThan(Date.now());
		expect(googleSession.user.authProvider).toBe("google");
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
		expect(getAuthRedirect(session)).toBeNull();
	});

	it("tira quem já entrou das telas de login", () => {
		expect(getGuestRedirect(null)).toBeNull();
		expect(getGuestRedirect(session)).toBe("/conta");
		expect(redirectAfterSignIn(session)).toBe("/conta");
	});

	it("libera completar cadastro só com o cadastro do Google pendente", () => {
		expect(getCompleteProfileRedirect(null, true)).toBeNull();
		expect(getCompleteProfileRedirect(null, false)).toBe("/entrar");
		expect(getCompleteProfileRedirect(session, false)).toBe("/conta");
	});
});

describe("canChangePassword", () => {
	it("esconde a troca de senha para conta do Google", () => {
		expect(canChangePassword(session)).toBe(true);
		expect(canChangePassword(googleSession)).toBe(false);
	});
});

describe("foto do Google na sessão", () => {
	it("guarda a foto quando ela é informada", () => {
		const withPicture = authOptions.callbacks.session(
			login(),
			"google",
			"https://lh3.googleusercontent.com/a/foto",
		);

		expect(withPicture.user.picture).toBe(
			"https://lh3.googleusercontent.com/a/foto",
		);
	});

	it("não cria o campo quando não há foto", () => {
		expect(googleSession.user).not.toHaveProperty("picture");
	});
});
