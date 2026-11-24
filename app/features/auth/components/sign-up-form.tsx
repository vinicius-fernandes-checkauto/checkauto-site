import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { legalNav } from "~/@content/navigation";
import {
	type SignUpFormInput,
	type SignUpFormOutput,
	signUpSchema,
} from "~/features/auth/lib/auth-schema";
import { CpfInput } from "~/shared/components/cpf-input";
import { PasswordInput } from "~/shared/components/password-input";
import { TextLink } from "~/shared/components/text-link";
import { Button } from "~/shared/components/ui/button";
import { Checkbox } from "~/shared/components/ui/checkbox";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "~/shared/components/ui/field";
import { Input } from "~/shared/components/ui/input";

export function SignUpForm() {
	const form = useForm<SignUpFormInput, unknown, SignUpFormOutput>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			cpf: "",
			password: "",
			terms: false,
		},
	});

	const termsLink = legalNav.find(({ label }) => label === "Termos de compra");
	const privacyLink = legalNav.find(
		({ label }) => label === "Política de privacidade",
	);

	return (
		<form
			noValidate
			onSubmit={form.handleSubmit(() => {})}
			className="flex flex-col gap-5"
		>
			<FieldGroup className="gap-3">
				<Controller
					name="name"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="name" className="sr-only">
								Nome completo
							</FieldLabel>
							<Input
								{...field}
								id="name"
								aria-invalid={fieldState.invalid}
								aria-describedby={fieldState.error ? "name-error" : undefined}
								placeholder="Nome completo"
								autoComplete="name"
							/>
							{fieldState.error && (
								<FieldError id="name-error" errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>

				<Controller
					name="email"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="email" className="sr-only">
								E-mail
							</FieldLabel>
							<Input
								{...field}
								id="email"
								type="email"
								aria-invalid={fieldState.invalid}
								aria-describedby={fieldState.error ? "email-error" : undefined}
								placeholder="E-mail"
								autoComplete="email"
							/>
							{fieldState.error && (
								<FieldError id="email-error" errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>

				<Controller
					name="cpf"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="cpf" className="sr-only">
								CPF
							</FieldLabel>
							<CpfInput
								{...field}
								id="cpf"
								inputMode="numeric"
								autoComplete="off"
								aria-invalid={fieldState.invalid}
								aria-describedby={fieldState.error ? "cpf-error" : undefined}
								placeholder="CPF"
							/>
							{fieldState.error && (
								<FieldError id="cpf-error" errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>

				<Controller
					name="password"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="password" className="sr-only">
								Senha
							</FieldLabel>
							<PasswordInput
								{...field}
								id="password"
								aria-invalid={fieldState.invalid}
								aria-describedby={
									fieldState.error
										? "password-description password-error"
										: "password-description"
								}
								placeholder="Senha"
								autoComplete="new-password"
								maxLength={16}
							/>
							<FieldDescription id="password-description" className="px-1.5">
								8 a 16 caracteres, com maiúscula, minúscula, número e símbolo.
							</FieldDescription>
							{fieldState.error && (
								<FieldError id="password-error" errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
			</FieldGroup>

			<Controller
				name="terms"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<div className="flex items-start justify-center gap-2.5">
							<Checkbox
								id="terms"
								name={field.name}
								checked={field.value}
								onCheckedChange={field.onChange}
								onBlur={field.onBlur}
								ref={field.ref}
								aria-invalid={fieldState.invalid}
								aria-describedby={fieldState.error ? "terms-error" : undefined}
							/>
							<FieldContent className="flex-row flex-wrap gap-1">
								<FieldLabel htmlFor="terms" className="inline-flex font-normal">
									Aceito os
								</FieldLabel>
								<TextLink to={termsLink?.to ?? "/contrato"}>
									Termos de compra
								</TextLink>
								<span>e a</span>
								<TextLink to={privacyLink?.to ?? "/politica-de-privacidade"}>
									Política de privacidade
								</TextLink>
							</FieldContent>
						</div>
						{fieldState.error && (
							<FieldError id="terms-error" errors={[fieldState.error]} />
						)}
					</Field>
				)}
			/>

			<Button type="submit" className="w-full">
				Criar conta
			</Button>
		</form>
	);
}
