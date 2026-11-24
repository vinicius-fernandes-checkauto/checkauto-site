import type { AxiosInstance, AxiosRequestConfig } from "axios";

import type { HttpClient, HttpRequestConfig } from "~/shared/api/http-client";

import { toApiError } from "./to-api-error";

function toAxiosConfig(config?: HttpRequestConfig): AxiosRequestConfig {
	return {
		params: config?.params,
		headers: config?.headers,
		signal: config?.signal,
	};
}

export class AxiosHttpClient implements HttpClient {
	constructor(private readonly instance: AxiosInstance) {}

	private async send<T>(request: Promise<{ data: T }>) {
		try {
			const response = await request;
			return response.data;
		} catch (error) {
			throw toApiError(error);
		}
	}

	get<T>(url: string, config?: HttpRequestConfig) {
		return this.send(this.instance.get<T>(url, toAxiosConfig(config)));
	}

	post<T>(url: string, body?: unknown, config?: HttpRequestConfig) {
		return this.send(this.instance.post<T>(url, body, toAxiosConfig(config)));
	}

	put<T>(url: string, body?: unknown, config?: HttpRequestConfig) {
		return this.send(this.instance.put<T>(url, body, toAxiosConfig(config)));
	}

	patch<T>(url: string, body?: unknown, config?: HttpRequestConfig) {
		return this.send(this.instance.patch<T>(url, body, toAxiosConfig(config)));
	}

	delete<T>(url: string, config?: HttpRequestConfig) {
		return this.send(this.instance.delete<T>(url, toAxiosConfig(config)));
	}
}
