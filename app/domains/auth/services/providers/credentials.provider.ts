import { login } from "~/domains/auth/auth.api";
import type { Credentials } from "~/domains/auth/types/auth.types";
import { getRecaptchaToken } from "~/domains/auth/utils/recaptcha";

export const CredentialsProvider = {
	async authorize({ email, password, recaptchaV2Token }: Credentials) {
		return login({
			username: email,
			password,
			recaptcha_token: await getRecaptchaToken("login"),
			...(recaptchaV2Token && { recaptcha_token_v2: recaptchaV2Token }),
		});
	},
};
