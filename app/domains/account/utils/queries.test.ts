import { describe, expect, it } from "vitest";

import {
	orderDetailSchema,
	orderListSchema,
} from "~/domains/account/utils/account.schema";

import {
	canOpenStatement,
	compactStatusLabel,
	formatDateTime,
	isRequeryAvailable,
	isRunning,
	queryPeriod,
	toOrderDetail,
	toOrderListParams,
	toVehicleQueries,
} from "./queries";

const today = new Date(2026, 10, 26);
const empty = {
	busca: "",
	situacao: "",
	de: "",
	ate: "",
	pagina: 1,
	itens: 10,
};

describe("queryPeriod", () => {
	it("sem filtro, usa os últimos 12 meses", () => {
		expect(queryPeriod(empty, today)).toEqual({
			from: "2025-11-26",
			to: "2026-11-26",
			exceeded: false,
		});
	});

	it("limita a 12 meses antes da data final", () => {
		expect(
			queryPeriod({ ...empty, de: "2024-01-01", ate: "2026-06-30" }, today),
		).toEqual({ from: "2025-06-30", to: "2026-06-30", exceeded: true });
	});
});

describe("toOrderListParams", () => {
	it("monta os parâmetros do GET /order/list/", () => {
		expect(
			toOrderListParams(
				{
					...empty,
					busca: " ABC1D23 ",
					situacao: "paid",
					pagina: 3,
					itens: 20,
				},
				today,
			),
		).toEqual({
			date_from: "2025-11-26",
			date_to: "2026-11-26",
			page: 3,
			page_size: 20,
			search: "ABC1D23",
			status: "paid",
		});
	});

	it("não envia busca curta, situação desconhecida, página menor que 1 nem tamanho fora da lista", () => {
		const params = toOrderListParams(
			{ ...empty, busca: "a", situacao: "qualquer", pagina: 0, itens: 999 },
			today,
		);

		expect(params.page).toBe(1);
		expect(params.page_size).toBe(10);
		expect(params).not.toHaveProperty("search");
		expect(params).not.toHaveProperty("status");
	});
});

describe("toVehicleQueries", () => {
	const list = orderListSchema.parse({
		count: 2,
		results: [
			{
				id: "o1",
				number: 1042,
				status: "completed",
				status_label: "Concluído",
				plate: "abc1d23",
				product: { id: "p1", name: "Checkauto Master" },
				amount: "59.90",
				created_at: "2026-11-23T09:00:00Z",
				query_code: "12320812",
			},
			{
				id: "o2",
				number: 1043,
				status: "novo_status",
				status_label: "",
				plate: null,
				product: null,
				amount: null,
				created_at: "23/11/2026 às 06:00",
				query_code: null,
			},
		],
	});

	it("converte os pedidos da API para a tela", () => {
		expect(toVehicleQueries(list)).toEqual([
			{
				id: "o1",
				number: "#1042",
				code: "12320812",
				plate: "ABC1D23",
				plan: "Checkauto Master",
				amount: 59.9,
				date: "23/11/2026 · 06:00",
				status: "completed",
				statusLabel: "Concluído",
				canRequery: false,
				requerying: false,
			},
			{
				id: "o2",
				number: "#1043",
				code: "",
				plate: "",
				plan: "",
				amount: null,
				date: "23/11/2026 · 06:00",
				status: "unknown",
				statusLabel: "Em análise",
				canRequery: false,
				requerying: false,
			},
		]);
	});
});

describe("situação do pedido", () => {
	it("extrato só em pedido concluído", () => {
		expect(canOpenStatement("completed")).toBe(true);
		expect(canOpenStatement("completed_partial")).toBe(true);
		expect(canOpenStatement("paid")).toBe(false);
		expect(canOpenStatement("failed")).toBe(false);
	});

	it("atualiza sozinho enquanto o pedido está em andamento", () => {
		expect(isRunning("awaiting_payment")).toBe(true);
		expect(isRunning("processing")).toBe(true);
		expect(isRunning("completed")).toBe(false);
		expect(isRunning("cancelled")).toBe(false);
	});
});

describe("reconsulta", () => {
	it("só em pedido parcial com a consulta parada (call.status 5)", () => {
		expect(isRequeryAvailable("completed_partial", "5")).toBe(true);
		expect(isRequeryAvailable("completed_partial", "2")).toBe(false);
		expect(isRequeryAvailable("completed", "5")).toBe(false);
		expect(isRequeryAvailable("failed", "5")).toBe(false);
		expect(isRequeryAvailable("completed_partial", undefined)).toBe(false);
	});

	it("marca a consulta do pedido como reconsultável ou reconsultando", () => {
		const list = orderListSchema.parse({
			count: 2,
			results: [
				{ id: "o1", status: "completed_partial" },
				{ id: "o2", status: "completed_partial" },
			],
		});
		const calls = new Map([
			["o1", "5"],
			["o2", "2"],
		]);

		expect(
			toVehicleQueries(list, calls).map(({ canRequery, requerying }) => ({
				canRequery,
				requerying,
			})),
		).toEqual([
			{ canRequery: true, requerying: false },
			{ canRequery: false, requerying: true },
		]);
	});

	it("lê o call.status do pedido no detalhe", () => {
		const detail = toOrderDetail(
			orderDetailSchema.parse({
				id: "o1",
				status: "completed_partial",
				call: { id: "c1", status: 2 },
			}),
		);

		expect(detail).toMatchObject({ canRequery: false, requerying: true });
	});
});

