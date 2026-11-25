import type { LoginResponse } from "~/domains/auth/types/auth.types";
import { ApiError } from "~/shared/lib/api";

export const GoogleProvider = {
	async authorize(): Promise<LoginResponse> {
		throw new ApiError(
			"Login com Google será integrado em uma próxima etapa.",
			null,
			"google_not_configured",
		);
	},
};
