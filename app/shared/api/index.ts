import { z } from "zod";

import { readApiEnv } from "~/shared/lib/env";
import { isJwtExpired } from "~/shared/lib/jwt";
import { sessionStore } from "~/shared/lib/session";

import { createHttpClient } from "./create-http-client";
import type { HttpClient } from "./http-client";

export {
	ApiError,
	type ApiErrorCode,
	defaultErrorMessages,
	isApiError,
} from "./api-error";
export { envelope } from "./envelope";
export type { HttpClient, HttpQuery, HttpRequestConfig } from "./http-client";

const refreshResponseSchema = z.object({
	access: z.string().min(1),
	refresh: z.string().min(1).optional(),
});

let client: HttpClient | undefined;

function assertBrowser() {
	if (typeof window === "undefined") {
		throw new Error(
			"A API só pode ser chamada no navegador, nunca durante o prerender.",
		);
	}
}

export function getHttpClient(): HttpClient {
	assertBrowser();
	if (client) return client;

	const env = readApiEnv();
	const refreshClient = createHttpClient(env);

	client = createHttpClient({
		...env,
		auth: {
			getAccessToken: () => sessionStore.get()?.tokens.access ?? null,
			async refreshAccessToken() {
				const refresh = sessionStore.get()?.tokens.refresh;
				if (!refresh || isJwtExpired(refresh)) return null;

				const data = await refreshClient.post("/token/refresh/", { refresh });
				const tokens = refreshResponseSchema.parse(data);
				sessionStore.updateTokens(tokens);
				return tokens.access;
			},
			onSessionExpired: () => sessionStore.clear(),
		},
	});

	return client;
}
