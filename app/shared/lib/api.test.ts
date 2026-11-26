import {
	AxiosError,
	AxiosHeaders,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError, api, fieldErrors, toApiError } from "./api";
import { clearSession, getSession, setSession } from "./session";

function httpError(status: number, data: unknown) {
	const config = { headers: new AxiosHeaders() };
	return new AxiosError("falhou", "ERR_BAD_RESPONSE", config, null, {
		status,
		statusText: "",
		headers: {},
		config,
		data,
	});
}

describe("toApiError", () => {
	it("usa o detail e o code que o backend manda", () => {
		const error = toApiError(
			httpError(401, {
				detail: "Complete o reCAPTCHA para continuar.",
				code: "recaptcha_fallback_required",
			}),
		);
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(401);
		expect(error.message).toBe("Complete o reCAPTCHA para continuar.");
		expect(error.code).toBe("recaptcha_fallback_required");
	});

	it("usa mensagem padrão por status e guarda os erros de campo", () => {
		const data = { email: ["Informe um e-mail válido."] };
		const error = toApiError(httpError(400, data));
		expect(error.message).toBe("Confira os dados informados.");
		expect(error.data).toEqual(data);
	});

	it("trata servidor fora do ar e erros 5xx", () => {
		expect(toApiError(new AxiosError("Network Error")).status).toBeNull();
		expect(toApiError(httpError(502, null)).message).toBe(
			"Tivemos um problema no servidor. Tente de novo em instantes.",
		);
	});
});

type Reply = { status: number; data: unknown };

function jwt(exp: number) {
	const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
	return `header.${payload}.signature`;
}

function useServer(handler: (config: InternalAxiosRequestConfig) => Reply) {
	const calls: InternalAxiosRequestConfig[] = [];
	api.defaults.adapter = async (config) => {
		calls.push(config);
		const { status, data } = handler(config);
		const response: AxiosResponse = {
			status,
			statusText: "",
			headers: {},
			config,
			data,
		};
		if (status >= 400) {
			throw new AxiosError(
				"falhou",
				"ERR_BAD_RESPONSE",
				config,
				null,
				response,
			);
		}
		return response;
	};
	return calls;
}

const replace = vi.fn();

function cookieDocument() {
	const values = new Map<string, string>();

	return Object.defineProperty({}, "cookie", {
		get: () =>
			Array.from(values, ([name, value]) => `${name}=${value}`).join("; "),
		set: (cookie: string) => {
			const [pair, ...attributes] = cookie.split("; ");
			const separator = pair.indexOf("=");
			const name = pair.slice(0, separator);
			const value = pair.slice(separator + 1);
			if (attributes.includes("Max-Age=0")) values.delete(name);
			else values.set(name, value);
		},
	}) as Document;
}

beforeEach(() => {
	vi.stubGlobal("window", {
		location: { pathname: "/conta/consultas", search: "", replace },
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	});
	vi.stubGlobal("document", cookieDocument());
	setSession({
		user: {
			id: "1",
			name: "Cliente",
			email: "c@exemplo.com",
			profile: "4",
			authProvider: "credentials",
		},
		accessToken: "velho",
		refreshToken: jwt(Math.floor((Date.now() + 60_000) / 1000)),
		expires: Date.now() + 60_000,
	});
});

afterEach(() => {
	clearSession();
	replace.mockReset();
	vi.unstubAllGlobals();
});

describe("api com sessão", () => {
	it("manda o token e renova uma vez quando ele vence", async () => {
		const calls = useServer((config) => {
			if (config.url === "/token/refresh/") {
				return { status: 200, data: { access: "novo" } };
			}
			const authorized = config.headers.Authorization === "Bearer novo";
			return authorized
				? { status: 200, data: { ok: true } }
				: { status: 401, data: { detail: "Token inválido" } };
		});

		const [first, second] = await Promise.all([
			api.get("/order/list/"),
			api.get("/wallet/movements/"),
		]);

		expect(first.data).toEqual({ ok: true });
		expect(second.data).toEqual({ ok: true });
		expect(calls.filter((c) => c.url === "/token/refresh/")).toHaveLength(1);
		expect(
			calls.find((c) => c.url === "/token/refresh/")?.headers.Authorization,
		).toBeUndefined();
		expect(getSession()?.accessToken).toBe("novo");
	});

	it("encerra a sessão e manda para o login quando o refresh falha", async () => {
		useServer(() => ({ status: 401, data: { detail: "Token inválido" } }));

		await expect(api.get("/order/list/")).rejects.toBeInstanceOf(ApiError);
		expect(getSession()).toBeNull();
		expect(replace).toHaveBeenCalledWith("/entrar");
	});

	it("não anexa sessão às chamadas públicas", async () => {
		const calls = useServer(() => ({ status: 201, data: {} }));

		await api.post("/signup/", {});

		expect(calls[0].headers.Authorization).toBeUndefined();
	});
});

describe("fieldErrors", () => {
	it("pega a primeira mensagem de cada campo do Django", () => {
		expect(
			fieldErrors({
				email: ["Já existe um usuário com este e-mail.", "Outro erro."],
				accept_terms: "Aceite os termos.",
				detail: "Confira os dados informados.",
			}),
		).toEqual({
			email: "Já existe um usuário com este e-mail.",
			accept_terms: "Aceite os termos.",
		});
		expect(fieldErrors(null)).toEqual({});
	});
});

describe("envelope { user, content }", () => {
	it("lê detail e code de dentro do content", () => {
		const error = toApiError(
			httpError(400, {
				user: null,
				content: {
					detail: "Complete o desafio.",
					code: "recaptcha_fallback_required",
				},
			}),
		);
		expect(error.message).toBe("Complete o desafio.");
		expect(error.code).toBe("recaptcha_fallback_required");
	});

	it("lê message e erros de campo do content", () => {
		const error = toApiError(
			httpError(400, {
				content: { message: "Conta do Google.", code: "google_account" },
			}),
		);
		expect(error.message).toBe("Conta do Google.");
		expect(
			fieldErrors({ user: null, content: { cpf: ["CPF já cadastrado."] } }),
		).toEqual({ cpf: "CPF já cadastrado." });
	});
});
