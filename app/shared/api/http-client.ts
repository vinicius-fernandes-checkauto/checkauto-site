export type HttpQuery = Record<
	string,
	string | number | boolean | null | undefined
>;

export type HttpRequestConfig = {
	params?: HttpQuery;
	headers?: Record<string, string>;
	signal?: AbortSignal;
};

export interface HttpClient {
	get<T>(url: string, config?: HttpRequestConfig): Promise<T>;
	post<T>(url: string, body?: unknown, config?: HttpRequestConfig): Promise<T>;
	put<T>(url: string, body?: unknown, config?: HttpRequestConfig): Promise<T>;
	patch<T>(url: string, body?: unknown, config?: HttpRequestConfig): Promise<T>;
	delete<T>(url: string, config?: HttpRequestConfig): Promise<T>;
}
