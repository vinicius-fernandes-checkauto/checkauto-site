import { loginWithGoogle } from "~/domains/auth/auth.api";
import { savePendingGoogleSignUp } from "~/domains/auth/utils/google-identity";
import { toApiError } from "~/shared/lib/api";

function text(record: Record<string, unknown>, key: string) {
	const value = record[key];
	return typeof value === "string" ? value : "";
}

export const GoogleProvider = {
	async authorize({ idToken }: { idToken: string }) {
		try {
			return await loginWithGoogle(idToken);
		} catch (error) {
			const apiError = toApiError(error);
			if (apiError.code === "google_signup_required") {
				const data =
					apiError.data && typeof apiError.data === "object"
						? (apiError.data as Record<string, unknown>)
						: {};
				savePendingGoogleSignUp(idToken, {
					email: text(data, "email"),
					name: text(data, "name"),
					firstName: text(data, "first_name"),
					lastName: text(data, "last_name"),
				});
			}
			throw apiError;
		}
	},
};
