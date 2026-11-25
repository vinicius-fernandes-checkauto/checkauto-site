import { z } from "zod";

import { getRecaptchaToken } from "~/features/auth/lib/recaptcha";
import {
	authenticate,
	type CredentialsPayload,
} from "~/features/auth/services/auth-service";
import { ApiError } from "~/shared/lib/api";
import { type Session, tokenExpiresAt } from "~/shared/lib/session";

export type Credentials = {
	email: string;
	password: string;
	recaptchaV2Token?: string;
};

const responseSchema = z
	.object({
		access: z.string().min(1),
		refresh: z.string().min(1),
		id: z.coerce.string().min(1),
		name: z.string(),
		email: z.string(),
		profile: z.coerce.string(),
	})
	.passthrough();

const tokenSchema = z
	.object({
		access: z.string().min(1),
		refresh: z.string().min(1),
	})
	.passthrough();

const userSchema = z
	.object({
		id: z.coerce.string().min(1),
		name: z.string(),
		email: z.string(),
		profile: z.coerce.string(),
	})
	.passthrough();

const responseEnvelopeSchema = z
	.object({
		user: userSchema,
		content: tokenSchema,
	})
	.passthrough();

function parseResponse(data: unknown) {
	const direct = responseSchema.safeParse(data);
	if (direct.success) return direct.data;

	const wrappedContent = z.object({ content: responseSchema }).passthrough();
	const nested = wrappedContent.safeParse(data);
	if (nested.success) return nested.data.content;

	const envelope = responseEnvelopeSchema.safeParse(data);
	if (envelope.success) {
		return { ...envelope.data.content, ...envelope.data.user };
	}

	throw new ApiError(
		"Não foi possível iniciar sua sessão. Tente novamente.",
		null,
	);
}

export const CredentialsProvider = {
	async authorize({
		email,
		password,
		recaptchaV2Token,
	}: Credentials): Promise<Session> {
		const payload: CredentialsPayload = {
			username: email,
			password,
			recaptcha_token: await getRecaptchaToken("login"),
			...(recaptchaV2Token && { recaptcha_token_v2: recaptchaV2Token }),
		};

		const {
			access,
			refresh,
			id,
			name,
			email: userEmail,
			profile,
		} = parseResponse(await authenticate(payload));
		const expires = tokenExpiresAt(refresh);

		if (expires <= Date.now()) {
			throw new ApiError(
				"Não foi possível validar a sessão recebida. Tente novamente.",
				null,
			);
		}

		return {
			user: { id, name, email: userEmail, profile },
			accessToken: access,
			refreshToken: refresh,
			expires,
		};
	},
};
