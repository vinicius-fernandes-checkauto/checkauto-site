import { beforeEach, describe, expect, it, vi } from "vitest";

import * as accountApi from "~/domains/account/account.api";
import { userDetailSchema } from "~/domains/account/utils/account.schema";
import { getSession } from "~/shared/lib/session";

import {
	getProfile,
	getStatementUrl,
	saveProfile,
	toProfile,
} from "./account.service";

vi.mock("~/domains/account/account.api", () => ({
	getUser: vi.fn(),
	updateUser: vi.fn(),
	getCall: vi.fn(),
	getReportPdf: vi.fn(),
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

describe("getStatementUrl", () => {
	const call = {
		id: "c1",
		extrato_products: [{ id: "p1", extrato_enabled: true }],
	};

	it("espera o PDF ficar pronto e devolve o endereço", async () => {
		vi.useFakeTimers();
		vi.mocked(accountApi.getCall).mockResolvedValue(call);
		vi.mocked(accountApi.getReportPdf)
			.mockReset()
			.mockResolvedValueOnce({ pdf_status: "pending" })
			.mockResolvedValueOnce({ pdf_status: "processing" })
			.mockResolvedValueOnce({
				pdf_status: "ready",
				download_url: "https://exemplo.com/extrato.pdf",
			});

		const url = getStatementUrl("c1");
		await vi.advanceTimersByTimeAsync(6_000);

		await expect(url).resolves.toBe("https://exemplo.com/extrato.pdf");
		expect(accountApi.getReportPdf).toHaveBeenCalledTimes(3);
		expect(accountApi.getReportPdf).toHaveBeenCalledWith("c1", "p1");
		vi.useRealTimers();
	});

	it("avisa quando a consulta não tem extrato", async () => {
		vi.mocked(accountApi.getCall).mockResolvedValue({
			id: "c1",
			extrato_products: [],
		});

		await expect(getStatementUrl("c1")).rejects.toThrow(
			"Essa consulta não tem extrato disponível.",
		);
	});
});
