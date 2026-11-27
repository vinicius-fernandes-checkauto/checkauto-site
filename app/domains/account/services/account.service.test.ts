import { beforeEach, describe, expect, it, vi } from "vitest";

import * as accountApi from "~/domains/account/account.api";
import { userDetailSchema } from "~/domains/account/utils/account.schema";
import { getSession } from "~/shared/lib/session";

import {
	cancelOrder,
	getOrder,
	getProfile,
	getQueries,
	getStatementUrl,
	getWallet,
	requeryQuery,
	saveProfile,
	toProfile,
} from "./account.service";

vi.mock("~/domains/account/account.api", () => ({
	getUser: vi.fn(),
	updateUser: vi.fn(),
	getOrder: vi.fn(),
	getOrderStatement: vi.fn(),
	listOrders: vi.fn(),
	listWalletMovements: vi.fn(),
	requeryCall: vi.fn(),
	cancelOrder: vi.fn(),
}));

vi.mock("~/shared/lib/session", () => ({
	getSession: vi.fn(),
	setSession: vi.fn(),
}));

const session = {
	user: {
		id: "u1",
		name: "Cliente Teste",
		email: "cliente@exemplo.com",
		profile: "4",
		authProvider: "credentials" as const,
	},
	accessToken: "access",
	refreshToken: "refresh",
	expires: Date.now() + 3_600_000,
};

const apiUser = userDetailSchema.parse({
	id: "u1",
	first_name: "Cliente",
	last_name: "Teste",
	email: "cliente@exemplo.com",
	cpf: "00000000000",
	phone: "11900000000",
	cep: "01000000",
	street: "Rua de Teste",
	number_address: "100",
	complement: null,
	district: "Centro",
	city: "São Paulo",
	uf: "sp",
	company: null,
	marketing_consent: true,
	terms_accepted_version: "2026-11",
	terms_accepted_at: "2026-11-26T12:00:00Z",
});

const values = {
	phone: "(11) 91111-1111",
	zip: "02000-000",
	street: "Rua Nova",
	number: "200",
	complement: "",
	district: "Bairro",
	city: "São Paulo",
	state: "SP" as const,
	marketing: false,
};

beforeEach(() => {
	vi.mocked(getSession).mockReturnValue(session);
	vi.mocked(accountApi.getUser).mockReset().mockResolvedValue(apiUser);
	vi.mocked(accountApi.updateUser).mockReset().mockResolvedValue(apiUser);
});

describe("toProfile", () => {
	it("converte a resposta da API, com nulos virando texto vazio", () => {
		expect(toProfile(apiUser)).toMatchObject({
			id: "u1",
			firstName: "Cliente",
			complement: "",
			state: "SP",
			company: null,
			marketingConsent: true,
			termsAcceptedVersion: "2026-11",
		});
	});

	it("traz os dados da empresa quando há CNPJ", () => {
		const company = userDetailSchema.parse({
			...apiUser,
			company: {
				corporate_name: "Empresa de Teste Ltda",
				fantasy_name: "Empresa de Teste",
				cnpj: "00000000000000",
				state_registration: null,
			},
		});

		expect(toProfile(company).zip).toBe("01000000");

		expect(toProfile(company).company).toEqual({
			corporateName: "Empresa de Teste Ltda",
			fantasyName: "Empresa de Teste",
			cnpj: "00000000000000",
			stateRegistration: "",
		});
	});
});

describe("toProfile com endereço na empresa", () => {
	it("usa o endereço da empresa quando o do usuário vem vazio", () => {
		const company = userDetailSchema.parse({
			...apiUser,
			cep: null,
			street: null,
			uf: null,
			company: {
				corporate_name: "Empresa de Teste Ltda",
				fantasy_name: "Empresa de Teste",
				cnpj: "00000000000000",
				cep: "02000000",
				street: "Rua da Empresa",
				uf: "rj",
			},
		});

		expect(toProfile(company)).toMatchObject({
			zip: "02000000",
			street: "Rua da Empresa",
			state: "RJ",
		});
	});
});

describe("getProfile", () => {
	it("busca o usuário da sessão em GET /user/retrieve/{id}/", async () => {
		await getProfile();

		expect(accountApi.getUser).toHaveBeenCalledWith("u1");
	});
});

