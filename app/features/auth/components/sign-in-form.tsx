import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { legalNav } from "~/@content/navigation";
import { RecaptchaV2 } from "~/features/auth/components/recaptcha-v2";
import { signIn } from "~/features/auth/lib/auth";
import {
	type SignInFormValues,
	signInSchema,
} from "~/features/auth/lib/auth-schema";
import { loadRecaptcha } from "~/features/auth/lib/recaptcha";
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

const challengeMessages: Record<string, string> = {
	recaptcha_fallback_required:
		"Confirme que você não é um robô para continuar.",
	recaptcha_failed:
		"Não conseguimos confirmar a verificação. Marque a caixa de novo.",
};

const [privacyLink, termsLink] = legalNav;

export function SignInForm() {
	const form = useForm({
		resolver: zodResolver(signInSchema),
		defaultValues: { email: "", password: "" },
	});

	const navigate = useNavigate();

	const [challengeKey, setChallengeKey] = useState(0);
	const [recaptchaV2Token, setRecaptchaV2Token] = useState<string | null>(null);
	const showChallenge = challengeKey > 0;

	const onChallengeError = useCallback(() => {
		form.setError("root", {
			message:
				"Não foi possível carregar a verificação. Recarregue a página e tente de novo.",
		});
	}, [form]);

	async function submit({ email, password }: SignInFormValues) {
		if (showChallenge && !recaptchaV2Token) {
			form.setError("root", { message: "Confirme que você não é um robô." });
			return;
		}

		try {
			await signIn("credentials", {
				email,
				password,
				recaptchaV2Token: recaptchaV2Token ?? undefined,
			});
			navigate("/conta", { replace: true });
		} catch (error) {
			const { code, message } = toApiError(error);
			if (showChallenge || code === "recaptcha_fallback_required") {
				setRecaptchaV2Token(null);
				setChallengeKey((key) => key + 1);
			}
			form.setError("root", {
				message: challengeMessages[code ?? ""] ?? message,
			});
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
					className="inline-flex min-h-11 items-center self-end px-1.5 text-sm text-muted-foreground transition-colors hover:text-heading"
				>
					Esqueci minha senha?
				</Link>
			</FieldGroup>

			{showChallenge && (
				<RecaptchaV2
					key={challengeKey}
					onChange={setRecaptchaV2Token}
					onError={onChallengeError}
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
