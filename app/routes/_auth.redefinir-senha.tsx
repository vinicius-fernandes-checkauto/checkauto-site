import { type FormEvent, useState } from "react";

import {
	AuthField,
	AuthHeading,
	AuthSwitch,
} from "~/features/auth/components/auth-form";
import { MailIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";

import type { Route } from "./+types/_auth.redefinir-senha";

export const meta: Route.MetaFunction = () => [
	{ title: "Redefinir senha | Checkauto" },
];

export default function ResetPassword() {
	const [sentTo, setSentTo] = useState<string | null>(null);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const email = new FormData(event.currentTarget).get("email");
		setSentTo(typeof email === "string" ? email : "");
	}

	if (sentTo !== null) {
		return (
			<>
				<span className="flex size-14 items-center justify-center self-center rounded-full bg-accent text-highlight">
					<MailIcon aria-hidden="true" className="size-6" />
				</span>
				<div role="status">
					<AuthHeading
						title="Confira seu e-mail"
						description={
							<>
								Enviamos o link para{" "}
								<strong className="font-medium text-heading">{sentTo}</strong>.
								Não achou? Veja também a caixa de spam.
							</>
						}
					/>
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
			<AuthHeading
				title="Redefinir senha"
				description="Informe o e-mail da sua conta e enviamos um link para criar uma nova senha."
			/>

			<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				<AuthField
					label="E-mail"
					type="email"
					name="email"
					autoComplete="email"
					required
				/>
				<Button type="submit" className="w-full">
					Enviar link
				</Button>
			</form>

			<AuthSwitch question="Lembrou a senha?" to="/entrar">
				Entrar
			</AuthSwitch>
		</>
	);
}
