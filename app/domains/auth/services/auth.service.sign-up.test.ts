import { beforeEach, describe, expect, it, vi } from "vitest";

import * as authApi from "~/domains/auth/auth.api";

import { signUp } from "./auth.service";

vi.mock("~/domains/auth/utils/recaptcha", () => ({
	getRecaptchaToken: vi.fn(async (action: string) => `token-v3-${action}`),
}));

vi.mock("~/shared/lib/session", async (importOriginal) => ({
	...(await importOriginal<typeof import("~/shared/lib/session")>()),
	setSession: vi.fn(),
}));

vi.mock("~/domains/auth/auth.api", () => ({
	signUp: vi.fn(),
	login: vi.fn(),
}));

function jwt(exp: number) {
	const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
	return `header.${payload}.signature`;
}

const created = {
	access: "access",
	refresh: jwt(Math.floor(Date.now() / 1000) + 3600),
	id: "u1",
	name: "Cliente Teste",
	email: "cliente@exemplo.com",
	profile: "4",
};

const form = {
	name: "Cliente de Teste Silva",
	email: "cliente@exemplo.com",
	cpf: "00000000000",
	password: "senha-de-teste",
	terms: true,
	marketing: false,
	termsVersion: "2026-11",
};

describe("signUp", () => {
	beforeEach(() => {
		vi.mocked(authApi.signUp).mockReset().mockResolvedValue(created);
	});

	it("envia ao POST /signup/ exatamente os campos do contrato", async () => {
		await signUp(form);

		expect(authApi.signUp).toHaveBeenCalledWith({
			person_type: "pf",
			first_name: "Cliente",
			last_name: "de Teste Silva",
			email: "cliente@exemplo.com",
			cpf: "00000000000",
			password: "senha-de-teste",
			accept_terms: true,
			terms_version: "2026-11",
			marketing_consent: false,
			recaptcha_token: "token-v3-signup",
		});
	});

	it("inclui o token do desafio v2 só quando ele existe", async () => {
		await signUp({ ...form, marketing: true, recaptchaV2Token: "token-v2" });

		expect(authApi.signUp).toHaveBeenCalledWith(
			expect.objectContaining({
				marketing_consent: true,
				recaptcha_token_v2: "token-v2",
			}),
		);
	});

	it("abre a sessão quando o cadastro já devolve os tokens", async () => {
		const session = await signUp(form);

		expect(session?.user).toMatchObject({
			id: "u1",
			authProvider: "credentials",
		});
		expect(authApi.login).not.toHaveBeenCalled();
	});
});
