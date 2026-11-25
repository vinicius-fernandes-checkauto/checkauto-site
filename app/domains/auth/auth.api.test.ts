import { describe, expect, it } from "vitest";

import { parseCurrentTerms } from "./auth.api";

describe("parseCurrentTerms", () => {
	it("lê a versão e preserva exatamente o texto do envelope da API", () => {
		const terms = parseCurrentTerms({
			user: { id: "1" },
			content: {
				version: "2026-11",
				content: "  Linha inicial\n\n    Linha seguinte  ",
				published_at: "2026-11-24T12:00:00Z",
			},
		});

		expect(terms).toEqual({
			version: "2026-11",
			content: "  Linha inicial\n\n    Linha seguinte  ",
			published_at: "2026-11-24T12:00:00Z",
		});
	});

	it("aceita a resposta sem envelope", () => {
		expect(
			parseCurrentTerms({
				version: "2026-11",
				content: "Texto do contrato",
			}),
		).toEqual({
			version: "2026-11",
			content: "Texto do contrato",
		});
	});
});
