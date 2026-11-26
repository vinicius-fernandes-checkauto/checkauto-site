import { Navigate } from "react-router";

import { AuthFooter } from "~/domains/auth/components/auth-footer";
import {
	AuthHeading,
	AuthHeadingDescription,
	AuthHeadingTitle,
} from "~/domains/auth/components/auth-heading";
import { AuthSwitch } from "~/domains/auth/components/auth-switch";
import { SignUpForm } from "~/domains/auth/components/sign-up-form";
import { getGuestRedirect } from "~/domains/auth/services/auth.service";
import { useSession } from "~/shared/hooks/use-session";

import type { Route } from "./+types/_auth.cadastro";

export const meta: Route.MetaFunction = () => [
	{ title: "Criar conta | Checkauto" },
	{
		name: "description",
		content:
			"Crie sua conta Checkauto e consulte o histórico de qualquer veículo.",
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
					São três etapas rápidas para começar a consultar.
				</AuthHeadingDescription>
			</AuthHeading>

			<SignUpForm />

			<AuthSwitch question="Já tem conta?" to="/entrar">
				Entrar
			</AuthSwitch>

			<AuthFooter />
		</>
	);
}
