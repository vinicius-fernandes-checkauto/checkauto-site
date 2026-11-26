import { useLocation } from "react-router";

import {
	AuthHeading,
	AuthHeadingDescription,
	AuthHeadingTitle,
} from "~/domains/auth/components/auth-heading";
import { AuthSwitch } from "~/domains/auth/components/auth-switch";
import { SetPasswordForm } from "~/domains/auth/components/set-password-form";
import { readEmail } from "~/domains/auth/utils/notice";

import type { Route } from "./+types/_auth.definir-senha";

export const meta: Route.MetaFunction = () => [
	{ title: "Criar senha | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export default function SetPassword() {
	const location = useLocation();

	return (
		<>
			<AuthHeading>
				<AuthHeadingTitle>Crie sua senha</AuthHeadingTitle>
				<AuthHeadingDescription>
					Sua conta veio do site anterior. Crie uma senha nova para continuar.
				</AuthHeadingDescription>
			</AuthHeading>

			<SetPasswordForm defaultEmail={readEmail(location.state)} />

			<AuthSwitch question="Já tem senha?" to="/entrar">
				Entrar
			</AuthSwitch>
		</>
	);
}
