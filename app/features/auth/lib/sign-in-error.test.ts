import { describe, expect, it } from "vitest";

import { ApiError } from "~/shared/api";

import { signInFailure } from "./sign-in-error";

describe("signInFailure", () => {
	it("pede o desafio quando o backend exige o v2", () => {
		const failure = signInFailure(
			new ApiError({
				code: "UNAUTHORIZED",
				status: 401,
				reason: "recaptcha_fallback_required",
			}),
		);
		expect(failure.needsChallenge).toBe(true);
	});

	it("não revela se foi o e-mail ou a senha", () => {
		const failure = signInFailure(
			new ApiError({
				code: "UNAUTHORIZED",
				status: 401,
				message: "No active account found with the given credentials",
			}),
		);
		expect(failure).toEqual({
			message: "E-mail ou senha incorretos.",
			needsChallenge: false,
		});
	});

	it("usa a mensagem padrão em erros de rede", () => {
		const failure = signInFailure(new ApiError({ code: "NETWORK_ERROR" }));
		expect(failure.message).toBe(
			"Não foi possível conectar. Verifique sua internet.",
		);
	});
});
