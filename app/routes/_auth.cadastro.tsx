import { Navigate } from "react-router";

import {
	AuthHeading,
	AuthHeadingDescription,
	AuthHeadingTitle,
} from "~/domains/auth/components/auth-heading";
import { AuthSwitch } from "~/domains/auth/components/auth-switch";
import { SignUpForm } from "~/domains/auth/components/sign-up-form";
import { SocialSignIn } from "~/domains/auth/components/social-sign-in";
import { getGuestRedirect } from "~/domains/auth/services/auth.service";
import { useSession } from "~/shared/hooks/use-session";

import type { Route } from "./+types/_auth.cadastro";

export const meta: Route.MetaFunction = () => [
	{ title: "Criar conta | Checkauto" },
	{
		name: "description",
		content:
			"Crie sua conta Checkauto em menos de um minuto e consulte o histórico de qualquer veículo.",
	},
];

export default function SignUp() {
	const { data: session } = useSession();
	const redirectTo = getGuestRedirect(session ?? null);

	if (redirectTo) return <Navigate to={redirectTo} replace />;

	return (
		<>
			<AuthHeading>
				<AuthHeadingTitle>Crie sua conta</AuthHeadingTitle>
				<AuthHeadingDescription>
					Leva menos de um minuto. Endereço só se você precisar de nota fiscal.
				</AuthHeadingDescription>
			</AuthHeading>

			<SignUpForm />

			<SocialSignIn action="Criar conta" />

			<AuthSwitch question="Já tem conta?" to="/entrar">
				Entrar
			</AuthSwitch>
		</>
	);
}