describe("saveProfile", () => {
	it("envia ao PUT /user/update/{id}/ só telefone, endereço e marketing", async () => {
		await saveProfile(toProfile(apiUser), values);

		expect(accountApi.updateUser).toHaveBeenCalledWith("u1", {
			phone: "11911111111",
			cep: "02000000",
			street: "Rua Nova",
			number_address: "200",
			complement: "",
			district: "Bairro",
			city: "São Paulo",
			uf: "SP",
			marketing_consent: false,
		});
	});
});

function httpError(status: number, data: unknown = {}) {
	return Object.assign(new Error("http"), {
		isAxiosError: true,
		response: { status, data },
	});
}

describe("getStatementUrl", () => {
	it("chama GET /order/extrato/ até o PDF ficar pronto", async () => {
		vi.useFakeTimers();
		vi.mocked(accountApi.getOrderStatement)
			.mockReset()
			.mockResolvedValueOnce({ pdf_status: "pending" })
			.mockResolvedValueOnce({ pdf_status: "processing" })
			.mockResolvedValueOnce({
				pdf_status: "ready",
				download_url: "https://exemplo.com/extrato.pdf",
			});

		const url = getStatementUrl("o1");
		await vi.advanceTimersByTimeAsync(6_000);

		await expect(url).resolves.toBe("https://exemplo.com/extrato.pdf");
		expect(accountApi.getOrderStatement).toHaveBeenCalledTimes(3);
		expect(accountApi.getOrderStatement).toHaveBeenCalledWith("o1");
		vi.useRealTimers();
	});

	it("mostra a mensagem do backend quando a consulta não terminou (409)", async () => {
		vi.mocked(accountApi.getOrderStatement).mockRejectedValue(
			httpError(409, {
				user: null,
				content: "O extrato só fica disponível depois da consulta concluída.",
			}),
		);

		await expect(getStatementUrl("o1")).rejects.toThrow(
			"O extrato só fica disponível depois da consulta concluída.",
		);
	});

	it("explica pedido de outra pessoa e pedido inexistente", async () => {
		vi.mocked(accountApi.getOrderStatement).mockRejectedValueOnce(
			httpError(403),
		);
		await expect(getStatementUrl("o1")).rejects.toThrow(
			"Você não tem acesso a esse pedido.",
		);

		vi.mocked(accountApi.getOrderStatement).mockRejectedValueOnce(
			httpError(404),
		);
		await expect(getStatementUrl("o1")).rejects.toThrow(
			"Pedido não encontrado.",
		);
	});
});

describe("getQueries", () => {
	const list = {
		count: 3,
		results: [
			{ id: "o1", status: "completed" },
			{ id: "o2", status: "completed_partial" },
			{ id: "o3", status: "completed_partial" },
		],
	};

	it("lê o call.status só dos pedidos parciais", async () => {
		vi.mocked(accountApi.listOrders).mockResolvedValue(list);
		vi.mocked(accountApi.getOrder)
			.mockReset()
			.mockImplementation(async (id) => ({
				id,
				call: { id: `c-${id}`, status: id === "o2" ? "5" : "2" },
				events: [],
			}));

		const page = await getQueries({
			busca: "",
			situacao: "",
			de: "",
			ate: "",
			pagina: 1,
			itens: 10,
		});

		expect(page.total).toBe(3);
		expect(
			page.queries.map(({ canRequery, requerying }) => [
				canRequery,
				requerying,
			]),
		).toEqual([
			[false, false],
			[true, false],
			[false, true],
		]);
		expect(accountApi.getOrder).toHaveBeenCalledTimes(2);
	});
});

