import { z } from "zod";

import { getRecaptchaToken } from "~/features/auth/lib/recaptcha";
import { ApiError, api } from "~/shared/lib/api";
import { type Session, tokenExpiresAt } from "~/shared/lib/session";

export type Credentials = {
	email: string;
	password: string;
};

const responseSchema = z.object({
	access: z.string(),
	refresh: z.string(),
	id: z.coerce.string(),
	name: z.string(),
	email: z.string(),
	profile: z.coerce.string(),
});

async function recaptchaToken() {
	try {
		return await getRecaptchaToken("login");
	} catch {
		throw new ApiError(
			"Não foi possível verificar o reCAPTCHA. Recarregue a página e tente de novo.",
			null,
		);
	}
}

export const CredentialsProvider = {
	async authorize({ email, password }: Credentials): Promise<Session> {
		const { data } = await api.post("/token/", {
			username: email,
			password,
			recaptcha_token: await recaptchaToken(),
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
