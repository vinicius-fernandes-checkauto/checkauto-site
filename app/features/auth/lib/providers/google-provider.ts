import { ApiError } from "~/shared/lib/api";
import type { Session } from "~/shared/lib/session";

export const GoogleProvider = {
	async authorize(): Promise<Session> {
		throw new ApiError(
			"Login com Google será integrado em uma próxima etapa.",
			null,
			"google_not_configured",
		);
	},
};
