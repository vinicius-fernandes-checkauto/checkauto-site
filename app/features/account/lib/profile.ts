import { z } from "zod";

import { type Address, addressSchema } from "~/features/account/lib/addresses";

export type AccountProfile = {
	personType: "Pessoa física" | "Pessoa jurídica";
	name: string;
	document: string;
	stateRegistration: string;
	stateRegistrationExempt: boolean;
	phone: string;
	secondaryPhone: string;
	email: string;
	address: Address;
	contractAcceptedAt: string;
	shareData: boolean;
};

export const demoProfile: AccountProfile = {
	personType: "Pessoa jurídica",
	name: "Teste Veículos Ltda",
	document: "01.689.272/0001-03",
	stateRegistration: "",
	stateRegistrationExempt: true,
	phone: "(11) 90000-0000",
	secondaryPhone: "",
	email: "contato@testeveiculos.com.br",
	address: {
		zip: "04543011",
		street: "Avenida Brigadeiro Faria Lima",
		number: "3477",
		complement: "Conjunto 92",
		district: "Itaim Bibi",
		city: "São Paulo",
		state: "SP",
	},
	contractAcceptedAt: "2025-03-12",
	shareData: true,
};

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
		newPassword: z.string().min(8, { error: "Use pelo menos 8 caracteres." }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		path: ["confirmPassword"],
		error: "As senhas não são iguais.",
	});

export type PasswordField = keyof z.input<typeof passwordSchema>;

export const emailChangeSchema = z.object({
	code: z
		.string()
		.transform((value) => value.replace(/\D/g, ""))
		.pipe(z.string().length(6, { error: "Informe o código de 6 dígitos." })),
	newEmail: z.email({ error: "Informe um e-mail válido." }),
});

export type EmailChangeField = keyof z.input<typeof emailChangeSchema>;

export function maskEmail(email: string) {
	const [user, domain] = email.split("@");
	if (!domain) return email;
	return `${user.slice(0, 2)}${"•".repeat(Math.max(user.length - 2, 3))}@${domain}`;
}
