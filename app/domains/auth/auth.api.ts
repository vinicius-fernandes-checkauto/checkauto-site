import type {
	ChangePasswordBody,
	CurrentTerms,
	GoogleSignUpBody,
	LoginBody,
	LoginResponse,
	SignUpBody,
} from "~/domains/auth/types/auth.types";
import {
	currentTermsSchema,
	loginResponseSchema,
} from "~/domains/auth/utils/auth.schema";
import { ApiError, api, unwrapContent } from "~/shared/lib/api";

export function parseLoginResponse(data: unknown): LoginResponse {
	const parsed = loginResponseSchema.safeParse(data);
	if (parsed.success) return parsed.data;

	throw new ApiError(
		"Não foi possível iniciar sua sessão. Tente novamente.",
		null,
	);
}

export function parseCurrentTerms(data: unknown): CurrentTerms {
	const direct = currentTermsSchema.safeParse(data);
	if (direct.success) return direct.data;

	const content =
		data && typeof data === "object" && "content" in data
			? data.content
			: undefined;
	return currentTermsSchema.parse(content);
}

export async function login(body: LoginBody) {
	const { data } = await api.post<unknown>("/token/", body);
	return parseLoginResponse(data);
}

export async function signUp(body: SignUpBody) {
	const { data } = await api.post<unknown>("/signup/", body);
	return data;
}

export async function getCurrentTerms() {
	const { data } = await api.get<unknown>("/user/terms/current/");
	return parseCurrentTerms(data);
}

export async function forgotPassword(email: string) {
	await api.post("/user/forgot-password/", { email });
}

export async function changePassword(body: ChangePasswordBody) {
	await api.post("/user/change-password/", body);
}

export async function loginWithGoogle(idToken: string) {
	const { data } = await api.post<unknown>("/user/login/google/", {
		id_token: idToken,
	});
	return parseLoginResponse(data);
}

export async function signUpWithGoogle(body: GoogleSignUpBody) {
	const { data } = await api.post<unknown>("/user/signup/google/", body);
	return parseLoginResponse(unwrapContent(data));
}
