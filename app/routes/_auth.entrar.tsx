import type { FormEvent } from "react";
import { Link } from "react-router";

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

import type { Route } from "./+types/_auth.entrar";

export const meta: Route.MetaFunction = () => [
	{ title: "Entrar | Checkauto" },
	{
		name: "description",
		content:
			"Acesse sua conta Checkauto para acompanhar suas consultas e ver relatórios anteriores.",
	},
];

const termsLink = legalNav.find(({ label }) => label === "Termos de compra");

export default function SignIn() {
	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
	}

	return (
		<>
			<AuthHeading
				title="Entrar"
				description="Acesse sua conta para acompanhar suas consultas, ver relatórios anteriores e fazer novas consultas."
			/>

			<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				<div className="flex flex-col gap-3">
					<AuthField
						label="E-mail"
						type="email"
						name="email"
						autoComplete="email"
						required
					/>
					<PasswordField
						name="senha"
						autoComplete="current-password"
						required
					/>
					<Link
						to="/redefinir-senha"
						className="self-end px-1.5 text-sm text-muted-foreground transition-colors hover:text-heading"
					>
						Esqueci minha senha?
					</Link>
				</div>

				<TermsCheckbox>
					Concordo com os{" "}
					<TextLink to={termsLink?.to ?? "/contrato"}>
						termos e condições
					</TextLink>
				</TermsCheckbox>

				<Button type="submit" className="w-full">
					Entrar
				</Button>
			</form>

			<SocialSignIn action="Entrar" />

			<AuthSwitch question="Não tem conta?" to="/cadastro">
				Criar conta
			</AuthSwitch>
		</>
	);
}
