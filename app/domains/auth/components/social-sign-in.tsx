import { useCallback, useState } from "react";
import { useNavigate } from "react-router";

import {
	redirectAfterSignIn,
	signIn,
} from "~/domains/auth/services/auth.service";
import {
	isGoogleSignInConfigured,
	renderGoogleButton,
} from "~/domains/auth/utils/google-identity";
import { toApiError } from "~/shared/lib/api";

type SocialSignInProps = { action: "Entrar" | "Criar conta" };

export function SocialSignIn({ action }: SocialSignInProps) {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const signInWithGoogle = useCallback(
		async (idToken: string) => {
			setError(null);
			setLoading(true);
			try {
				const session = await signIn("google", { idToken });
				navigate(redirectAfterSignIn(session), { replace: true });
			} catch (cause) {
				const { code, message } = toApiError(cause);
				if (code === "google_signup_required") {
					navigate("/completar-cadastro");
					return;
				}
				setError(message);
			} finally {
				setLoading(false);
			}
		},
		[navigate],
	);

	const mount = useCallback(
		(node: HTMLDivElement | null) => {
			if (!node) return;
			const button = document.createElement("div");
			node.append(button);
			renderGoogleButton(
				button,
				action === "Entrar" ? "signin_with" : "signup_with",
				signInWithGoogle,
			).catch(() => setError("Não foi possível carregar o login com Google."));
			return () => button.remove();
		},
		[action, signInWithGoogle],
	);

	if (!isGoogleSignInConfigured()) return null;

	return (
		<div className="flex flex-col items-center gap-4">
			<div className="flex w-full justify-center gap-3">
				<div ref={mount} className="flex min-h-11 w-full justify-center" />
				{/* <button
					type="button"
					aria-label={`${action} com Facebook`}
					className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-[#1877F2] transition-colors hover:border-slate-300"
				>
					<FacebookIcon className="size-5" />
				</button> */}
			</div>
			{loading && (
				<p role="status" className="text-sm text-muted-foreground">
					Entrando com o Google…
				</p>
			)}
			{error && (
				<p role="alert" className="text-center text-sm text-destructive">
					{error}
				</p>
			)}
			<p className="text-sm text-muted-foreground">ou</p>
		</div>
	);
}