describe("requeryQuery", () => {
	it("chama POST /call/requery/ com o id da consulta do pedido", async () => {
		vi.mocked(accountApi.getOrder).mockResolvedValue({
			id: "o1",
			call: { id: "c1", status: "5" },
			events: [],
		});
		vi.mocked(accountApi.requeryCall).mockReset().mockResolvedValue();

		await requeryQuery("o1");

		expect(accountApi.requeryCall).toHaveBeenCalledWith("c1");
	});

	it("mostra a mensagem do backend em 409 e 400", async () => {
		vi.mocked(accountApi.getOrder).mockResolvedValue({
			id: "o1",
			call: { id: "c1", status: "5" },
			events: [],
		});
		vi.mocked(accountApi.requeryCall)
			.mockRejectedValueOnce(
				httpError(409, {
					user: null,
					content: "Consulta já está em execução.",
				}),
			)
			.mockRejectedValueOnce(
				httpError(400, {
					user: null,
					content: "Nenhum insumo indisponível elegível pra reconsulta.",
				}),
			);

		await expect(requeryQuery("o1")).rejects.toThrow(
			"Consulta já está em execução.",
		);
		await expect(requeryQuery("o1")).rejects.toThrow(
			"Nenhum insumo indisponível elegível pra reconsulta.",
		);
	});

	it("explica quando o pedido não é do cliente (403)", async () => {
		vi.mocked(accountApi.getOrder).mockRejectedValue(httpError(403));

		await expect(requeryQuery("o1")).rejects.toThrow(
			"Você não tem acesso a esse pedido.",
		);
	});
});

describe("getOrder", () => {
	const order = {
		id: "o1",
		number: "1042",
		status: "completed_partial",
		status_label: "Parcial",
		plate: "abc1d23",
		product: { name: "Checkauto Plus" },
		amount: "69.90",
		created_at: "2026-11-23T09:00:00Z",
		query_code: "12320812",
		call: { id: "c1", status: "5" },
		events: [],
	};

	it("lê o pedido e libera a reconsulta pelo call.status", async () => {
		vi.mocked(accountApi.getOrder).mockResolvedValue(order);

		expect(await getOrder("o1")).toMatchObject({
			id: "o1",
			number: "#1042",
			code: "12320812",
			plate: "ABC1D23",
			plan: "Checkauto Plus",
			amount: 69.9,
			date: "23/11/2026 às 06:00",
			status: "completed_partial",
			statusLabel: "Parcial",
			canRequery: true,
			requerying: false,
		});
	});

	it("explica pedido de outra pessoa e pedido inexistente", async () => {
		vi.mocked(accountApi.getOrder).mockRejectedValueOnce(httpError(403));
		await expect(getOrder("o1")).rejects.toThrow(
			"Você não tem acesso a esse pedido.",
		);

		vi.mocked(accountApi.getOrder).mockRejectedValueOnce(httpError(404));
		await expect(getOrder("o1")).rejects.toThrow("Pedido não encontrado.");
	});
});

describe("cancelOrder", () => {
	it("explica quando o pedido não pode mais ser cancelado (409)", async () => {
		vi.mocked(accountApi.cancelOrder).mockRejectedValue(httpError(409));

		await expect(cancelOrder("o1")).rejects.toThrow(
			"Esse pedido não pode mais ser cancelado.",
		);
	});
});

describe("getWallet", () => {
	const filters = { de: "", ate: "", pagina: 1, itens: 10 };

	it("lista os movimentos de GET /wallet/movements/ com o saldo do summary", async () => {
		vi.mocked(accountApi.listWalletMovements).mockResolvedValue({
			count: 1,
			results: [
				{
					id: "m1",
					type: "credit_order",
					amount: "69.90",
					balance_after: "69.90",
				},
			],
			summary: { balance: "69.90" },
		});
		vi.mocked(accountApi.getUser).mockClear();

		const page = await getWallet(filters);

		expect(page.total).toBe(1);
		expect(page.balance).toBe(69.9);
		expect(page.movements[0].label).toBe("Crédito por pedido");
		expect(accountApi.listWalletMovements).toHaveBeenCalledWith(
			expect.objectContaining({ page: 1, page_size: 10 }),
		);
		expect(accountApi.getUser).not.toHaveBeenCalled();
	});

	it("sem summary, usa o saldo do usuário", async () => {
		vi.mocked(accountApi.listWalletMovements).mockResolvedValue({
			count: 0,
			results: [],
		});
		vi.mocked(accountApi.getUser).mockResolvedValue({
			...apiUser,
			balance: "12.50",
		});

		expect((await getWallet(filters)).balance).toBe(12.5);
	});

	it("explica o 403", async () => {
		vi.mocked(accountApi.listWalletMovements).mockRejectedValue(httpError(403));

		await expect(getWallet(filters)).rejects.toThrow(
			"Você não tem acesso ao histórico de saldo.",
		);
	});
});
