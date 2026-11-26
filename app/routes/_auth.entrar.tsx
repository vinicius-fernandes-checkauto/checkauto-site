import { useState } from "react";
import { Navigate, useLocation } from "react-router";

import {
	AuthHeading,
	AuthHeadingDescription,
	AuthHeadingTitle,
} from "~/domains/auth/components/auth-heading";
import { AuthSwitch } from "~/domains/auth/components/auth-switch";
import { SignInForm } from "~/domains/auth/components/sign-in-form";
import {
	GOOGLE_SIGN_IN_ID,
	SocialSignIn,
} from "~/domains/auth/components/social-sign-in";
import { getGuestRedirect } from "~/domains/auth/services/auth.service";
import { readNotice } from "~/domains/auth/utils/notice";
import { useSession } from "~/shared/hooks/use-session";

import type { Route } from "./+types/_auth.entrar";

export const meta: Route.MetaFunction = () => [
	{ title: "Entrar | Checkauto" },
	{
		name: "description",
		content:
			"Acesse sua conta Checkauto para acompanhar suas consultas e ver relatórios anteriores.",
	},
];

export default function SignIn() {
	const location = useLocation();
	const notice = readNotice(location.state);
	const { data: session } = useSession();
	const redirectTo = getGuestRedirect(session ?? null);
	const [highlightGoogle, setHighlightGoogle] = useState(false);

	if (redirectTo) return <Navigate to={redirectTo} replace />;

	return (
		<>
			<AuthHeading>
				<AuthHeadingTitle>Entrar</AuthHeadingTitle>
				<AuthHeadingDescription>
					Acesse sua conta para acompanhar suas consultas, ver relatórios
					anteriores e fazer novas consultas.
				</AuthHeadingDescription>
			</AuthHeading>

			{notice && (
				<p
					role="status"
					className="rounded-2xl bg-brand-green/15 px-4 py-3 text-center text-sm text-heading"
				>
					{notice.notice}
				</p>
			)}

			<SocialSignIn action="Entrar" highlighted={highlightGoogle} />

			<SignInForm
				defaultEmail={notice?.email}
				onGoogleAccount={() => {
					setHighlightGoogle(true);
					document
						.getElementById(GOOGLE_SIGN_IN_ID)
						?.scrollIntoView({ block: "center" });
				}}
			/>

			<AuthSwitch question="Não tem conta?" to="/cadastro">
				Criar conta
			</AuthSwitch>
		</>
	);
}
