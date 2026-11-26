import { afterEach, describe, expect, it, vi } from "vitest";

import { lookupZip } from "./zip-lookup";

function mockFetch(body: unknown, ok = true) {
	const fetchMock = vi.fn(async () => ({ ok, json: async () => body }));
	vi.stubGlobal("fetch", fetchMock);
	return fetchMock;
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("lookupZip", () => {
	it("não consulta com CEP incompleto", async () => {
		const fetchMock = mockFetch({});

		expect(await lookupZip("01310-10")).toBeNull();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("consulta só com os dígitos e devolve o endereço", async () => {
		const fetchMock = mockFetch({
			logradouro: "Avenida Paulista",
			bairro: "Bela Vista",
			localidade: "São Paulo",
			uf: "SP",
		});

		expect(await lookupZip("01310-100")).toEqual({
			street: "Avenida Paulista",
			district: "Bela Vista",
			city: "São Paulo",
			state: "SP",
		});
		expect(fetchMock).toHaveBeenCalledWith(
			"https://viacep.com.br/ws/01310100/json/",
		);
	});

	it("devolve null quando o CEP não existe", async () => {
		mockFetch({ erro: "true" });

		expect(await lookupZip("00000-000")).toBeNull();
	});

	it("lança erro quando o serviço falha", async () => {
		mockFetch({}, false);

		await expect(lookupZip("01310-100")).rejects.toThrow();
	});
});
