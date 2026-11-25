import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { Controller, type FieldPath, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { legalNav } from "~/@content/navigation";
import { RecaptchaV2 } from "~/features/auth/components/recaptcha-v2";
import { useRecaptchaChallenge } from "~/features/auth/hooks/use-recaptcha-challenge";
import { signIn, signUp } from "~/features/auth/lib/auth";
import {
	type CurrentTerms,
	type SignUpFormInput,
	type SignUpFormOutput,
	signUpSchema,
} from "~/features/auth/lib/auth-schema";
import { loadRecaptcha, recaptchaMessage } from "~/features/auth/lib/recaptcha";
import { fetchCurrentTerms } from "~/features/auth/services/auth-service";
import { CpfInput } from "~/shared/components/cpf-input";
import { FormButton } from "~/shared/components/form-button";
import { PasswordInput } from "~/shared/components/password-input";
import { TextLink } from "~/shared/components/text-link";
import { Button } from "~/shared/components/ui/button";
import { Checkbox } from "~/shared/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/shared/components/ui/dialog";
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
	const privacyLink = legalNav.find(
		({ label }) => label === "Política de privacidade",
	);
	const [terms, setTerms] = useState<CurrentTerms | null>(null);
	const [termsError, setTermsError] = useState<string | null>(null);
	const [termsLoading, setTermsLoading] = useState(true);
	const [termsOpen, setTermsOpen] = useState(false);

	const loadTerms = useCallback(async () => {
		setTermsLoading(true);
		try {
			setTerms(await fetchCurrentTerms());
			setTermsError(null);
		} catch (error) {
			setTerms(null);
			setTermsError(toApiError(error).message);
		} finally {
			setTermsLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadTerms();
	}, [loadTerms]);

	async function submit(values: SignUpFormOutput) {
		if (!terms) {
			form.setError("root", {
				message: "Carregue e leia o contrato antes de criar sua conta.",
			});
			return;
		}

		if (challenge.missing) {
			form.setError("root", { message: "Confirme que você não é um robô." });
			return;
		}

		try {
			await signUp({
				...values,
				termsVersion: terms.version,
				recaptchaV2Token: challenge.token ?? undefined,
			});
		} catch (error) {
			const { code, message, data } = toApiError(error);
			if (challenge.active || code === "recaptcha_fallback_required") {
				challenge.restart();
			}

			const errors = fieldErrors(data);
			const termsChanged = Boolean(errors.terms_version);
			if (termsChanged) {
				form.setValue("terms", false, { shouldValidate: true });
				form.setError("root", {
					message:
						"O contrato foi atualizado. Leia e aceite a versão vigente para continuar.",
				});
				await loadTerms();
			}

			const fields = Object.entries(errors).filter(
				([field]) => field in apiFields,
			);
			for (const [field, fieldMessage] of fields) {
				form.setError(apiFields[field], { message: fieldMessage });
			}
			if (fields.length === 0 && !termsChanged) {
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
								disabled={!terms}
								aria-invalid={fieldState.invalid}
								aria-describedby={fieldState.error ? "terms-error" : undefined}
							/>
							<FieldContent className="flex-row flex-wrap gap-1">
								<FieldLabel htmlFor="terms" className="inline-flex font-normal">
									Li e aceito o contrato vigente
									{terms ? ` (${terms.version})` : ""}
								</FieldLabel>
							</FieldContent>
						</div>
						{fieldState.error && (
							<FieldError id="terms-error" errors={[fieldState.error]} />
						)}
					</Field>
				)}
			/>

			{terms && (
				<Dialog open={termsOpen} onOpenChange={setTermsOpen}>
					<DialogTrigger asChild>
						<Button type="button" variant="link" className="self-center">
							Ler contrato {terms.version}
						</Button>
					</DialogTrigger>
					<DialogContent className="max-h-[min(85svh,48rem)] overflow-hidden">
						<DialogHeader>
							<DialogTitle>Contrato de prestação de serviços</DialogTitle>
							<DialogDescription>
								Versão {terms.version}. Leia o texto antes de aceitar.
							</DialogDescription>
						</DialogHeader>
						<div className="max-h-[60svh] overflow-y-auto rounded-2xl border border-border bg-muted p-4 text-sm/6 whitespace-pre-wrap">
							{terms.content}
						</div>
						<DialogFooter>
							<Button
								type="button"
								onClick={() => {
									form.setValue("terms", true, { shouldValidate: true });
									setTermsOpen(false);
								}}
							>
								Li e aceito
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}

			{termsLoading && (
				<p role="status" className="text-center text-sm text-muted-foreground">
					Carregando contrato vigente…
				</p>
			)}

			{termsError && (
				<div className="flex flex-col items-center">
					<p role="alert" className="text-center text-sm text-destructive">
						Não foi possível carregar o contrato: {termsError}
					</p>
					<Button type="button" variant="link" onClick={() => void loadTerms()}>
						Tentar novamente
					</Button>
				</div>
			)}

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

			<p className="text-center text-sm/6 text-muted-foreground">
				Consulte também a{" "}
				<TextLink to={privacyLink?.to ?? "/politica-de-privacidade"}>
					política de privacidade
				</TextLink>
				.
			</p>

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
				disabled={!terms}
			>
				Criar conta
			</FormButton>
		</form>
	);
}
