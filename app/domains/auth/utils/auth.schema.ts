import { z } from "zod";

import { brazilianStates } from "~/shared/utils/address";
import { isValidCnpj } from "~/shared/utils/cnpj";
import { isValidCpf } from "~/shared/utils/cpf";

const email = z.email({ error: "Informe um e-mail válido." });

export const strongPassword = z
	.string()
	.min(8, { error: "Use de 8 a 16 caracteres." })
	.max(16, { error: "Use de 8 a 16 caracteres." })
	.regex(/[A-Z]/, { error: "Inclua uma letra maiúscula." })
	.regex(/[a-z]/, { error: "Inclua uma letra minúscula." })
	.regex(/\d/, { error: "Inclua um número." })
	.regex(/[^A-Za-z0-9]/, { error: "Inclua um símbolo." });

const cpf = z
	.string()
	.transform((value) => value.replace(/\D/g, ""))
	.refine(isValidCpf, { error: "Informe um CPF válido." });

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
	cpf,
	password: strongPassword,
	terms: acceptedTerms,
	marketing: z.boolean(),
});

export type SignUpFormInput = z.input<typeof signUpSchema>;
export type SignUpFormOutput = z.output<typeof signUpSchema>;

export const resetPasswordSchema = z.object({ email });

export const setPasswordSchema = z
	.object({
		email,
		password: strongPassword,
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		error: "As senhas não são iguais.",
	});

export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;

export const newPasswordSchema = z
	.object({
		password: strongPassword,
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		error: "As senhas não são iguais.",
	});

export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

const digits = (value: string) => value.replace(/\D/g, "");

export const completeProfileSchema = z
	.object({
		personType: z.enum(["pf", "pj"]),
		firstName: z.string().trim().min(1, { error: "Informe o nome." }),
		lastName: z.string().trim().min(1, { error: "Informe o sobrenome." }),
		cpf: z.string(),
		cnpj: z.string(),
		corporateName: z.string().trim(),
		fantasyName: z.string().trim(),
		phone: z.string().refine((value) => /^\d{10,11}$/.test(digits(value)), {
			error: "Informe o telefone com DDD.",
		}),
		zip: z.string().refine((value) => digits(value).length === 8, {
			error: "Informe um CEP válido.",
		}),
		street: z.string().trim().min(3, { error: "Informe a rua." }),
		number: z.string().trim().min(1, { error: "Informe o número." }),
		complement: z.string().trim(),
		district: z.string().trim().min(2, { error: "Informe o bairro." }),
		city: z.string().trim().min(2, { error: "Informe a cidade." }),
		state: z.enum(brazilianStates, { error: "Escolha a UF." }),
		terms: acceptedTerms,
		marketing: z.boolean(),
	})
	.superRefine((data, context) => {
		if (data.personType === "pf" && !isValidCpf(digits(data.cpf))) {
			context.addIssue({
				code: "custom",
				path: ["cpf"],
				message: "Informe um CPF válido.",
			});
		}
		if (data.personType === "pj" && !isValidCnpj(digits(data.cnpj))) {
			context.addIssue({
				code: "custom",
				path: ["cnpj"],
				message: "Informe um CNPJ válido.",
			});
		}
		if (data.personType === "pj" && data.corporateName.length < 2) {
			context.addIssue({
				code: "custom",
				path: ["corporateName"],
				message: "Informe a razão social.",
			});
		}
	});

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

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
});
