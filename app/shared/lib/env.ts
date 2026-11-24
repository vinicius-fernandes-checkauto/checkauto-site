import { z } from "zod";

const apiEnvSchema = z.object({
	VITE_API_URL: z.url({ error: "Defina VITE_API_URL com a URL da API." }),
	VITE_API_TIMEOUT: z.coerce.number().int().positive().default(15_000),
});

export type ApiEnv = {
	baseURL: string;
	timeout: number;
};

export function readApiEnv(
	source: Record<string, unknown> = import.meta.env,
): ApiEnv {
	const result = apiEnvSchema.safeParse(source);

	if (!result.success) {
		const issues = result.error.issues.map((issue) => issue.message).join(" ");
		throw new Error(`Variáveis de ambiente inválidas. ${issues}`);
	}

	return {
		baseURL: result.data.VITE_API_URL,
		timeout: result.data.VITE_API_TIMEOUT,
	};
}

export type RecaptchaKeys = {
	v3: string | null;
	v2: string | null;
};

export function readRecaptchaKeys(
	source: Record<string, unknown> = import.meta.env,
): RecaptchaKeys {
	const key = (value: unknown) =>
		typeof value === "string" && value.trim() ? value.trim() : null;

	return {
		v3: key(source.VITE_RECAPTCHA_SITE_KEY),
		v2: key(source.VITE_RECAPTCHA_V2_SITE_KEY),
	};
}
