import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

import {
	AuthHeading,
	AuthHeadingDescription,
	AuthHeadingTitle,
} from "~/domains/auth/components/auth-heading";
import { AuthSwitch } from "~/domains/auth/components/auth-switch";
import { ResetPasswordForm } from "~/domains/auth/components/reset-password-form";
import { forgotPassword } from "~/domains/auth/services/auth.service";
import { MailIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { toApiError } from "~/shared/lib/api";

import type { Route } from "./+types/_auth.redefinir-senha";

export const meta: Route.MetaFunction = () => [
	{ title: "Redefinir senha | Checkauto" },
];

export default function ResetPassword() {
	const [sentTo, setSentTo] = useState<string | null>(null);
	const [resending, setResending] = useState(false);

	async function resend(email: string) {
		setResending(true);
		try {
			await forgotPassword(email);
			toast.success("E-mail reenviado");
		} catch (error) {
			toast.error(toApiError(error).message);
		} finally {
			setResending(false);
		}
	}

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
							Enviamos uma senha provisória para{" "}
							<strong className="font-medium text-heading">{sentTo}</strong>.
							Entre com ela e depois crie a sua senha em Meus dados. Confira
							também a caixa de spam.
						</AuthHeadingDescription>
					</AuthHeading>
				</div>
				<div className="flex flex-col gap-2">
					<Button asChild className="w-full">
						<Link
							to="/entrar"
							state={{
								notice: "Entre com a senha provisória que enviamos por e-mail.",
								email: sentTo,
							}}
						>
							Entrar com a senha provisória
						</Link>
					</Button>
					<Button
						type="button"
						variant="ghost"
						className="w-full"
						disabled={resending}
						onClick={() => void resend(sentTo)}
					>
						{resending ? "Reenviando…" : "Reenviar e-mail"}
					</Button>
				</div>
			</>
		);
	}

	return (
		<>
			<AuthHeading>
				<AuthHeadingTitle>Redefinir senha</AuthHeadingTitle>
				<AuthHeadingDescription>
					Informe o e-mail da sua conta. Enviamos uma senha provisória para você
					entrar e criar uma nova.
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
