import * as authApi from "~/domains/auth/auth.api";
import {
	type AuthProvider,
	type ProviderInput,
	providers,
} from "~/domains/auth/services/providers";
import type { LoginResponse } from "~/domains/auth/types/auth.types";
import type {
	CompleteProfileFormOutput,
	SignUpFormOutput,
} from "~/domains/auth/utils/auth.schema";
import { loginResponseSchema } from "~/domains/auth/utils/auth.schema";
import { getRecaptchaToken } from "~/domains/auth/utils/recaptcha";
import { ApiError } from "~/shared/lib/api";
import {
	clearSession,
	type PublicSession,
	type Session,
	SIGN_IN_PATH,
	setSession,
	tokenExpiresAt,
} from "~/shared/lib/session";

export const authOptions = {
	providers,
	pages: {
		signIn: SIGN_IN_PATH,
		newUser: "/completar-cadastro",
		home: "/conta",
	},
	callbacks: {
		session(login: LoginResponse): Session {
			const expires = tokenExpiresAt(login.refresh);
			if (expires <= Date.now()) {
				throw new ApiError(
					"Não foi possível validar a sessão recebida. Tente novamente.",
					null,
				);
			}

			return {
				user: {
					id: login.id,
					name: login.name,
					email: login.email,
					profile: login.profile,
					profileComplete: login.profile_complete ?? true,
				},
				accessToken: login.access,
				refreshToken: login.refresh,
				expires,
			};
		},
	},
};

export async function signIn<P extends AuthProvider>(
	provider: P,
	input: ProviderInput<P>,
) {
	const login = await authOptions.providers[provider].authorize(input);
	const session = authOptions.callbacks.session(login);
	setSession(session);
	return session;
}

export function signOut() {
	clearSession();
}

export type SignUpInput = SignUpFormOutput & {
	termsVersion: string;
	recaptchaV2Token?: string;
};

export async function signUp({
	name,
	email,
	cpf,
	password,
	marketing,
	termsVersion,
	recaptchaV2Token,
}: SignUpInput): Promise<Session | null> {
	const [firstName = "", ...lastName] = name.split(/\s+/);

	const data = await authApi.signUp({
		person_type: "pf",
		first_name: firstName,
		last_name: lastName.join(" "),
		email,
		cpf,
		password,
		accept_terms: true,
		terms_version: termsVersion,
		marketing_consent: marketing,
		recaptcha_token: await getRecaptchaToken("signup"),
		...(recaptchaV2Token && { recaptcha_token_v2: recaptchaV2Token }),
	});

	const login = loginResponseSchema.safeParse(data);
	if (login.success) {
		const session = authOptions.callbacks.session(login.data);
		setSession(session);
		return session;
	}

	try {
		return await signIn("credentials", { email, password });
	} catch {
		return null;
	}
}

export async function completeProfile(
	_values: CompleteProfileFormOutput,
): Promise<Session> {
	throw new ApiError(
		"O cadastro pelo Google ainda não está disponível. Tente de novo mais tarde.",
		null,
		"complete_profile_not_available",
	);
}

export function forgotPassword(email: string) {
	return authApi.forgotPassword(email);
}

export function redirectAfterSignIn(session: PublicSession) {
	return session.user.profileComplete
		? authOptions.pages.home
		: authOptions.pages.newUser;
}

export function getAuthRedirect(session: PublicSession | null) {
	if (!session) return authOptions.pages.signIn;
	if (!session.user.profileComplete) return authOptions.pages.newUser;
	return null;
}

export function getGuestRedirect(session: PublicSession | null) {
	return session ? redirectAfterSignIn(session) : null;
}

export function getCompleteProfileRedirect(session: PublicSession | null) {
	if (!session) return authOptions.pages.signIn;
	if (session.user.profileComplete) return authOptions.pages.home;
	return null;
}
