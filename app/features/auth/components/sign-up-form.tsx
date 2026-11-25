import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type FieldPath, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { legalNav } from "~/@content/navigation";
import { RecaptchaV2 } from "~/features/auth/components/recaptcha-v2";
import { useRecaptchaChallenge } from "~/features/auth/hooks/use-recaptcha-challenge";
import { signIn, signUp } from "~/features/auth/lib/auth";
import {
	type SignUpFormInput,
	type SignUpFormOutput,
	signUpSchema,
} from "~/features/auth/lib/auth-schema";
import { loadRecaptcha, recaptchaMessage } from "~/features/auth/lib/recaptcha";
import { CpfInput } from "~/shared/components/cpf-input";
import { FormButton } from "~/shared/components/form-button";
import { PasswordInput } from "~/shared/components/password-input";
import { TextLink } from "~/shared/components/text-link";
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
import { fieldErrors, toApiError } from "~/shared/lib/api";

const apiFields: Record<string, FieldPath<SignUpFormInput>> = {
	first_name: "name",
	last_name: "name",
	email: "email",
	cpf: "cpf",
	password: "password",
	accept_terms: "terms",
};

export function SignUpForm() {
	const form = useForm<SignUpFormInput, unknown, SignUpFormOutput>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			cpf: "",
			password: "",
			terms: false,
			marketing: false,
		},
	});

	const navigate = useNavigate();
	const challenge = useRecaptchaChallenge();

	async function submit(values: SignUpFormOutput) {
		if (challenge.missing) {
			form.setError("root", { message: "Confirme que você não é um robô." });
			return;
		}

		try {
			await signUp({
				...values,
				recaptchaV2Token: challenge.token ?? undefined,
			});
		} catch (error) {
			const { code, message, data } = toApiError(error);
			if (challenge.active || code === "recaptcha_fallback_required") {
				challenge.restart();
			}

			const fields = Object.entries(fieldErrors(data)).filter(
				([field]) => field in apiFields,
			);
			for (const [field, fieldMessage] of fields) {
				form.setError(apiFields[field], { message: fieldMessage });
			}
			if (fields.length === 0) {
				form.setError("root", { message: recaptchaMessage(code) ?? message });
			}
			return;
		}

		try {
			await signIn("credentials", {
				email: values.email,
				password: values.password,
			});
			navigate("/conta", { replace: true });
		} catch {
			navigate("/entrar", { replace: true });
		}
	}

	const termsLink = legalNav.find(({ label }) => label === "Termos de compra");
	const privacyLink = legalNav.find(
		({ label }) => label === "Política de privacidade",
	);

	return (
		<form
			method="post"
			noValidate
			onSubmit={form.handleSubmit(submit)}
			onFocus={() => {
				loadRecaptcha().catch(() => {});
			}}
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

			<Controller
				name="marketing"
				control={form.control}
				render={({ field }) => (
					<Field orientation="horizontal" className="justify-center">
						<Checkbox
							id="marketing"
							name={field.name}
							checked={field.value}
							onCheckedChange={field.onChange}
							onBlur={field.onBlur}
							ref={field.ref}
						/>
						<FieldLabel htmlFor="marketing" className="font-normal">
							Quero receber novidades e ofertas por e-mail
						</FieldLabel>
					</Field>
				)}
			/>

			{challenge.active && (
				<RecaptchaV2
					key={challenge.key}
					action="SIGNUP"
					onChange={challenge.setToken}
				/>
			)}

			{form.formState.errors.root && (
				<FieldError
					className="text-center"
					errors={[form.formState.errors.root]}
				/>
			)}

			<FormButton
				isSubmitting={form.formState.isSubmitting}
				submittingText="Criando conta…"
			>
				Criar conta
			</FormButton>
		</form>
	);
}
