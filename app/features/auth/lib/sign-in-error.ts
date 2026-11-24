import { recaptchaReasons } from "~/features/auth/lib/auth-api";
import { isApiError } from "~/shared/api";

export type SignInFailure = {
	message: string;
	needsChallenge: boolean;
};

export function signInFailure(error: unknown): SignInFailure {
	if (!isApiError(error)) {
		return {
			message:
				error instanceof Error && error.message
					? error.message
					: "Não foi possível entrar. Tente de novo.",
			needsChallenge: false,
		};
	}

	if (error.reason === recaptchaReasons.fallbackRequired) {
		return {
			message: "Confirme que você não é um robô para continuar.",
			needsChallenge: true,
		};
	}

	if (error.reason === recaptchaReasons.failed) {
		return {
			message: "A verificação de segurança falhou. Tente de novo.",
			needsChallenge: true,
		};
	}

	if (error.code === "UNAUTHORIZED" || error.code === "VALIDATION") {
		return { message: "E-mail ou senha incorretos.", needsChallenge: false };
	}

	return { message: error.message, needsChallenge: false };
}