describe("formatDateTime", () => {
	it("aceita data já formatada pelo backend e data ISO, sem segundos", () => {
		expect(formatDateTime("23/11/2026 às 06:00:59")).toBe("23/11/2026 · 06:00");
		expect(formatDateTime("2026-11-19T12:17:00Z")).toBe("19/11/2026 · 09:17");
		expect(formatDateTime("2026-11-19T12:17:00Z", "às")).toBe(
			"19/11/2026 às 09:17",
		);
	});
});

describe("toOrderDetail", () => {
	const order = orderDetailSchema.parse({
		id: "o1",
		number: 1042,
		status: "awaiting_payment",
		status_label: "Aguardando pagamento",
		plate: "abc1d23",
		product: { name: "Checkauto Plus" },
		amount: "69.90",
		created_at: "2026-11-23T09:00:00Z",
		expires_at: "2026-11-23T10:00:00Z",
		query_code: null,
		call: null,
		events: [
			{
				type: "order_created",
				group: "order",
				label: "Pedido criado",
				created_at: "2026-11-23T09:00:00Z",
			},
			{
				type: "payment_failed",
				group: "payment",
				label: "Pagamento recusado",
				created_at: "2026-11-23T09:05:00Z",
				data: { reason: "divergence" },
			},
			{
				type: "payment_paid",
				group: "payment",
				label: "Pagamento confirmado",
				created_at: "2026-11-23T09:06:00Z",
				data: { method: "card", brand: "Visa", last4: "4242" },
			},
		],
	});

	it("monta pagamento, prazo, cancelamento e histórico", () => {
		const detail = toOrderDetail(order);

		expect(detail).toMatchObject({
			number: "#1042",
			canCancel: true,
			expiresAt: "23/11/2026 às 07:00",
			payment: { method: "card", brand: "Visa", last4: "4242" },
		});
		expect(detail.events).toEqual([
			{
				id: "payment_paid-2",
				label: "Pagamento confirmado",
				group: "Pagamento",
				date: "23/11/2026 às 06:06",
				note: "",
				tone: "success",
			},
			{
				id: "payment_failed-1",
				label: "Pagamento recusado",
				group: "Pagamento",
				date: "23/11/2026 às 06:05",
				note: "Valor cobrado não confere com o pedido",
				tone: "danger",
			},
			{
				id: "order_created-0",
				label: "Pedido criado",
				group: "Pedido",
				date: "23/11/2026 às 06:00",
				note: "",
				tone: "neutral",
			},
		]);
	});

	it("sem pagamento e fora do prazo de cancelamento", () => {
		const detail = toOrderDetail(
			orderDetailSchema.parse({ id: "o2", status: "completed", events: [] }),
		);

		expect(detail).toMatchObject({
			canCancel: false,
			expiresAt: "",
			payment: null,
			events: [],
		});
	});
});

describe("pagamento por Pix", () => {
	it("reconhece o Pix e deixa a bandeira com inicial maiúscula", () => {
		const pix = toOrderDetail(
			orderDetailSchema.parse({
				id: "o3",
				status: "paid",
				events: [
					{ type: "payment_paid", group: "payment", data: { method: "pix" } },
				],
			}),
		);
		const card = toOrderDetail(
			orderDetailSchema.parse({
				id: "o4",
				status: "paid",
				events: [
					{
						type: "payment_paid",
						data: { method: "card", brand: "visa", last4: "4242" },
					},
				],
			}),
		);

		expect(pix.payment).toEqual({ method: "pix", brand: "", last4: "" });
		expect(card.payment).toEqual({
			method: "card",
			brand: "Visa",
			last4: "4242",
		});
	});
});

describe("cor dos eventos", () => {
	it("usa a situação gerada pelo evento quando o tipo não é conhecido", () => {
		const detail = toOrderDetail(
			orderDetailSchema.parse({
				id: "o5",
				status: "completed",
				events: [
					{ type: "call_failed", status_after: "failed" },
					{ type: "call_done", status_after: "completed" },
					{ type: "call_partial", status_after: "completed_partial" },
					{ type: "qualquer" },
				],
			}),
		);

		expect(detail.events.map((event) => event.tone)).toEqual([
			"neutral",
			"warning",
			"success",
			"danger",
		]);
	});
});

describe("compactStatusLabel", () => {
	it("encurta as situações conhecidas e mantém as curtas", () => {
		expect(
			compactStatusLabel(
				"completed_partial",
				"Concluído com informações parciais",
			),
		).toBe("Parcial");
		expect(compactStatusLabel("awaiting_payment", "Aguardando pagamento")).toBe(
			"Aguardando",
		);
		expect(compactStatusLabel("completed", "Concluído")).toBe("Concluído");
		expect(compactStatusLabel("unknown", "Situação nova do backend")).toBe(
			"Situação nova do backend",
		);
	});
});
