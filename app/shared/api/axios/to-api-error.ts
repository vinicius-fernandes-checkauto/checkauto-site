import { isAxiosError } from "axios";

import { ApiError, codeFromStatus } from "~/shared/api/api-error";

function detailMessage(data: unknown) {
	if (data && typeof data === "object" && "detail" in data) {
		const { detail } = data;
		if (typeof detail === "string" && detail.trim()) return detail;
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
		message: detailMessage(data),
		details: data,
		cause: error,
	});
}
