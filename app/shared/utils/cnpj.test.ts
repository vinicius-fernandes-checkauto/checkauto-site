import { describe, expect, it } from "vitest";

import { formatCnpj, isValidCnpj } from "./cnpj";

describe("cnpj", () => {
	it("formata enquanto digita", () => {
		expect(formatCnpj("01689272")).toBe("01.689.272");
		expect(formatCnpj("01689272000103")).toBe("01.689.272/0001-03");
	});

	it("valida os dígitos verificadores", () => {
		expect(isValidCnpj("01689272000103")).toBe(true);
		expect(isValidCnpj("01689272000104")).toBe(false);
		expect(isValidCnpj("11111111111111")).toBe(false);
	});
});
