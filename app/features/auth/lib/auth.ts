import type { SignUpFormOutput } from "~/features/auth/lib/auth-schema";
import {
	type AuthProvider,
	type ProviderInput,
	providers,
} from "~/features/auth/lib/providers";
import { getRecaptchaToken } from "~/features/auth/lib/recaptcha";
import {
	createAccount,
	requestPasswordReset,
} from "~/features/auth/services/auth-service";
import { clearSession, setSession } from "~/shared/lib/session";

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
}: SignUpInput) {
	const [firstName = "", ...lastName] = name.split(/\s+/);

	await createAccount({
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
}

export async function signIn<P extends AuthProvider>(
	provider: P,
	input: ProviderInput<P>,
) {
	const session = await providers[provider].authorize(input);
	setSession(session);
}

export function signOut() {
	clearSession();
}

export function forgotPassword(email: string) {
	return requestPasswordReset(email);
}
