import { describe, expect, it } from "vitest";

import { readNotice } from "./notice";

describe("readNotice", () => {
	it("lê o aviso e o e-mail vindos da navegação", () => {
		expect(
			readNotice({ notice: "Conta criada.", email: "a@exemplo.com" }),
		).toEqual({ notice: "Conta criada.", email: "a@exemplo.com" });
	});

	it("ignora estados sem aviso", () => {
		expect(readNotice(null)).toBeNull();
		expect(readNotice({ email: "a@exemplo.com" })).toBeNull();
	});
});
