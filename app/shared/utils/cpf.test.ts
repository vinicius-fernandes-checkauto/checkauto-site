import { describe, expect, it } from "vitest";

import { formatCpf, isValidCpf } from "./cpf";

describe("formatCpf", () => {
	it("formata os dígitos enquanto são digitados", () => {
		expect(formatCpf("1")).toBe("1");
		expect(formatCpf("1234")).toBe("123.4");
		expect(formatCpf("1234567")).toBe("123.456.7");
		expect(formatCpf("12345678901")).toBe("123.456.789-01");
	});

	it("remove caracteres que não são números", () => {
		expect(formatCpf("529.982.247-25")).toBe("529.982.247-25");
		expect(formatCpf("abc529xyz98224725")).toBe("529.982.247-25");
	});

	it("limita o CPF a 11 dígitos", () => {
		expect(formatCpf("529982247251234")).toBe("529.982.247-25");
	});

	it("retorna string vazia quando não há dígitos", () => {
		expect(formatCpf("abc")).toBe("");
	});
});

describe("isValidCpf", () => {
	it("aceita um CPF com dígitos verificadores válidos", () => {
		expect(isValidCpf("52998224725")).toBe(true);
	});

	it("recusa dígitos verificadores inválidos", () => {
		expect(isValidCpf("52998224724")).toBe(false);
	});

	it("recusa sequências repetidas", () => {
		expect(isValidCpf("11111111111")).toBe(false);
	});

	it("recusa valores com quantidade incorreta de dígitos", () => {
		expect(isValidCpf("5299822472")).toBe(false);
		expect(isValidCpf("529982247251")).toBe(false);
	});
});
