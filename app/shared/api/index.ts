import { readApiEnv } from "~/shared/lib/env";

import { createHttpClient } from "./create-http-client";
import type { HttpClient } from "./http-client";

export {
	ApiError,
	type ApiErrorCode,
	defaultErrorMessages,
	isApiError,
} from "./api-error";
export type { HttpClient, HttpQuery, HttpRequestConfig } from "./http-client";

let client: HttpClient | undefined;

export function getHttpClient(): HttpClient {
	if (typeof window === "undefined") {
		throw new Error(
			"A API só pode ser chamada no navegador, nunca durante o prerender.",
		);
	}

	client ??= createHttpClient(readApiEnv());
	return client;
}
