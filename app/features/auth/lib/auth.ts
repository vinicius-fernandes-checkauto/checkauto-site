import {
	createContext,
	type RouterContextProvider,
	redirect,
} from "react-router";
import { z } from "zod";

import type { SignUpFormOutput } from "~/features/auth/lib/auth-schema";
import {
	type AuthProvider,
	type ProviderInput,
	providers,
} from "~/features/auth/lib/providers";
import { getRecaptchaToken } from "~/features/auth/lib/recaptcha";
import { api } from "~/shared/lib/api";
import {
	clearSession,
	getSession,
	type Session,
	SIGN_IN_PATH,
	setSession,
} from "~/shared/lib/session";

export const sessionContext = createContext<Session>();

const termsSchema = z.object({ version: z.string() });

async function currentTermsVersion() {
	const { data } = await api.get("/user/terms/current/");
	return termsSchema.parse(data?.content ?? data).version;
}

export type SignUpInput = SignUpFormOutput & { recaptchaV2Token?: string };

export async function signUp({
	name,
	email,
	cpf,
	password,
	marketing,
	recaptchaV2Token,
}: SignUpInput) {
	const [firstName = "", ...lastName] = name.split(/\s+/);

	await api.post("/signup/", {
		person_type: "pf",
		first_name: firstName,
		last_name: lastName.join(" "),
		email,
		cpf,
		password,
		accept_terms: true,
		terms_version: await currentTermsVersion(),
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

export function authMiddleware({
	context,
}: {
	context: Readonly<RouterContextProvider>;
}) {
	const session = getSession();

	if (!session) throw redirect(SIGN_IN_PATH);

	context.set(sessionContext, session);
}
