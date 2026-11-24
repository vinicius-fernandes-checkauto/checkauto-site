import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
import type { z } from "zod";

import { getAuthService } from "~/features/auth/api/auth-service";
import {
	AuthField,
	AuthHeading,
	AuthSwitch,
	PasswordField,
	SocialSignIn,
	TermsCheckbox,
	TextLink,
} from "~/features/auth/components/auth-form";
import { RecaptchaV2 } from "~/features/auth/components/recaptcha-v2";
import { signInSchema } from "~/features/auth/lib/auth";
import {
	getRecaptchaV3Token,
	removeRecaptcha,
} from "~/features/auth/lib/recaptcha";
import { signInFailure } from "~/features/auth/lib/sign-in-error";
import { Button } from "~/shared/components/ui/button";
import { legalNav } from "~/shared/content/navigation";
import { useHydrated } from "~/shared/hooks/use-hydrated";
import { readRecaptchaKeys } from "~/shared/lib/env";
import { sessionStore } from "~/shared/lib/session";

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

const RECAPTCHA_ACTION = "login";

function safeRedirect(value: string | null) {
	return value?.startsWith("/conta") ? value : "/conta";
}

export default function SignIn() {
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const [searchParams] = useSearchParams();
	const [formError, setFormError] = useState<string | null>(null);
	const [challenge, setChallenge] = useState(false);
	const [challengeToken, setChallengeToken] = useState<string | null>(null);
	const [challengeKey, setChallengeKey] = useState(0);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(signInSchema),
		defaultValues: { email: "", password: "" },
	});

	async function submit({ email, password }: z.output<typeof signInSchema>) {
		setFormError(null);
		const keys = readRecaptchaKeys();

		if (challenge && !challengeToken) {
			setFormError("Confirme que você não é um robô para continuar.");
			return;
		}

		try {
			const recaptchaToken =
				!challenge && keys.v3
					? await getRecaptchaV3Token(keys.v3, RECAPTCHA_ACTION)
					: undefined;
			const session = await getAuthService().login({
				email,
				password,
				recaptchaToken,
				recaptchaTokenV2: challenge ? (challengeToken ?? undefined) : undefined,
			});
			sessionStore.set(session);
			navigate(safeRedirect(searchParams.get("redirect")), { replace: true });
		} catch (error) {
			const failure = signInFailure(error);
			setFormError(failure.message);
			if (failure.needsChallenge) {
				if (!challenge) removeRecaptcha();
				setChallenge(true);
				setChallengeToken(null);
				setChallengeKey((value) => value + 1);
			}
		}
	}

	const v2Key = readRecaptchaKeys().v2;

	return (
		<>
			<AuthHeading
				title="Entrar"
				description="Acesse sua conta para acompanhar suas consultas, ver relatórios anteriores e fazer novas consultas."
			/>

			<form
				method="post"
				noValidate
				onSubmit={handleSubmit(submit)}
				className="flex flex-col gap-6"
			>
				<div className="flex flex-col gap-3">
					<AuthField
						label="E-mail"
						type="email"
						autoComplete="email"
						error={errors.email?.message}
						{...register("email")}
					/>
					<PasswordField
						autoComplete="current-password"
						error={errors.password?.message}
						{...register("password")}
					/>
					<Link
						to="/redefinir-senha"
						className="self-end px-1.5 text-sm text-muted-foreground transition-colors hover:text-heading"
					>
						Esqueci minha senha?
					</Link>
				</div>

				<TermsCheckbox error={errors.terms?.message} {...register("terms")}>
					Concordo com os{" "}
					<TextLink to={termsLink?.to ?? "/contrato"}>
						termos e condições
					</TextLink>
				</TermsCheckbox>

				{challenge &&
					(v2Key ? (
						<RecaptchaV2
							key={challengeKey}
							siteKey={v2Key}
							action="LOGIN"
							onVerify={setChallengeToken}
						/>
					) : (
						<p className="text-center text-sm text-muted-foreground">
							Verificação de segurança indisponível. Fale com o atendimento.
						</p>
					))}

				{formError && (
					<p
						role="alert"
						className="rounded-2xl bg-destructive/8 px-4 py-3 text-center text-sm font-medium text-destructive"
					>
						{formError}
					</p>
				)}

				<Button
					type="submit"
					className="w-full"
					disabled={!hydrated || isSubmitting}
				>
					{isSubmitting ? "Entrando…" : "Entrar"}
				</Button>
			</form>

			<SocialSignIn action="Entrar" />

			<AuthSwitch question="Não tem conta?" to="/cadastro">
				Criar conta
			</AuthSwitch>
		</>
	);
}
