import type { FormEvent } from "react";

import {
	AuthField,
	AuthHeading,
	AuthSwitch,
	PasswordField,
	SocialSignIn,
	TermsCheckbox,
	TextLink,
} from "~/features/auth/components/auth-form";
import { Button } from "~/shared/components/ui/button";
import { legalNav } from "~/shared/config/navigation";

import type { Route } from "./+types/_auth.cadastro";

export const meta: Route.MetaFunction = () => [
	{ title: "Criar conta | Checkauto" },
	{
		name: "description",
		content:
			"Crie sua conta Checkauto em menos de um minuto e consulte o histórico de qualquer veículo.",
	},
];

const termsLink = legalNav.find(({ label }) => label === "Termos de compra");
const privacyLink = legalNav.find(
	({ label }) => label === "Política de privacidade",
);

export default function SignUp() {
	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
	}

	return (
		<>
			<AuthHeading
				title="Crie sua conta"
				description="Leva menos de um minuto. Endereço só se você precisar de nota fiscal."
			/>

			<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				<div className="flex flex-col gap-3">
					<AuthField
						label="Nome completo"
						name="nome"
						autoComplete="name"
						required
					/>
					<AuthField
						label="E-mail"
						type="email"
						name="email"
						autoComplete="email"
						required
					/>
					<AuthField
						label="CPF"
						name="cpf"
						inputMode="numeric"
						autoComplete="off"
						required
					/>
					<PasswordField
						name="senha"
						autoComplete="new-password"
						minLength={8}
						maxLength={16}
						required
					/>
					<p className="px-1.5 text-xs/4.5 text-muted-foreground">
						8 a 16 caracteres, com maiúscula, minúscula, número e símbolo.
					</p>
				</div>

				<TermsCheckbox>
					Aceito os{" "}
					<TextLink to={termsLink?.to ?? "/contrato"}>
						Termos de compra
					</TextLink>{" "}
					e a{" "}
					<TextLink to={privacyLink?.to ?? "/politica-de-privacidade"}>
						Política de privacidade
					</TextLink>
				</TermsCheckbox>

				<Button type="submit" className="w-full">
					Criar conta
				</Button>
			</form>

			<SocialSignIn action="Criar conta" />

			<AuthSwitch question="Já tem conta?" to="/entrar">
				Entrar
			</AuthSwitch>
		</>
	);
}
