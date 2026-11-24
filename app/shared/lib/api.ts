import axios, { isAxiosError } from "axios";

type ErrorBody = {
	detail?: unknown;
	code?: unknown;
};

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

export function toApiError(error: unknown): ApiError {
	if (error instanceof ApiError) return error;

	if (!isAxiosError<ErrorBody>(error) || !error.response) {
		return new ApiError(networkErrorMessage, null);
	}

	const { status, data } = error.response;
	const fallback =
		status >= 500
			? serverErrorMessage
			: (messagesByStatus[status] ?? "Algo deu errado. Tente de novo.");

	return new ApiError(
		text(data?.detail) ?? fallback,
		status,
		text(data?.code),
		data,
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

api.interceptors.response.use(undefined, (error) =>
	Promise.reject(toApiError(error)),
);
