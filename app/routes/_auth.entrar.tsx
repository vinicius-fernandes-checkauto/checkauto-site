import { Navigate } from "react-router";

import {
	AuthHeading,
	AuthHeadingDescription,
	AuthHeadingTitle,
} from "~/domains/auth/components/auth-heading";
import { AuthSwitch } from "~/domains/auth/components/auth-switch";
import { SignInForm } from "~/domains/auth/components/sign-in-form";
import { SocialSignIn } from "~/domains/auth/components/social-sign-in";
import { getGuestRedirect } from "~/domains/auth/services/auth.service";
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
	const { data: session } = useSession();
	const redirectTo = getGuestRedirect(session ?? null);

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

			<SignInForm />

			<SocialSignIn action="Entrar" />

			<AuthSwitch question="Não tem conta?" to="/cadastro">
				Criar conta
			</AuthSwitch>
		</>
	);
}
