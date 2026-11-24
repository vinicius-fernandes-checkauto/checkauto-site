import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";

import { ApiError } from "~/shared/api/api-error";

import { toApiError } from "./to-api-error";

function responseError(status: number, data: unknown) {
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
	it("usa o detail do Django REST como mensagem", () => {
		const error = toApiError(
			responseError(401, { detail: "Credenciais inválidas." }),
		);
		expect(error.code).toBe("UNAUTHORIZED");
		expect(error.status).toBe(401);
		expect(error.message).toBe("Credenciais inválidas.");
	});

	it("guarda os erros de campo em details", () => {
		const data = { email: ["Informe um e-mail válido."] };
		const error = toApiError(responseError(400, data));
		expect(error.code).toBe("VALIDATION");
		expect(error.message).toBe("Confira os dados informados.");
		expect(error.details).toEqual(data);
	});

	it("trata servidor fora do ar como erro de rede", () => {
		const error = toApiError(new AxiosError("Network Error", "ERR_NETWORK"));
		expect(error.code).toBe("NETWORK_ERROR");
	});

	it("reconhece timeout e cancelamento", () => {
		expect(toApiError(new AxiosError("t", "ECONNABORTED")).code).toBe(
			"TIMEOUT",
		);
		expect(toApiError(new AxiosError("c", "ERR_CANCELED")).code).toBe(
			"CANCELED",
		);
	});

	it("devolve o mesmo ApiError e embrulha erros desconhecidos", () => {
		const original = new ApiError({ code: "FORBIDDEN" });
		expect(toApiError(original)).toBe(original);
		expect(toApiError(new Error("x")).code).toBe("UNKNOWN");
	});
});
