import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, type FieldPath, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { legalNav } from "~/content/navigation";
import {
	PersonFields,
	profileApiFields,
} from "~/domains/auth/components/profile-fields";
import { StepIndicator } from "~/domains/auth/components/step-indicator";
import {
	type FormStep,
	useFormSteps,
} from "~/domains/auth/hooks/use-form-steps";
import {
	completeGoogleSignUp,
	redirectAfterSignIn,
} from "~/domains/auth/services/auth.service";
import {
	type CompleteProfileFormValues,
	completeProfileSchema,
} from "~/domains/auth/utils/auth.schema";
import { readPendingGoogleSignUp } from "~/domains/auth/utils/google-identity";
import { AddressFields } from "~/shared/components/address-fields";
import { FormButton } from "~/shared/components/form-button";
import { TextLink } from "~/shared/components/text-link";
import { Button } from "~/shared/components/ui/button";
import { Checkbox } from "~/shared/components/ui/checkbox";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "~/shared/components/ui/field";
import { Input } from "~/shared/components/ui/input";
import { fieldErrors, toApiError } from "~/shared/lib/api";

type FormValues = CompleteProfileFormValues;

const apiFields: Record<string, FieldPath<FormValues>> = {
	...profileApiFields,
	terms_version: "terms",
};

const restartCodes = new Set([
	"google_already_registered",
	"google_token_invalid",
	"google_email_not_verified",
]);

const termsLink = legalNav.find(({ label }) => label === "Termos de compra");

const steps: FormStep<FormValues>[] = [
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

export function CompleteProfileForm() {
	const [pending] = useState(readPendingGoogleSignUp);
	const navigate = useNavigate();

	const form = useForm<FormValues>({
		resolver: zodResolver(completeProfileSchema),
		defaultValues: {
			personType: "pf",
			firstName: pending?.firstName ?? "",
			lastName: pending?.lastName ?? "",
			cpf: "",
			cnpj: "",
			corporateName: "",
			fantasyName: "",
			phone: "",
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

	const { step, isLast, titles, nextStep, previousStep, goToFields } =
		useFormSteps(form, steps);

	async function submit(values: FormValues) {
		try {
			const session = await completeGoogleSignUp(values);
			navigate(redirectAfterSignIn(session), { replace: true });
		} catch (error) {
			const { code, message, data } = toApiError(error);
			if (restartCodes.has(code ?? "")) {
				navigate("/entrar", {
					replace: true,
					state: {
						notice:
							code === "google_already_registered"
								? "Essa conta Google já tem cadastro. Entre com o Google."
								: message,
					},
				});
				return;
			}

			const errors = Object.entries(fieldErrors(data)).filter(
				([field]) => field in apiFields,
			);
			for (const [field, fieldMessage] of errors) {
				form.setError(apiFields[field], { message: fieldMessage });
			}
			goToFields(errors.map(([field]) => apiFields[field]));
			if (errors.length === 0) form.setError("root", { message });
		}
	}

	return (
		<form
			method="post"
			noValidate
			onSubmit={
				isLast
					? form.handleSubmit(submit)
					: (event) => {
							event.preventDefault();
							void nextStep();
						}
			}
			className="flex flex-col gap-6"
		>
			<StepIndicator titles={titles} current={step} />

			{step === 0 && (
				<>
					{pending?.email && (
						<Field>
							<FieldLabel htmlFor="google-email">E-mail do Google</FieldLabel>
							<Input
								id="google-email"
								value={pending.email}
								readOnly
								disabled
							/>
						</Field>
					)}

					<PersonFields form={form} />
				</>
			)}

			{isLast && (
				<>
					<AddressFields form={form} showLegend={false} />

					<FieldGroup className="gap-3">
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
												Aceito os
											</FieldLabel>
											<TextLink newTab to={termsLink?.to ?? "/contrato"}>
												termos de compra
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
					</FieldGroup>
				</>
			)}

			{form.formState.errors.root && (
				<FieldError
					className="text-center"
					errors={[form.formState.errors.root]}
				/>
			)}

			<div className="flex flex-col gap-2">
				{isLast ? (
					<FormButton
						isSubmitting={form.formState.isSubmitting}
						submittingText="Criando conta…"
					>
						Concluir cadastro
					</FormButton>
				) : (
					<FormButton>Continuar</FormButton>
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
	);
}
