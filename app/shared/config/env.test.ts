import { describe, expect, it } from "vitest";

import { readApiEnv } from "./env";

describe("readApiEnv", () => {
	it("lê a URL e usa 15 segundos de timeout por padrão", () => {
		expect(readApiEnv({ VITE_API_URL: "https://api.exemplo.com" })).toEqual({
			baseURL: "https://api.exemplo.com",
			timeout: 15_000,
		});
	});

	it("converte o timeout para número", () => {
		expect(
			readApiEnv({
				VITE_API_URL: "https://api.exemplo.com",
				VITE_API_TIMEOUT: "5000",
			}).timeout,
		).toBe(5000);
	});

	it("falha com mensagem clara quando falta a URL", () => {
		expect(() => readApiEnv({})).toThrow(/VITE_API_URL/);
	});
});
