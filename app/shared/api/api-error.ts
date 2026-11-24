export type ApiErrorCode =
	| "NETWORK_ERROR"
	| "TIMEOUT"
	| "CANCELED"
	| "UNAUTHORIZED"
	| "FORBIDDEN"
	| "NOT_FOUND"
	| "VALIDATION"
	| "SERVER_ERROR"
	| "UNKNOWN";

export const defaultErrorMessages: Record<ApiErrorCode, string> = {
	NETWORK_ERROR: "Não foi possível conectar. Verifique sua internet.",
	TIMEOUT: "O servidor demorou para responder. Tente de novo.",
	CANCELED: "A requisição foi cancelada.",
	UNAUTHORIZED: "Sua sessão expirou. Entre novamente.",
	FORBIDDEN: "Você não tem permissão para fazer isso.",
	NOT_FOUND: "Não encontramos o que você procurou.",
	VALIDATION: "Confira os dados informados.",
	SERVER_ERROR: "Tivemos um problema no servidor. Tente de novo em instantes.",
	UNKNOWN: "Algo deu errado. Tente de novo.",
};

export function codeFromStatus(status: number): ApiErrorCode {
	if (status === 401) return "UNAUTHORIZED";
	if (status === 403) return "FORBIDDEN";
	if (status === 404) return "NOT_FOUND";
	if (status === 400 || status === 422) return "VALIDATION";
	if (status >= 500) return "SERVER_ERROR";
	return "UNKNOWN";
}

type ApiErrorOptions = {
	code: ApiErrorCode;
	status?: number;
	reason?: string;
	message?: string;
	details?: unknown;
	cause?: unknown;
};

export class ApiError extends Error {
	readonly code: ApiErrorCode;
	readonly status?: number;
	readonly reason?: string;
	readonly details?: unknown;

	constructor({
		code,
		status,
		reason,
		message,
		details,
		cause,
	}: ApiErrorOptions) {
		super(message ?? defaultErrorMessages[code], { cause });
		this.name = "ApiError";
		this.code = code;
		this.status = status;
		this.reason = reason;
		this.details = details;
	}
}

export function isApiError(error: unknown): error is ApiError {
	return error instanceof ApiError;
}
