import { describe, expect, it, vi } from "vitest";

import type { HttpClient } from "~/shared/api";

import { createAuthService } from "./auth-service";

function fakeHttp(response: unknown): HttpClient {
	return {
		get: vi.fn().mockResolvedValue(response),
		post: vi.fn().mockResolvedValue(response),
		put: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	};
}

describe("authService", () => {
	it("envia o e-mail como username e separa tokens e usuário", async () => {
		const http = fakeHttp({
			access: "a1",
			refresh: "r1",
			id: "u1",
			email: "cliente@exemplo.com",
			name: "Cliente Teste",
			profile: "4",
			first_login: "0",
			corporate_id: null,
			corporate_name: null,
			checkmatch_token: "nao-deve-ser-guardado",
			checkmatch: false,
		});
		const result = await createAuthService(http).login({
			email: "cliente@exemplo.com",
			password: "Senha@123",
			recaptchaToken: "v3",
		});

		expect(http.post).toHaveBeenCalledWith("/token/", {
			username: "cliente@exemplo.com",
			password: "Senha@123",
			recaptcha_token: "v3",
			recaptcha_token_v2: undefined,
		});
		expect(result).toEqual({
			tokens: { access: "a1", refresh: "r1" },
			user: {
				id: "u1",
				email: "cliente@exemplo.com",
				name: "Cliente Teste",
				profile: "4",
				firstLogin: false,
				corporateId: null,
				corporateName: null,
			},
		});
	});

	it("recusa resposta de login sem token", async () => {
		const service = createAuthService(fakeHttp({ access: "a1" }));
		await expect(
			service.login({ email: "a@b.com", password: "x" }),
		).rejects.toThrow();
	});

	it("renova o access e aceita refresh opcional", async () => {
		const http = fakeHttp({ access: "a2" });
		const tokens = await createAuthService(http).refresh("r1");

		expect(http.post).toHaveBeenCalledWith("/token/refresh/", {
			refresh: "r1",
		});
		expect(tokens).toEqual({ access: "a2" });
	});

	it("tira o contrato vigente do envelope sem alterar o texto", async () => {
		const texto = "                    Cláusula 1\n                    \n";
		const http = fakeHttp({
			user: null,
			content: {
				version: "2026-11",
				content: texto,
				published_at: "2026-11-20T10:00:00Z",
			},
		});
		const terms = await createAuthService(http).currentTerms();

		expect(http.get).toHaveBeenCalledWith("/user/terms/current/", {
			signal: undefined,
		});
		expect(terms).toEqual({
			version: "2026-11",
			content: texto,
			publishedAt: "2026-11-20T10:00:00Z",
		});
	});
});
