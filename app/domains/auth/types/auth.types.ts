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

export type ChangePasswordBody = {
	current_password: string;
	new_password: string;
	new_password_again: string;
};

export type SetPasswordBody = {
	email: string;
	password: string;
};

export type ResetPasswordBody = {
	token: string;
	password: string;
};

export type GoogleProfile = {
	email: string;
	name: string;
	firstName: string;
	lastName: string;
};

export type GoogleSignUpBody = {
	id_token: string;
	person_type: "pf" | "pj";
	cpf?: string;
	cnpj?: string;
	corporate_name?: string;
	fantasy_name?: string;
	first_name: string;
	last_name: string;
	phone: string;
	cep: string;
	street: string;
	number_address: string;
	district: string;
	city: string;
	uf: string;
	complement?: string;
	accept_terms: true;
	terms_version: string;
	marketing_consent: boolean;
};
