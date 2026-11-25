import { z } from "zod";

import {
	type CurrentTerms,
	currentTermsSchema,
} from "~/features/auth/lib/auth-schema";
import { api } from "~/shared/lib/api";

export type CredentialsPayload = {
	username: string;
	password: string;
	recaptcha_token: string;
	recaptcha_token_v2?: string;
};

export type SignUpPayload = {
	person_type: "pf";
	first_name: string;
	last_name: string;
	email: string;
	cpf: string;
	password: string;
	accept_terms: true;
	terms_version: string;
	marketing_consent: boolean;
	recaptcha_token: string;
	recaptcha_token_v2?: string;
};

const termsEnvelopeSchema = z
	.object({ content: currentTermsSchema })
	.passthrough();

export function parseCurrentTerms(data: unknown): CurrentTerms {
	const direct = currentTermsSchema.safeParse(data);
	if (direct.success) return direct.data;
	return termsEnvelopeSchema.parse(data).content;
}

export async function authenticate(payload: CredentialsPayload) {
	const { data } = await api.post<unknown>("/token/", payload);
	return data;
}

export async function fetchCurrentTerms() {
	const { data } = await api.get<unknown>("/user/terms/current/");
	return parseCurrentTerms(data);
}

export async function createAccount(payload: SignUpPayload) {
	await api.post("/signup/", payload);
}

export async function requestPasswordReset(email: string) {
	await api.post("/user/forgot-password/", { email });
}
