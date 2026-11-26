import { describe, expect, it } from "vitest";

import { callListSchema } from "~/domains/account/utils/account.schema";

import {
	formatDateTime,
	queryPeriod,
	toCallListParams,
	toVehicleQueries,
} from "./queries";

const today = new Date(2026, 10, 26);
const empty = { placa: "", de: "", ate: "", pagina: 1 };

describe("queryPeriod", () => {
	it("sem filtro, usa os últimos 12 meses", () => {
		expect(queryPeriod(empty, today)).toEqual({
			from: "2025-11-26",
			to: "2026-11-26",
			exceeded: false,
		});
	});

	it("respeita o período escolhido", () => {
		expect(
			queryPeriod({ ...empty, de: "2026-10-01", ate: "2026-10-31" }, today),
		).toEqual({ from: "2026-10-01", to: "2026-10-31", exceeded: false });
	});

	it("limita a 12 meses antes da data final", () => {
		expect(
			queryPeriod({ ...empty, de: "2024-01-01", ate: "2026-06-30" }, today),
		).toEqual({ from: "2025-06-30", to: "2026-06-30", exceeded: true });
	});

	it("ignora data inválida ou inicial depois da final", () => {
		expect(
			queryPeriod({ ...empty, de: "2026-12-10", ate: "abc" }, today).from,
		).toBe("2025-11-26");
	});
});

describe("toCallListParams", () => {
	it("monta os parâmetros do GET /call/list/", () => {
		expect(
			toCallListParams({ ...empty, placa: "abc-1d23", pagina: 3 }, today),
		).toEqual({
			initial_date: "2025-11-26",
			final_date: "2026-11-26",
			page: 3,
			page_size: 10,
			search: "ABC1D23",
		});
	});

	it("não envia search vazio nem página menor que 1", () => {
		const params = toCallListParams({ ...empty, pagina: 0 }, today);

		expect(params.page).toBe(1);
		expect(params).not.toHaveProperty("search");
	});
});

describe("toVehicleQueries", () => {
	const list = callListSchema.parse({
		count: 2,
		results: [
			{
				id: "c1",
				query_code: 12320812,
				products: ["Checkauto Master"],
				status: "3",
				data: { placa: { value: "abc1d23", description: "Placa" } },
				created_at: "23/11/2026 às 06:00",
			},
			{
				id: "c2",
				query_code: null,
				products: [{ name: "Checkauto Plus" }, { name: "Checkauto Standard" }],
				status: "5",
				data: { documento: { value: "xyz4e56" } },
				created_at: "2026-11-19T12:17:00Z",
			},
		],
	});

	it("converte as consultas da API para a tela", () => {
		expect(toVehicleQueries(list)).toEqual([
			{
				id: "c1",
				code: "12320812",
				plate: "ABC1D23",
				plan: "Checkauto Master",
				date: "23/11/2026 · 06:00",
				status: "done",
			},
			{
				id: "c2",
				code: "",
				plate: "XYZ4E56",
				plan: "Consulta múltipla",
				date: "19/11/2026 · 09:17",
				status: "unavailable",
			},
		]);
	});
});

describe("formatDateTime", () => {
	it("aceita data já formatada pelo backend e data ISO", () => {
		expect(formatDateTime("23/11/2026 às 06:00")).toBe("23/11/2026 · 06:00");
		expect(formatDateTime("2026-11-19T12:17:00Z")).toBe("19/11/2026 · 09:17");
	});
});
