import { z } from "zod";

export function formatCpf(value: string) {
	const digits = value.replace(/\D/g, "").slice(0, 11);
	return digits
		.replace(/^(\d{3})(\d)/, "$1.$2")
		.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
		.replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

function isValidCpf(digits: string) {
	if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
	const check = (length: number) => {
		const sum = [...digits.slice(0, length)].reduce(
			(total, digit, index) => total + Number(digit) * (length + 1 - index),
			0,
		);
		return ((sum * 10) % 11) % 10;
	};
	return check(9) === Number(digits[9]) && check(10) === Number(digits[10]);
}

const email = z.email({ error: "Informe um e-mail válido." });

const acceptedTerms = z.literal(true, {
	error: "Aceite os termos para continuar.",
});

export const signInSchema = z.object({
	email,
	password: z.string().min(1, { error: "Informe sua senha." }),
	terms: acceptedTerms,
});

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
});

export const resetPasswordSchema = z.object({ email });
