import { z } from "zod";

export const contactSubjects = [
	"Críticas ou sugestões",
	"Elogios e agradecimentos",
	"Dúvidas sobre pedido, pagamento ou prazo de entrega",
	"Propostas comerciais",
	"Parcerias na internet",
	"Outros",
] as const;

export function formatPhone(value: string) {
	const digits = value.replace(/\D/g, "").slice(0, 11);
	if (digits.length <= 2) return digits.replace(/^(\d{0,2})/, "($1");
	if (digits.length <= 6) return digits.replace(/^(\d{2})(\d+)/, "($1) $2");
	if (digits.length <= 10)
		return digits.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
	return digits.replace(/^(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
}

export const contactSchema = z.object({
	subject: z.enum(contactSubjects, { error: "Escolha o assunto." }),
	name: z.string().trim().min(3, { error: "Informe seu nome." }),
	email: z.email({ error: "Informe um e-mail válido." }),
	phone: z
		.string()
		.transform((value) => value.replace(/\D/g, ""))
		.pipe(
			z
				.string()
				.min(10, { error: "Informe o telefone com DDD." })
				.max(11, { error: "Informe o telefone com DDD." }),
		),
	message: z
		.string()
		.trim()
		.min(10, { error: "Conte um pouco mais sobre o que você precisa." }),
});

export type ContactField = keyof z.infer<typeof contactSchema>;
