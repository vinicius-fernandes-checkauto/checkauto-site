import { useState } from "react";
import { useNavigate } from "react-router";

import {
	redirectAfterSignIn,
	signIn,
} from "~/domains/auth/services/auth.service";
import { GoogleIcon } from "~/shared/components/icons";
import { toApiError } from "~/shared/lib/api";

export function SocialSignIn({ action }: { action: string }) {
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	async function signInWithGoogle() {
		setError(null);
		try {
			const session = await signIn("google", undefined);
			navigate(redirectAfterSignIn(session), { replace: true });
		} catch (cause) {
			setError(toApiError(cause).message);
		}
	}

	return (
		<div className="flex flex-col items-center gap-4">
			<p className="text-sm text-muted-foreground">ou continue com</p>
			<div className="flex gap-3">
				<button
					type="button"
					aria-label={`${action} com Google`}
					onClick={signInWithGoogle}
					className="flex size-12 items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-brand-blue/35"
				>
					<GoogleIcon className="size-5" />
				</button>
				{/* <button
					type="button"
					aria-label={`${action} com Facebook`}
					className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-[#1877F2] transition-colors hover:border-slate-300"
				>
					<FacebookIcon className="size-5" />
				</button> */}
			</div>
			{error && (
				<p role="alert" className="text-center text-sm text-destructive">
					{error}
				</p>
			)}
		</div>
	);
}
