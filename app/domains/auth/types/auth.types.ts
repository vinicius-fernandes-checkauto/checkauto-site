import type { z } from "zod";

import type {
	currentTermsSchema,
	loginResponseSchema,
} from "~/domains/auth/utils/auth.schema";

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export type CurrentTerms = z.infer<typeof currentTermsSchema>;

export type LoginBody = {
	username: string;
	password: string;
	recaptcha_token: string;
	recaptcha_token_v2?: string;
};

export type SignUpBody = {
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

export type Credentials = {
	email: string;
	password: string;
	recaptchaV2Token?: string;
};
