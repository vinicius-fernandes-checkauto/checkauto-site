import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
	AuthField,
	AuthHeading,
	AuthSwitch,
	PasswordField,
	SocialSignIn,
	TermsCheckbox,
	TextLink,
} from "~/features/auth/components/auth-form";
import { formatCpf, signUpSchema } from "~/features/auth/lib/auth";
import { Button } from "~/shared/components/ui/button";
import { legalNav } from "~/shared/config/navigation";
import { withMask } from "~/shared/lib/form";

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
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: { name: "", email: "", cpf: "", password: "" },
	});

	return (
		<>
			<AuthHeading
				title="Crie sua conta"
				description="Leva menos de um minuto. Endereço só se você precisar de nota fiscal."
			/>

			<form
				noValidate
				onSubmit={handleSubmit(() => {})}
				className="flex flex-col gap-6"
			>
				<div className="flex flex-col gap-3">
					<AuthField
						label="Nome completo"
						autoComplete="name"
						error={errors.name?.message}
						{...register("name")}
					/>
					<AuthField
						label="E-mail"
						type="email"
						autoComplete="email"
						error={errors.email?.message}
						{...register("email")}
					/>
					<AuthField
						label="CPF"
						inputMode="numeric"
						autoComplete="off"
						error={errors.cpf?.message}
						{...withMask(register("cpf"), formatCpf)}
					/>
					<PasswordField
						autoComplete="new-password"
						maxLength={16}
						error={errors.password?.message}
						{...register("password")}
					/>
					<p className="px-1.5 text-xs/4.5 text-muted-foreground">
						8 a 16 caracteres, com maiúscula, minúscula, número e símbolo.
					</p>
				</div>

				<TermsCheckbox error={errors.terms?.message} {...register("terms")}>
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
