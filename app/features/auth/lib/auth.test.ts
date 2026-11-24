import { describe, expect, it } from "vitest";

import { safeCallbackUrl } from "./auth";

describe("safeCallbackUrl", () => {
	it("aceita caminhos do próprio site", () => {
		expect(safeCallbackUrl("/conta/consultas?pagina=2")).toBe(
			"/conta/consultas?pagina=2",
		);
	});

	it("recusa endereços externos e usa a conta", () => {
		expect(safeCallbackUrl("https://golpe.com")).toBe("/conta");
		expect(safeCallbackUrl("//golpe.com")).toBe("/conta");
		expect(safeCallbackUrl(null)).toBe("/conta");
	});
});
