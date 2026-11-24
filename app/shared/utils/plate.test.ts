import { describe, expect, it } from "vitest";

import { normalizePlate, plateSchema } from "./plate";

function getError(value: string) {
	return plateSchema.safeParse(value).error?.issues[0]?.message;
}

describe("normalizePlate", () => {
	it("converte para maiúsculas", () => {
		expect(normalizePlate("abc1d23")).toBe("ABC1D23");
	});

	it("remove traço, espaços e outros caracteres", () => {
		expect(normalizePlate(" abc-1234 ")).toBe("ABC1234");
		expect(normalizePlate("ABC.1D23")).toBe("ABC1D23");
	});

	it("limita a 7 caracteres", () => {
		expect(normalizePlate("ABC1D234")).toBe("ABC1D23");
	});
});

describe("plateSchema", () => {
	it("aceita o padrão antigo", () => {
		expect(plateSchema.parse("ABC1234")).toBe("ABC1234");
	});

	it("aceita o padrão Mercosul", () => {
		expect(plateSchema.parse("ABC1D23")).toBe("ABC1D23");
	});

	it("devolve a placa normalizada quando digitada com traço ou minúsculas", () => {
		expect(plateSchema.parse("abc-1d23")).toBe("ABC1D23");
	});

	it("pede a placa quando o campo está vazio", () => {
		expect(getError("")).toBe("Informe a placa do veículo.");
		expect(getError("  ")).toBe("Informe a placa do veículo.");
	});

	it("explica o formato quando a placa está incompleta", () => {
		expect(getError("ABC12")).toBe(
			"A placa precisa ter 7 caracteres, como ABC1234 ou ABC1D23.",
		);
	});

	it("recusa letras e números fora de posição", () => {
		const message = "Use 3 letras e 4 caracteres, como ABC1234 ou ABC1D23.";

		expect(getError("1234ABC")).toBe(message);
		expect(getError("AB12345")).toBe(message);
		expect(getError("ABCD123")).toBe(message);
		expect(getError("ABC12D3")).toBe(message);
	});

	it("retorna só um erro por vez", () => {
		expect(plateSchema.safeParse("ABC").error?.issues).toHaveLength(1);
	});
});
