import { z } from "zod";

import { plans } from "~/content/plans";
import { strongPassword } from "~/domains/auth/utils/auth.schema";
import { brazilianStates } from "~/shared/utils/address";
import { plateSchema } from "~/shared/utils/plate";

export const addressSchema = z.object({
	zip: z
		.string()
		.transform((value) => value.replace(/\D/g, ""))
		.pipe(z.string().length(8, { error: "Informe um CEP válido." })),
	street: z.string().trim().min(3, { error: "Informe a rua." }),
	number: z.string().trim().min(1, { error: "Informe o número." }),
	complement: z.string().trim(),
	district: z.string().trim().min(2, { error: "Informe o bairro." }),
	city: z.string().trim().min(2, { error: "Informe a cidade." }),
	state: z.enum(brazilianStates, { error: "Escolha a UF." }),
});

export type Address = z.output<typeof addressSchema>;
export type AddressField = keyof Address;

const phoneDigits = (message: string) =>
	z
		.string()
		.transform((value) => value.replace(/\D/g, ""))
		.pipe(z.string().min(10, { error: message }).max(11, { error: message }));

export const profileSchema = z
	.object({
		name: z.string().trim().min(3, { error: "Informe o nome." }),
		stateRegistration: z.string().trim().optional(),
		stateRegistrationExempt: z.boolean(),
		phone: phoneDigits("Informe o telefone com DDD."),
		secondaryPhone: z.union([
			z.literal(""),
			phoneDigits("Informe o telefone com DDD."),
		]),
		address: addressSchema,
		shareData: z.enum(["sim", "nao"]),
	})
	.refine(
		(data) => data.stateRegistrationExempt || Boolean(data.stateRegistration),
		{
			path: ["stateRegistration"],
			error: "Informe a inscrição estadual ou marque isento.",
		},
	);

export type ProfileFormValues = z.input<typeof profileSchema>;
export type ProfileField = Exclude<keyof ProfileFormValues, "address">;

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

export const emailChangeSchema = z.object({
	code: z
		.string()
		.transform((value) => value.replace(/\D/g, ""))
		.pipe(z.string().length(6, { error: "Informe o código de 6 dígitos." })),
	newEmail: z.email({ error: "Informe um e-mail válido." }),
});

export type EmailChangeField = keyof z.input<typeof emailChangeSchema>;

export const newQuerySchema = z.object({
	planId: z.string().refine((id) => plans.some((plan) => plan.id === id), {
		error: "Escolha um pacote.",
	}),
	plate: plateSchema,
});

export type NewQueryValues = z.input<typeof newQuerySchema>;
export type NewQuery = z.output<typeof newQuerySchema>;
