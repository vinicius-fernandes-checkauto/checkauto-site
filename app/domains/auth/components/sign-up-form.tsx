import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { Controller, type FieldPath, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { getCurrentTerms } from "~/domains/auth/auth.api";
import {
	PersonFields,
	profileApiFields,
} from "~/domains/auth/components/profile-fields";
import { RecaptchaV2 } from "~/domains/auth/components/recaptcha-v2";
import { SocialSignIn } from "~/domains/auth/components/social-sign-in";
import { StepIndicator } from "~/domains/auth/components/step-indicator";
import {
	type FormStep,
	useFormSteps,
} from "~/domains/auth/hooks/use-form-steps";
import { useRecaptchaChallenge } from "~/domains/auth/hooks/use-recaptcha-challenge";
import {
	redirectAfterSignIn,
	signUp,
} from "~/domains/auth/services/auth.service";
import type { CurrentTerms } from "~/domains/auth/types/auth.types";
import {
	passwordHint,
	type SignUpFormValues,
	signUpSchema,
} from "~/domains/auth/utils/auth.schema";
import {
	loadRecaptcha,
	recaptchaMessage,
} from "~/domains/auth/utils/recaptcha";
import { AddressFields } from "~/shared/components/address-fields";
import { FormButton } from "~/shared/components/form-button";
import { PasswordInput } from "~/shared/components/password-input";
import { TextField } from "~/shared/components/text-field";
import { textLinkClassName } from "~/shared/components/text-link";
import { Button } from "~/shared/components/ui/button";
import { Checkbox } from "~/shared/components/ui/checkbox";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "~/shared/components/ui/field";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/shared/components/ui/sheet";
import { fieldErrors, toApiError } from "~/shared/lib/api";
import { cn } from "~/shared/lib/utils";

const apiFields: Record<string, FieldPath<SignUpFormValues>> = {
	...profileApiFields,
	email: "email",
	password: "password",
};

const steps: FormStep<SignUpFormValues>[] = [
	{ title: "Acesso", focus: "email", fields: ["email", "password"] },
	{
		title: "Seus dados",
		focus: "firstName",
		fields: [
			"personType",
			"firstName",
			"lastName",
			"cpf",
			"cnpj",
			"corporateName",
			"fantasyName",
			"phone",
		],
	},
	{
		title: "Endereço",
		focus: "zip",
		fields: [
			"zip",
			"street",
			"number",
			"complement",
			"district",
			"city",
			"state",
			"terms",
			"marketing",
		],
	},
];

export function SignUpForm() {
	const form = useForm<SignUpFormValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			personType: "pf",
			firstName: "",
			lastName: "",
			cpf: "",
			cnpj: "",
			corporateName: "",
			fantasyName: "",
			phone: "",
			email: "",
			password: "",
			zip: "",
			street: "",
			number: "",
			complement: "",
			district: "",
			city: "",
			state: "SP",
			terms: false,
			marketing: false,
		},
	});

	const navigate = useNavigate();
	const challenge = useRecaptchaChallenge();
	const [terms, setTerms] = useState<CurrentTerms | null>(null);
	const [termsError, setTermsError] = useState<string | null>(null);
	const [termsLoading, setTermsLoading] = useState(true);
	const [termsOpen, setTermsOpen] = useState(false);
	const { step, isLast, titles, nextStep, previousStep, goToFields } =
		useFormSteps(form, steps);

	const loadTerms = useCallback(async () => {
		setTermsLoading(true);
		try {
			setTerms(await getCurrentTerms());
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

	async function submit(values: SignUpFormValues) {
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

		let session: Awaited<ReturnType<typeof signUp>>;
		try {
			session = await signUp({
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
			goToFields(fields.map(([field]) => apiFields[field]));
			if (fields.length === 0 && !termsChanged) {
				form.setError("root", { message: recaptchaMessage(code) ?? message });
			}
			return;
		}

		if (session) {
			navigate(redirectAfterSignIn(session), { replace: true });
			return;
		}
		navigate("/entrar", {
			replace: true,
			state: {
				notice: "Conta criada. Entre com seu e-mail e senha.",
				email: values.email,
			},
		});
	}

	return (
		<>
			{step === 0 && <SocialSignIn action="Criar conta" />}

			<form
				method="post"
				noValidate
				onSubmit={
					!isLast
						? (event) => {
								event.preventDefault();
								void nextStep();
							}
						: form.handleSubmit(submit)
				}
				onFocus={() => {
					loadRecaptcha().catch(() => {});
				}}
				className="flex flex-col gap-6"
			>
				<StepIndicator titles={titles} current={step} />

				{step === 0 && (
					<FieldGroup className="gap-3">
						<TextField
							form={form}
							name="email"
							label="E-mail"
							type="email"
							autoComplete="email"
						/>
						<TextField
							form={form}
							name="password"
							label="Senha"
							as={PasswordInput}
							autoComplete="new-password"
							maxLength={16}
							description={passwordHint}
						/>
					</FieldGroup>
				)}

				{step === 1 && <PersonFields form={form} />}

				{isLast && (
					<>
						<AddressFields form={form} showLegend={false} />

						<Sheet open={termsOpen} onOpenChange={setTermsOpen}>
							<Controller
								name="terms"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<div className="flex items-start gap-2.5">
											<Checkbox
												id="terms"
												name={field.name}
												checked={field.value}
												onCheckedChange={field.onChange}
												onBlur={field.onBlur}
												ref={field.ref}
												disabled={!terms}
												aria-invalid={fieldState.invalid}
												aria-describedby={
													fieldState.error ? "terms-error" : undefined
												}
											/>
											<FieldContent className="flex-row flex-wrap gap-1">
												<FieldLabel
													htmlFor="terms"
													className="inline-flex font-normal"
												>
													Li e aceito o
												</FieldLabel>
												{terms ? (
													<SheetTrigger asChild>
														<button
															type="button"
															className={cn(textLinkClassName, "text-sm")}
														>
															contrato vigente ({terms.version})
														</button>
													</SheetTrigger>
												) : (
													<span className="text-sm">contrato vigente</span>
												)}
											</FieldContent>
										</div>
										{fieldState.error && (
											<FieldError
												id="terms-error"
												errors={[fieldState.error]}
											/>
										)}
									</Field>
								)}
							/>

							{terms && (
								<SheetContent
									side="bottom"
									className="data-[side=bottom]:h-[92svh]"
								>
									<div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
										<SheetHeader className="pr-16">
											<SheetTitle>Contrato de prestação de serviços</SheetTitle>
											<SheetDescription>
												Versão {terms.version}. Leia o texto antes de aceitar.
											</SheetDescription>
										</SheetHeader>
										<div className="mx-6 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-border bg-muted p-5 text-base/7 wrap-break-word whitespace-pre-wrap">
											{terms.content}
										</div>
										<SheetFooter className="sm:flex-row sm:justify-end">
											<Button
												type="button"
												onClick={() => {
													form.setValue("terms", true, {
														shouldValidate: true,
													});
													setTermsOpen(false);
												}}
											>
												Li e aceito
											</Button>
										</SheetFooter>
									</div>
								</SheetContent>
							)}
						</Sheet>

						{termsLoading && (
							<p
								role="status"
								className="text-center text-sm text-muted-foreground"
							>
								Carregando contrato vigente…
							</p>
						)}

						{termsError && (
							<div className="flex flex-col items-center">
								<p
									role="alert"
									className="text-center text-sm text-destructive"
								>
									Não foi possível carregar o contrato: {termsError}
								</p>
								<Button
									type="button"
									variant="link"
									onClick={() => void loadTerms()}
								>
									Tentar novamente
								</Button>
							</div>
						)}

						<Controller
							name="marketing"
							control={form.control}
							render={({ field }) => (
								<Field orientation="horizontal">
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
					</>
				)}

				<div className="flex flex-col gap-2">
					{!isLast ? (
						<FormButton>Continuar</FormButton>
					) : (
						<FormButton
							isSubmitting={form.formState.isSubmitting}
							submittingText="Criando conta…"
							disabled={!terms}
						>
							Criar conta
						</FormButton>
					)}
					{step > 0 && (
						<Button
							type="button"
							variant="ghost"
							className="w-full"
							disabled={form.formState.isSubmitting}
							onClick={previousStep}
						>
							Voltar
						</Button>
					)}
				</div>
			</form>
		</>
	);
}
