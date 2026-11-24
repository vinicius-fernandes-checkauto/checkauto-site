import {
	currentTermsSchema,
	type LoginCredentials,
	loginResponseSchema,
	refreshedTokensSchema,
} from "~/features/auth/lib/auth-api";
import { getHttpClient, type HttpClient } from "~/shared/api";

export function createAuthService(http: HttpClient) {
	return {
		async login({
			email,
			password,
			recaptchaToken,
			recaptchaTokenV2,
		}: LoginCredentials) {
			const data = await http.post("/token/", {
				username: email,
				password,
				recaptcha_token: recaptchaToken,
				recaptcha_token_v2: recaptchaTokenV2,
			});
			return loginResponseSchema.parse(data);
		},

		async refresh(refreshToken: string) {
			const data = await http.post("/token/refresh/", {
				refresh: refreshToken,
			});
			return refreshedTokensSchema.parse(data);
		},

		async verify(token: string) {
			await http.post("/token/verify/", { token });
		},

		async currentTerms(signal?: AbortSignal) {
			const data = await http.get("/user/terms/current/", { signal });
			return currentTermsSchema.parse(data);
		},
	};
}

export type AuthService = ReturnType<typeof createAuthService>;

export function getAuthService(): AuthService {
	return createAuthService(getHttpClient());
}
