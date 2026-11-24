import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
	AuthField,
	AuthHeading,
	AuthSwitch,
} from "~/features/auth/components/auth-form";
import { resetPasswordSchema } from "~/features/auth/lib/auth";
import { MailIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { useHydrated } from "~/shared/hooks/use-hydrated";

import type { Route } from "./+types/_auth.redefinir-senha";

export const meta: Route.MetaFunction = () => [
	{ title: "Redefinir senha | Checkauto" },
];

export default function ResetPassword() {
	const hydrated = useHydrated();
	const [sentTo, setSentTo] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { email: "" },
	});

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

			<form
				method="post"
				noValidate
				onSubmit={handleSubmit(({ email }) => setSentTo(email))}
				className="flex flex-col gap-6"
			>
				<AuthField
					label="E-mail"
					type="email"
					autoComplete="email"
					error={errors.email?.message}
					{...register("email")}
				/>
				<Button type="submit" className="w-full" disabled={!hydrated}>
					Enviar link
				</Button>
			</form>

			<AuthSwitch question="Lembrou a senha?" to="/entrar">
				Entrar
			</AuthSwitch>
		</>
	);
}
