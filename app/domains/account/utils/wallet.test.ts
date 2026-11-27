import { describe, expect, it } from "vitest";

import { walletMovementListSchema } from "~/domains/account/utils/account.schema";

import {
	formatSignedAmount,
	toWalletMovement,
	toWalletPage,
	toWalletParams,
} from "./wallet";

const today = new Date(2026, 10, 26);

describe("toWalletParams", () => {
	it("usa o período da URL e a página", () => {
		expect(
			toWalletParams(
				{ de: "2026-11-01", ate: "2026-11-20", pagina: 2, itens: 20 },
				today,
			),
		).toEqual({
			date_from: "2026-11-01",
			date_to: "2026-11-20",
			page: 2,
			page_size: 20,
		});
	});

	it("sem período, busca os últimos 12 meses e corrige página e itens", () => {
		expect(
			toWalletParams({ de: "", ate: "", pagina: 0, itens: 7 }, today),
		).toEqual({
			date_from: "2025-11-26",
			date_to: "2026-11-26",
			page: 1,
			page_size: 10,
		});
	});
});

describe("toWalletMovement", () => {
	it("converte crédito, débito e tipo desconhecido", () => {
		const list = walletMovementListSchema.parse({
			count: 3,
			results: [
				{
					id: "m1",
					type: "credit_order",
					origin: "automatic",
					amount: "69.90",
					balance_after: "69.90",
					reason: "Pedido #100042",
					created_at: "2026-11-23T09:00:00Z",
				},
				{
					id: "m2",
					type: "debit_call",
					origin: "automatic",
					amount: "-25.00",
					balance_after: "44.90",
					reason: null,
					created_at: "2026-11-23T09:05:00Z",
				},
				{
					id: "m3",
					type: "tipo_novo",
					origin: "manual",
					amount: "0",
					balance_after: null,
					reason: "",
					created_at: null,
				},
			],
		});

		expect(list.results.map(toWalletMovement)).toEqual([
			{
				id: "m1",
				date: "23/11/2026 · 06:00",
				label: "Crédito por pedido",
				reason: "Pedido #100042",
				amount: 69.9,
				balanceAfter: 69.9,
				direction: "in",
			},
			{
				id: "m2",
				date: "23/11/2026 · 06:05",
				label: "Débito de consulta",
				reason: "",
				amount: -25,
				balanceAfter: 44.9,
				direction: "out",
			},
			{
				id: "m3",
				date: "",
				label: "tipo_novo",
				reason: "Ajuste manual",
				amount: 0,
				balanceAfter: null,
				direction: "none",
			},
		]);
	});
});

describe("toWalletPage", () => {
	it("lê o total e o saldo do summary", () => {
		const page = toWalletPage(
			walletMovementListSchema.parse({
				count: 0,
				results: [],
				summary: { balance: "44.90" },
			}),
		);

		expect(page).toEqual({ movements: [], total: 0, balance: 44.9 });
	});

	it("sem summary, o saldo fica nulo", () => {
		expect(
			toWalletPage(walletMovementListSchema.parse({ count: 0, results: [] }))
				.balance,
		).toBeNull();
	});
});

describe("formatSignedAmount", () => {
	it("mostra o sinal de entrada e saída", () => {
		const plain = (amount: number) =>
			formatSignedAmount(amount).replace(/\s/g, " ");

		expect(plain(69.9)).toBe("+ R$ 69,90");
		expect(plain(-25)).toBe("− R$ 25,00");
		expect(plain(0)).toBe("R$ 0,00");
	});
});
