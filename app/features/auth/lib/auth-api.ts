import { z } from "zod";

import { envelope } from "~/shared/api";

export const authTokensSchema = z.object({
	access: z.string().min(1),
	refresh: z.string().min(1),
});

export type AuthTokens = z.output<typeof authTokensSchema>;

export const refreshedTokensSchema = z.object({
	access: z.string().min(1),
	refresh: z.string().min(1).optional(),
});

export type RefreshedTokens = z.output<typeof refreshedTokensSchema>;

export const currentTermsSchema = envelope(
	z.object({
		version: z.string().min(1),
		content: z.string(),
		published_at: z.string(),
	}),
).transform(({ version, content, published_at }) => ({
	version,
	content,
	publishedAt: published_at,
}));

export type CurrentTerms = z.output<typeof currentTermsSchema>;

export type LoginCredentials = {
	email: string;
	password: string;
	recaptchaToken?: string;
	recaptchaTokenV2?: string;
};

export const recaptchaReasons = {
	fallbackRequired: "recaptcha_fallback_required",
	failed: "recaptcha_failed",
} as const;
