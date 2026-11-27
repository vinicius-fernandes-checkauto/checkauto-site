import axios, { isAxiosError } from "axios";

import {
	clearSession,
	getSession,
	type Session,
	SIGN_IN_PATH,
	setSession,
	tokenExpiresAt,
} from "~/shared/lib/session";

declare module "axios" {
	interface InternalAxiosRequestConfig {
		_retry?: boolean;
	}
}

const messagesByStatus: Record<number, string> = {
	400: "Confira os dados informados.",
	401: "Sua sessão expirou. Entre novamente.",
	403: "Você não tem permissão para fazer isso.",
	404: "Não encontramos o que você procurou.",
	429: "Muitas tentativas. Aguarde um instante e tente de novo.",
};

const serverErrorMessage =
	"Tivemos um problema no servidor. Tente de novo em instantes.";
const networkErrorMessage =
	"Não foi possível conectar. Verifique sua internet.";

export class ApiError extends Error {
	constructor(
		message: string,
		readonly status: number | null,
		readonly code: string | null = null,
		readonly data: unknown = null,
	) {
		super(message);
		this.name = "ApiError";
	}
}

function text(value: unknown) {
	return typeof value === "string" && value.trim() ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function unwrapContent(data: unknown): unknown {
	return isRecord(data) && "content" in data ? data.content : data;
}

const isPlainMessage = (value: string) =>
	value.length <= 300 && !value.trimStart().startsWith("<");

export function toApiError(error: unknown): ApiError {
	if (error instanceof ApiError) return error;

	if (!isAxiosError(error) || !error.response) {
		return new ApiError(networkErrorMessage, null);
	}

	const { status } = error.response;
	const body = unwrapContent(error.response.data);
	const fields = isRecord(body) ? body : {};
	const fallback =
		status >= 500
			? serverErrorMessage
			: (messagesByStatus[status] ?? "Algo deu errado. Tente de novo.");

	const message =
		status < 500 && typeof body === "string" && isPlainMessage(body)
			? text(body)
			: null;

	return new ApiError(
		message ?? text(fields.detail) ?? text(fields.message) ?? fallback,
		status,
		text(fields.code),
		body,
	);
}

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 15_000,
	headers: {
		Accept: "application/json",
		"ngrok-skip-browser-warning": "true",
	},
});

const publicRoutes = [
	"token/",
	"signup/",
	"user/forgot-password/",
	"user/login/google/",
	"user/signup/google/",
	"user/password/set/",
	"user/terms/",
];

function isPublicRoute(url = "") {
	const path = url.replace(/^\//, "");
	return publicRoutes.some((route) => path.startsWith(route));
}

export function fieldErrors(data: unknown): Record<string, string> {
	const body = unwrapContent(data);
	if (!isRecord(body)) return {};

	const ignored = new Set(["detail", "code", "message"]);
	const errors: Record<string, string> = {};
	for (const [field, value] of Object.entries(body)) {
		const message = Array.isArray(value) ? value[0] : value;
		if (typeof message === "string" && !ignored.has(field)) {
			errors[field] = message;
		}
	}
	return errors;
}

let refreshing: Promise<string> | null = null;

async function refreshSession({ refreshToken, ...session }: Session) {
	const { data } = await api.post<{ access: string; refresh?: string }>(
		"/token/refresh/",
		{ refresh: refreshToken },
	);

	setSession({
		...session,
		accessToken: data.access,
		refreshToken: data.refresh ?? refreshToken,
		expires: data.refresh ? tokenExpiresAt(data.refresh) : session.expires,
	});

	return data.access;
}

function expireSession() {
	clearSession();
	window.location.replace(SIGN_IN_PATH);
}

api.interceptors.request.use((config) => {
	const session = getSession();
	if (session && !isPublicRoute(config.url)) {
		config.headers.Authorization = `Bearer ${session.accessToken}`;
	}
	return config;
});

api.interceptors.response.use(undefined, async (error) => {
	const config = isAxiosError(error) ? error.config : undefined;
	const session = getSession();

	if (
		error.response?.status !== 401 ||
		!config ||
		config._retry ||
		isPublicRoute(config.url) ||
		!session
	) {
		throw toApiError(error);
	}

	config._retry = true;

	try {
		refreshing ??= refreshSession(session).finally(() => {
			refreshing = null;
		});
		config.headers.Authorization = `Bearer ${await refreshing}`;
	} catch {
		expireSession();
		throw toApiError(error);
	}

	return api(config);
});
