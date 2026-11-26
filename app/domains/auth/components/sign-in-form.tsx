import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { legalNav } from "~/content/navigation";
import { RecaptchaV2 } from "~/domains/auth/components/recaptcha-v2";
import { useRecaptchaChallenge } from "~/domains/auth/hooks/use-recaptcha-challenge";
import {
	redirectAfterSignIn,
	signIn,
} from "~/domains/auth/services/auth.service";
import {
	type SignInFormValues,
	signInSchema,
} from "~/domains/auth/utils/auth.schema";
import {
	loadRecaptcha,
	recaptchaMessage,
} from "~/domains/auth/utils/recaptcha";
import { FormButton } from "~/shared/components/form-button";
import { PasswordInput } from "~/shared/components/password-input";
import { TextLink } from "~/shared/components/text-link";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "~/shared/components/ui/field";
import { Input } from "~/shared/components/ui/input";
import { toApiError } from "~/shared/lib/api";

const [privacyLink, termsLink] = legalNav;

type SignInFormProps = { defaultEmail?: string };

export function SignInForm({ defaultEmail = "" }: SignInFormProps) {
	const form = useForm({
		resolver: zodResolver(signInSchema),
		defaultValues: { email: defaultEmail, password: "" },
	});

	const navigate = useNavigate();

	const challenge = useRecaptchaChallenge();

	async function submit({ email, password }: SignInFormValues) {
		if (challenge.missing) {
			form.setError("root", { message: "Confirme que você não é um robô." });
			return;
		}

		try {
			const session = await signIn("credentials", {
				email,
				password,
				recaptchaV2Token: challenge.token ?? undefined,
			});
			navigate(redirectAfterSignIn(session), { replace: true });
		} catch (error) {
			const { code, message } = toApiError(error);
			if (challenge.active || code === "recaptcha_fallback_required") {
				challenge.restart();
			}
			form.setError("root", { message: recaptchaMessage(code) ?? message });
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
									fieldState.error ? "password-error" : undefined
								}
								placeholder="Senha"
								autoComplete="current-password"
							/>
							{fieldState.error && (
								<FieldError id="password-error" errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>

				<Link
					to="/redefinir-senha"
					className="inline-flex min-h-11 items-center self-end px-1.5 text-sm font-medium text-heading hover:underline hover:underline-offset-4"
				>
					Esqueci minha senha?
				</Link>
			</FieldGroup>

			{challenge.active && (
				<RecaptchaV2
					key={challenge.key}
					action="LOGIN"
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
				submittingText="Entrando…"
			>
				Entrar
			</FormButton>

			<p className="text-center text-sm/6 text-muted-foreground">
				Ao entrar, você concorda com os{" "}
				<TextLink to={termsLink.to}>termos de compra</TextLink> e a{" "}
				<TextLink to={privacyLink.to}>política de privacidade</TextLink>.
			</p>
		</form>
	);
}
