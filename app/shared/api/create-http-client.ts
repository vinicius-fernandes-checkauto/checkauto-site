import axios, { type AxiosAdapter } from "axios";

import type { HttpClient } from "~/shared/api/http-client";
import type { ApiEnv } from "~/shared/lib/env";

import { type AuthHandlers, attachAuth } from "./axios/auth-interceptors";
import { AxiosHttpClient } from "./axios/axios-http-client";

function isNgrok(baseURL: string) {
	return /\.ngrok(-free)?\.(app|dev|io)$/.test(new URL(baseURL).hostname);
}

type CreateHttpClientOptions = ApiEnv & {
	auth?: AuthHandlers;
	adapter?: AxiosAdapter;
};

export function createHttpClient({
	baseURL,
	timeout,
	auth,
	adapter,
}: CreateHttpClientOptions): HttpClient {
	const instance = axios.create({
		baseURL,
		timeout,
		adapter,
		headers: {
			Accept: "application/json",
			...(isNgrok(baseURL) && { "ngrok-skip-browser-warning": "true" }),
		},
	});

	if (auth) attachAuth(instance, auth);

	return new AxiosHttpClient(instance);
}
