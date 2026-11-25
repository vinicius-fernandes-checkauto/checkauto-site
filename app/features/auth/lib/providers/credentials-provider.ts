import { z } from "zod";

import { getRecaptchaToken } from "~/features/auth/lib/recaptcha";
import { api } from "~/shared/lib/api";
import { type Session, tokenExpiresAt } from "~/shared/lib/session";

export type Credentials = {
	email: string;
	password: string;
	recaptchaV2Token?: string;
};

const responseSchema = z.object({
	access: z.string(),
	refresh: z.string(),
	id: z.coerce.string(),
	name: z.string(),
	email: z.string(),
	profile: z.coerce.string(),
});

export const CredentialsProvider = {
	async authorize({
		email,
		password,
		recaptchaV2Token,
	}: Credentials): Promise<Session> {
		const { data } = await api.post("/token/", {
			username: email,
			password,
			recaptcha_token: await getRecaptchaToken("login"),
			...(recaptchaV2Token && { recaptcha_token_v2: recaptchaV2Token }),
		});

		const { access, refresh, ...user } = responseSchema.parse(data);

		return {
			user,
			accessToken: access,
			refreshToken: refresh,
			expires: tokenExpiresAt(refresh),
		};
	},
};
