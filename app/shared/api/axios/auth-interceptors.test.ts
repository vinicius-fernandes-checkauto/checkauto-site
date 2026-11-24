import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { AxiosError } from "axios";
import { describe, expect, it, vi } from "vitest";

import { ApiError } from "~/shared/api/api-error";
import { createHttpClient } from "~/shared/api/create-http-client";

function reply(
	config: InternalAxiosRequestConfig,
	status: number,
	data: unknown,
) {
	const response = { status, statusText: "", headers: {}, config, data };
	if (status >= 400) {
		return Promise.reject(
			new AxiosError("falhou", "ERR_BAD_REQUEST", config, null, response),
		);
	}
	return Promise.resolve(response);
}

function setup(validToken: string) {
	const seen: Array<string | undefined> = [];
	let access = "velho";
	const adapter: AxiosAdapter = (config) => {
		const auth = config.headers.get("Authorization") as string | undefined;
		seen.push(auth);
		return auth === `Bearer ${validToken}`
			? reply(config, 200, { ok: true })
			: reply(config, 401, { detail: "Token inválido." });
	};
	const refreshAccessToken = vi.fn(async (): Promise<string | null> => {
		access = validToken;
		return validToken;
	});
	const onSessionExpired = vi.fn();
	const http = createHttpClient({
		baseURL: "https://api.exemplo.com",
		timeout: 1000,
		adapter,
		auth: {
			getAccessToken: () => access,
			refreshAccessToken,
			onSessionExpired,
		},
	});
	return { http, seen, refreshAccessToken, onSessionExpired };
}

describe("interceptors de auth", () => {
	it("manda o Bearer, renova no 401 e repete a chamada", async () => {
		const { http, seen, refreshAccessToken } = setup("novo");

		await expect(http.get("/order/list/")).resolves.toEqual({ ok: true });
		expect(seen).toEqual(["Bearer velho", "Bearer novo"]);
		expect(refreshAccessToken).toHaveBeenCalledTimes(1);
	});

	it("faz um único refresh para chamadas em paralelo", async () => {
		const { http, refreshAccessToken } = setup("novo");

		await Promise.all([
			http.get("/order/list/"),
			http.get("/call/list/"),
			http.get("/wallet/movements/"),
		]);
		expect(refreshAccessToken).toHaveBeenCalledTimes(1);
	});

	it("não manda token nem tenta refresh em rota pública", async () => {
		const { http, seen, refreshAccessToken } = setup("novo");

		await expect(http.post("/token/", {})).rejects.toBeInstanceOf(ApiError);
		expect(seen).toEqual([undefined]);
		expect(refreshAccessToken).not.toHaveBeenCalled();
	});

	it("encerra a sessão quando o refresh falha", async () => {
		const { http, refreshAccessToken, onSessionExpired } = setup("novo");
		refreshAccessToken.mockResolvedValueOnce(null);

		const error: unknown = await http.get("/order/list/").catch((e) => e);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).code).toBe("UNAUTHORIZED");
		expect(onSessionExpired).toHaveBeenCalledTimes(1);
	});
});
