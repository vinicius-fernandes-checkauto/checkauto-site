import * as authApi from "~/domains/auth/auth.api";
import {
	type AuthProvider,
	type ProviderInput,
	providers,
} from "~/domains/auth/services/providers";
import type {
	LoginResponse,
	ProfileBody,
} from "~/domains/auth/types/auth.types";
import type {
	CompleteProfileFormValues,
	ProfileFieldsValues,
	SignUpFormValues,
} from "~/domains/auth/utils/auth.schema";
import {
	clearPendingGoogleSignUp,
	readPendingGoogleSignUp,
} from "~/domains/auth/utils/google-identity";
import { getRecaptchaToken } from "~/domains/auth/utils/recaptcha";
import { ApiError, toApiError } from "~/shared/lib/api";
import {
	clearSession,
	type PublicSession,
	type Session,
	type SessionUser,
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
		session(
			login: LoginResponse,
			authProvider: SessionUser["authProvider"] = "credentials",
		): Session {
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
					authProvider,
				},
				accessToken: login.access,
				refreshToken: login.refresh,
				expires,
			};
		},
	},
};

function startSession(
	login: LoginResponse,
	authProvider: SessionUser["authProvider"],
) {
	const session = authOptions.callbacks.session(login, authProvider);
	setSession(session);
	return session;
}

export async function signIn<P extends AuthProvider>(
	provider: P,
	input: ProviderInput<P>,
) {
	const login = await authOptions.providers[provider].authorize(input);
	return startSession(login, provider);
}

export function signOut() {
	clearSession();
}

const digits = (value: string) => value.replace(/\D/g, "");

function profileBody(
	values: ProfileFieldsValues,
	termsVersion: string,
): ProfileBody {
	const company = values.personType === "pj";

	return {
		person_type: values.personType,
		...(company
			? {
					cnpj: digits(values.cnpj),
					corporate_name: values.corporateName,
					fantasy_name: values.fantasyName,
				}
			: { cpf: digits(values.cpf) }),
		first_name: values.firstName,
		last_name: values.lastName,
		phone: digits(values.phone),
		cep: digits(values.zip),
		street: values.street,
		number_address: values.number,
		district: values.district,
		city: values.city,
		uf: values.state,
		...(values.complement && { complement: values.complement }),
		accept_terms: true,
		terms_version: termsVersion,
		marketing_consent: values.marketing,
	};
}

export type SignUpInput = SignUpFormValues & {
	termsVersion: string;
	recaptchaV2Token?: string;
};

export async function signUp({
	termsVersion,
	recaptchaV2Token,
	...values
}: SignUpInput): Promise<Session | null> {
	await authApi.signUp({
		...profileBody(values, termsVersion),
		email: values.email,
		password: values.password,
		recaptcha_token: await getRecaptchaToken("signup"),
		...(recaptchaV2Token && { recaptcha_token_v2: recaptchaV2Token }),
	});

	try {
		return await signIn("credentials", {
			email: values.email,
			password: values.password,
		});
	} catch {
		return null;
	}
}

export async function completeGoogleSignUp(
	values: CompleteProfileFormValues,
): Promise<Session> {
	const pending = readPendingGoogleSignUp();
	if (!pending) {
		throw new ApiError(
			"Sua confirmação do Google expirou. Entre com o Google de novo.",
			null,
			"google_token_invalid",
		);
	}

	const { version } = await authApi.getCurrentTerms();

	try {
		const login = await authApi.signUpWithGoogle({
			id_token: pending.idToken,
			...profileBody(values, version),
		});
		clearPendingGoogleSignUp();
		return startSession(login, "google");
	} catch (error) {
		const { code } = toApiError(error);
		if (
			code === "google_already_registered" ||
			code === "google_token_invalid" ||
			code === "google_email_not_verified"
		) {
			clearPendingGoogleSignUp();
		}
		throw error;
	}
}

export type ChangePasswordInput = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

export async function changePassword({
	currentPassword,
	newPassword,
	confirmPassword,
}: ChangePasswordInput) {
	await authApi.changePassword({
		current_password: currentPassword,
		new_password: newPassword,
		new_password_again: confirmPassword,
	});
}

export async function forgotPassword(email: string) {
	try {
		await authApi.forgotPassword(email);
	} catch (error) {
		const apiError = toApiError(error);
		if (apiError.code === "google_account") {
			throw new ApiError(
				"Essa conta entra com outro método de autenticação.",
				apiError.status,
				apiError.code,
			);
		}
		throw apiError;
	}
}

export function canChangePassword(session: PublicSession | null) {
	return session?.user.authProvider !== "google";
}

export function redirectAfterSignIn(_session: PublicSession) {
	return authOptions.pages.home;
}

export function getAuthRedirect(session: PublicSession | null) {
	return session ? null : authOptions.pages.signIn;
}

export function getGuestRedirect(session: PublicSession | null) {
	return session ? redirectAfterSignIn(session) : null;
}

export function getCompleteProfileRedirect(
	session: PublicSession | null,
	pendingGoogleSignUp: boolean,
) {
	if (pendingGoogleSignUp) return null;
	return session ? authOptions.pages.home : authOptions.pages.signIn;
}
