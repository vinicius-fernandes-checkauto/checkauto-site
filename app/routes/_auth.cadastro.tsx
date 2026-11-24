import {
	AuthHeading,
	AuthHeadingDescription,
	AuthHeadingTitle,
} from "~/features/auth/components/auth-heading";
import { AuthSwitch } from "~/features/auth/components/auth-switch";
import { SignUpForm } from "~/features/auth/components/sign-up-form";
import { SocialSignIn } from "~/features/auth/components/social-sign-in";

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
