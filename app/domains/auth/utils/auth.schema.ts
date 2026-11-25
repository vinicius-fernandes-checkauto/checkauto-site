import { z } from "zod";

import { isValidCpf } from "~/shared/utils/cpf";

const email = z.email({ error: "Informe um e-mail válido." });

const acceptedTerms = z.boolean().refine((accepted) => accepted, {
	error: "Aceite os termos para continuar.",
});

export const signInSchema = z.object({
	email,
	password: z.string().min(1, { error: "Informe sua senha." }),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
	name: z
		.string()
		.trim()
		.regex(/^\S+(\s+\S+)+$/, { error: "Informe nome e sobrenome." }),
	email,
	cpf: z
		.string()
		.transform((value) => value.replace(/\D/g, ""))
		.refine(isValidCpf, { error: "Informe um CPF válido." }),
	password: z
		.string()
		.min(8, { error: "Use de 8 a 16 caracteres." })
		.max(16, { error: "Use de 8 a 16 caracteres." })
		.regex(/[A-Z]/, { error: "Inclua uma letra maiúscula." })
		.regex(/[a-z]/, { error: "Inclua uma letra minúscula." })
		.regex(/\d/, { error: "Inclua um número." })
		.regex(/[^A-Za-z0-9]/, { error: "Inclua um símbolo." }),
	terms: acceptedTerms,
	marketing: z.boolean(),
});

export type SignUpFormInput = z.input<typeof signUpSchema>;
export type SignUpFormOutput = z.output<typeof signUpSchema>;

export const resetPasswordSchema = z.object({ email });

const cpf = z
	.string()
	.transform((value) => value.replace(/\D/g, ""))
	.refine(isValidCpf, { error: "Informe um CPF válido." });

export const completeProfileSchema = z.object({
	cpf,
	phone: z
		.string()
		.transform((value) => value.replace(/\D/g, ""))
		.pipe(
			z
				.string()
				.min(10, { error: "Informe o telefone com DDD." })
				.max(11, { error: "Informe o telefone com DDD." }),
		),
	terms: acceptedTerms,
});

export type CompleteProfileFormInput = z.input<typeof completeProfileSchema>;
export type CompleteProfileFormOutput = z.output<typeof completeProfileSchema>;

export const currentTermsSchema = z.object({
	version: z.string(),
	content: z.string(),
	published_at: z.string().optional(),
});

export const loginResponseSchema = z.object({
	access: z.string().min(1),
	refresh: z.string().min(1),
	id: z.coerce.string().min(1),
	name: z.string(),
	email: z.string(),
	profile: z.coerce.string(),
	profile_complete: z.boolean().optional(),
});
