import type {
	AxiosError,
	AxiosInstance,
	InternalAxiosRequestConfig,
} from "axios";

export type AuthHandlers = {
	getAccessToken: () => string | null;
	refreshAccessToken: () => Promise<string | null>;
	onSessionExpired: () => void;
};

const PUBLIC_PATHS = [
	"/token/",
	"/token/refresh/",
	"/token/verify/",
	"/user/signup/",
	"/user/forgot-password/",
	"/user/terms/current/",
];

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

function isPublic(url = "") {
	const path = url.split("?")[0];
	return PUBLIC_PATHS.some((publicPath) => path.endsWith(publicPath));
}

export function attachAuth(instance: AxiosInstance, auth: AuthHandlers) {
	let pending: Promise<string | null> | null = null;

	function refreshOnce() {
		pending ??= auth.refreshAccessToken().finally(() => {
			pending = null;
		});
		return pending;
	}

	instance.interceptors.request.use((config) => {
		if (isPublic(config.url) || config.headers.has("Authorization")) {
			return config;
		}
		const token = auth.getAccessToken();
		if (token) config.headers.set("Authorization", `Bearer ${token}`);
		return config;
	});

	instance.interceptors.response.use(undefined, async (error: AxiosError) => {
		const config = error.config as RetriableConfig | undefined;

		if (
			error.response?.status !== 401 ||
			!config ||
			config._retried ||
			isPublic(config.url)
		) {
			throw error;
		}

		config._retried = true;
		const token = await refreshOnce().catch(() => null);

		if (!token) {
			auth.onSessionExpired();
			throw error;
		}

		config.headers.set("Authorization", `Bearer ${token}`);
		return instance(config);
	});
}
