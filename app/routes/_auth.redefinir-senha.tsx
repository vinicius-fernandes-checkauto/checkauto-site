import { useState } from "react";

import {
	AuthHeading,
	AuthHeadingDescription,
	AuthHeadingTitle,
} from "~/features/auth/components/auth-heading";
import { AuthSwitch } from "~/features/auth/components/auth-switch";
import { ResetPasswordForm } from "~/features/auth/components/reset-password-form";
import { forgotPassword } from "~/features/auth/lib/auth";
import { MailIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";

import type { Route } from "./+types/_auth.redefinir-senha";

export const meta: Route.MetaFunction = () => [
	{ title: "Redefinir senha | Checkauto" },
];

export default function ResetPassword() {
	const [sentTo, setSentTo] = useState<string | null>(null);

	if (sentTo !== null) {
		return (
			<>
				<span className="flex size-14 items-center justify-center self-center rounded-full bg-accent text-highlight">
					<MailIcon aria-hidden="true" className="size-6" />
				</span>
				<div role="status">
					<AuthHeading>
						<AuthHeadingTitle>Confira seu e-mail</AuthHeadingTitle>
						<AuthHeadingDescription>
							Se houver uma conta cadastrada, enviaremos instruções para{" "}
							<strong className="font-medium text-heading">{sentTo}</strong>.
							Confira também a caixa de spam.
						</AuthHeadingDescription>
					</AuthHeading>
				</div>
				<Button
					type="button"
					className="w-full"
					onClick={() => setSentTo(null)}
				>
					Reenviar e-mail
				</Button>
				<AuthSwitch question="Lembrou a senha?" to="/entrar">
					Entrar
				</AuthSwitch>
			</>
		);
	}

	return (
		<>
			<AuthHeading>
				<AuthHeadingTitle>Redefinir senha</AuthHeadingTitle>
				<AuthHeadingDescription>
					Informe o e-mail da sua conta para receber instruções de redefinição
					de senha.
				</AuthHeadingDescription>
			</AuthHeading>

			<ResetPasswordForm
				onSubmit={async (email) => {
					await forgotPassword(email);
					setSentTo(email);
				}}
			/>

			<AuthSwitch question="Lembrou a senha?" to="/entrar">
				Entrar
			</AuthSwitch>
		</>
	);
}
