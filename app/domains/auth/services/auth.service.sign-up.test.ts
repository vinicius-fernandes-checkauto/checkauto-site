import { beforeEach, describe, expect, it, vi } from "vitest";

import * as authApi from "~/domains/auth/auth.api";

import { completeGoogleSignUp, signUp } from "./auth.service";

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
	getCurrentTerms: vi.fn(async () => ({ version: "2026-11", content: "" })),
	signUpWithGoogle: vi.fn(),
}));

vi.mock("~/domains/auth/utils/google-identity", () => ({
	readPendingGoogleSignUp: vi.fn(() => ({ idToken: "id-token-google" })),
	clearPendingGoogleSignUp: vi.fn(),
	readGooglePicture: vi.fn(() => undefined),
}));

function jwt(exp: number) {
	const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
	return `header.${payload}.signature`;
}

const session = {
	access: "access",
	refresh: jwt(Math.floor(Date.now() / 1000) + 3600),
	id: "u1",
	name: "Cliente Teste",
	email: "cliente@exemplo.com",
	profile: "4",
};

const person = {
	personType: "pf" as const,
	firstName: "Cliente",
	lastName: "de Teste",
	cpf: "000.000.000-00",
	cnpj: "",
	corporateName: "",
	fantasyName: "",
	phone: "(11) 90000-0000",
	email: "cliente@exemplo.com",
	password: "senha-de-teste",
	zip: "01000-000",
	street: "Rua de Teste",
	number: "100",
	complement: "",
	district: "Centro",
	city: "São Paulo",
	state: "SP" as const,
	terms: true,
	marketing: false,
	termsVersion: "2026-11",
};

const company = {
	...person,
	personType: "pj" as const,
	cnpj: "00.000.000/0000-00",
	corporateName: "Empresa de Teste Ltda",
	fantasyName: "Empresa de Teste",
	complement: "Sala 2",
	marketing: true,
};

const address = {
	phone: "11900000000",
	cep: "01000000",
	street: "Rua de Teste",
	number_address: "100",
	district: "Centro",
	city: "São Paulo",
	uf: "SP",
};

describe("signUp", () => {
	beforeEach(() => {
		vi.mocked(authApi.signUp).mockReset().mockResolvedValue({ id: "u1" });
		vi.mocked(authApi.login).mockReset().mockResolvedValue(session);
	});

	it("envia ao POST /signup/ os campos de pessoa física", async () => {
		await signUp(person);

		expect(authApi.signUp).toHaveBeenCalledWith({
			person_type: "pf",
			cpf: "00000000000",
			first_name: "Cliente",
			last_name: "de Teste",
			...address,
			accept_terms: true,
			terms_version: "2026-11",
			marketing_consent: false,
			email: "cliente@exemplo.com",
			password: "senha-de-teste",
			recaptcha_token: "token-v3-signup",
		});
	});

	it("envia os campos de pessoa jurídica sem o CPF", async () => {
		await signUp({ ...company, recaptchaV2Token: "token-v2" });

		expect(authApi.signUp).toHaveBeenCalledWith({
			person_type: "pj",
			cnpj: "00000000000000",
			corporate_name: "Empresa de Teste Ltda",
			fantasy_name: "Empresa de Teste",
			first_name: "Cliente",
			last_name: "de Teste",
			...address,
			complement: "Sala 2",
			accept_terms: true,
			terms_version: "2026-11",
			marketing_consent: true,
			email: "cliente@exemplo.com",
			password: "senha-de-teste",
			recaptcha_token: "token-v3-signup",
			recaptcha_token_v2: "token-v2",
		});
	});

	it("entra pelo POST /token/ depois do cadastro, que não devolve tokens", async () => {
		const result = await signUp(person);

		expect(authApi.login).toHaveBeenCalledWith(
			expect.objectContaining({
				username: "cliente@exemplo.com",
				recaptcha_token: "token-v3-login",
			}),
		);
		expect(result?.user).toMatchObject({
			id: "u1",
			authProvider: "credentials",
		});
	});

	it("devolve null quando o login automático falha", async () => {
		vi.mocked(authApi.login).mockRejectedValue(new Error("falhou"));

		expect(await signUp(person)).toBeNull();
	});
});

describe("completeGoogleSignUp", () => {
	it("envia os dados restantes com o id_token, sem e-mail e sem senha", async () => {
		vi.mocked(authApi.signUpWithGoogle).mockResolvedValue(session);
		const { email: _, password: __, termsVersion: ___, ...profile } = person;

		await completeGoogleSignUp(profile);

		const [body] = vi.mocked(authApi.signUpWithGoogle).mock.calls[0];
		expect(body).toEqual({
			id_token: "id-token-google",
			person_type: "pf",
			cpf: "00000000000",
			first_name: "Cliente",
			last_name: "de Teste",
			...address,
			accept_terms: true,
			terms_version: "2026-11",
			marketing_consent: false,
		});
		expect(body).not.toHaveProperty("password");
		expect(body).not.toHaveProperty("email");
	});
});
