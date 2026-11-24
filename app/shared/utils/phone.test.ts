import { describe, expect, it } from "vitest";

import { formatPhone } from "./phone";

describe("formatPhone", () => {
	it("formata os primeiros dígitos do DDD", () => {
		expect(formatPhone("1")).toBe("(1");
		expect(formatPhone("11")).toBe("(11");
	});

	it("formata o telefone enquanto os dígitos são digitados", () => {
		expect(formatPhone("119")).toBe("(11) 9");
		expect(formatPhone("119876")).toBe("(11) 9876");
		expect(formatPhone("1132345678")).toBe("(11) 3234-5678");
		expect(formatPhone("11987654321")).toBe("(11) 98765-4321");
	});

	it("remove caracteres que não são números", () => {
		expect(formatPhone("(11) 98765-4321")).toBe("(11) 98765-4321");
		expect(formatPhone("abc11xyz987654321")).toBe("(11) 98765-4321");
	});

	it("limita o telefone a 11 dígitos", () => {
		expect(formatPhone("1198765432100")).toBe("(11) 98765-4321");
	});

	it("retorna string vazia quando não há dígitos", () => {
		expect(formatPhone("abc")).toBe("");
	});
});
