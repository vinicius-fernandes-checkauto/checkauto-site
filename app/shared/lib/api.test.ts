import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";

import { ApiError, toApiError } from "./api";

function httpError(status: number, data: unknown) {
	const config = { headers: new AxiosHeaders() };
	return new AxiosError("falhou", "ERR_BAD_RESPONSE", config, null, {
		status,
		statusText: "",
		headers: {},
		config,
		data,
	});
}

describe("toApiError", () => {
	it("usa o detail e o code que o backend manda", () => {
		const error = toApiError(
			httpError(401, {
				detail: "Complete o reCAPTCHA para continuar.",
				code: "recaptcha_fallback_required",
			}),
		);
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(401);
		expect(error.message).toBe("Complete o reCAPTCHA para continuar.");
		expect(error.code).toBe("recaptcha_fallback_required");
	});

	it("usa mensagem padrão por status e guarda os erros de campo", () => {
		const data = { email: ["Informe um e-mail válido."] };
		const error = toApiError(httpError(400, data));
		expect(error.message).toBe("Confira os dados informados.");
		expect(error.data).toEqual(data);
	});

	it("trata servidor fora do ar e erros 5xx", () => {
		expect(toApiError(new AxiosError("Network Error")).status).toBeNull();
		expect(toApiError(httpError(502, null)).message).toBe(
			"Tivemos um problema no servidor. Tente de novo em instantes.",
		);
	});
});
