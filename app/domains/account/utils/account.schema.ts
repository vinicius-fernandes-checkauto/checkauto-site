import { z } from "zod";

import { plans } from "~/content/plans";
import { strongPassword } from "~/domains/auth/utils/auth.schema";
import { brazilianStates } from "~/shared/utils/address";
import { plateSchema } from "~/shared/utils/plate";

const digits = (value: string) => value.replace(/\D/g, "");

export const profileSchema = z.object({
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
	marketing: z.boolean(),
});

export type ProfileFormInput = z.input<typeof profileSchema>;
export type ProfileFormValues = z.output<typeof profileSchema>;

const text = z
	.string()
	.nullish()
	.transform((value) => value ?? "");

export const userDetailSchema = z.object({
	id: z.coerce.string().min(1),
	first_name: text,
	last_name: text,
	email: z.string(),
	cpf: text,
	phone: text,
	cep: text,
	street: text,
	number_address: text,
	complement: text,
	district: text,
	city: text,
	uf: text,
	company: z
		.object({
			corporate_name: text,
			fantasy_name: text,
			cnpj: text,
			state_registration: text,
			cep: text,
			street: text,
			number_address: text,
			complement: text,
			district: text,
			city: text,
			uf: text,
		})
		.nullish(),
	marketing_consent: z.boolean().nullish(),
	balance: z.coerce.string().nullish(),
	terms_accepted_version: text,
	terms_accepted_at: text,
});

export const passwordSchema = z
	.object({
		currentPassword: z.string().min(1, { error: "Informe a senha atual." }),
		newPassword: strongPassword,
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		path: ["confirmPassword"],
		error: "As senhas não são iguais.",
	});

export type PasswordField = keyof z.input<typeof passwordSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;

export const newQuerySchema = z.object({
	planId: z.string().refine((id) => plans.some((plan) => plan.id === id), {
		error: "Escolha um pacote.",
	}),
	plate: plateSchema,
});

export type NewQueryValues = z.input<typeof newQuerySchema>;
export type NewQuery = z.output<typeof newQuerySchema>;

const orderSchema = z.object({
	id: z.coerce.string().min(1),
	number: z.coerce.string().nullish(),
	status: z.coerce.string(),
	status_label: z.string().nullish(),
	plate: z.string().nullish(),
	product: z.object({ name: z.string().nullish() }).nullish(),
	amount: z.coerce.string().nullish(),
	created_at: z.string().nullish(),
	query_code: z.coerce.string().nullish(),
});

export const orderListSchema = z.object({
	count: z.number(),
	results: z.array(orderSchema),
});

export const orderDetailSchema = orderSchema.partial().extend({
	id: z.coerce.string().min(1),
	call: z
		.object({
			id: z.coerce.string().min(1),
			status: z.coerce.string().nullish(),
		})
		.nullish(),
	expires_at: z.string().nullish(),
	events: z
		.array(
			z.object({
				type: z.string(),
				status_after: z.string().nullish(),
				group: z.string().nullish(),
				label: z.string().nullish(),
				created_at: z.string().nullish(),
				data: z
					.object({
						method: z.string().nullish(),
						brand: z.string().nullish(),
						last4: z.string().nullish(),
						error_code: z.string().nullish(),
						reason: z.string().nullish(),
					})
					.nullish(),
			}),
		)
		.default([]),
});

export const orderStatementSchema = z.object({
	pdf_status: z.enum(["pending", "processing", "failed", "ready"]),
	download_url: z.string().nullish(),
});

export const walletMovementSchema = z.object({
	id: z.coerce.string().min(1),
	type: z.string().nullish(),
	origin: z.string().nullish(),
	amount: z.coerce.string().nullish(),
	balance_after: z.coerce.string().nullish(),
	reason: z.string().nullish(),
	created_at: z.string().nullish(),
});

export const walletMovementListSchema = z.object({
	count: z.number().default(0),
	results: z.array(walletMovementSchema).default([]),
	summary: z.object({ balance: z.coerce.string().nullish() }).nullish(),
});
