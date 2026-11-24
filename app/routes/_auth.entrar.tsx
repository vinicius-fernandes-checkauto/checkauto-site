import {
	AuthHeading,
	AuthHeadingDescription,
	AuthHeadingTitle,
} from "~/features/auth/components/auth-heading";
import { AuthSwitch } from "~/features/auth/components/auth-switch";
import { SignInForm } from "~/features/auth/components/sign-in-form";
import { SocialSignIn } from "~/features/auth/components/social-sign-in";

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
