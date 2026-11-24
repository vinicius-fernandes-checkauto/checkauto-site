import { isAxiosError } from "axios";

import { ApiError, codeFromStatus } from "~/shared/api/api-error";

function stringField(data: unknown, key: "detail" | "code") {
	if (data && typeof data === "object" && key in data) {
		const value = (data as Record<string, unknown>)[key];
		if (typeof value === "string" && value.trim()) return value;
	}
	return undefined;
}

export function toApiError(error: unknown): ApiError {
	if (error instanceof ApiError) return error;

	if (!isAxiosError(error)) {
		return new ApiError({ code: "UNKNOWN", cause: error });
	}

	if (error.code === "ERR_CANCELED") {
		return new ApiError({ code: "CANCELED", cause: error });
	}

	if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
		return new ApiError({ code: "TIMEOUT", cause: error });
	}

	if (!error.response) {
		return new ApiError({ code: "NETWORK_ERROR", cause: error });
	}

	const { status, data } = error.response;

	return new ApiError({
		code: codeFromStatus(status),
		status,
		reason: stringField(data, "code"),
		message: stringField(data, "detail"),
		details: data,
		cause: error,
	});
}
