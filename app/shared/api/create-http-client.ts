import axios from "axios";

import type { HttpClient } from "~/shared/api/http-client";
import type { ApiEnv } from "~/shared/lib/env";

import { AxiosHttpClient } from "./axios/axios-http-client";

function isNgrok(baseURL: string) {
	return /\.ngrok(-free)?\.(app|dev|io)$/.test(new URL(baseURL).hostname);
}

export function createHttpClient({ baseURL, timeout }: ApiEnv): HttpClient {
	const instance = axios.create({
		baseURL,
		timeout,
		headers: {
			Accept: "application/json",
			...(isNgrok(baseURL) && { "ngrok-skip-browser-warning": "true" }),
		},
	});

	return new AxiosHttpClient(instance);
}
