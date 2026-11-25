import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { legalNav } from "~/content/navigation";
import {
	completeProfile,
	redirectAfterSignIn,
} from "~/domains/auth/services/auth.service";
import {
	type CompleteProfileFormInput,
	type CompleteProfileFormOutput,
	completeProfileSchema,
} from "~/domains/auth/utils/auth.schema";
import { CpfInput } from "~/shared/components/cpf-input";
import { FormButton } from "~/shared/components/form-button";
import { PhoneInput } from "~/shared/components/phone-input";
import { TextLink } from "~/shared/components/text-link";
import { Checkbox } from "~/shared/components/ui/checkbox";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "~/shared/components/ui/field";
import { toApiError } from "~/shared/lib/api";

const termsLink = legalNav.find(({ label }) => label === "Termos de compra");

export function CompleteProfileForm() {
	const form = useForm<
		CompleteProfileFormInput,
		unknown,
		CompleteProfileFormOutput
	>({
		resolver: zodResolver(completeProfileSchema),
		defaultValues: { cpf: "", phone: "", terms: false },
	});

	const navigate = useNavigate();

	async function submit(values: CompleteProfileFormOutput) {
		try {
			const session = await completeProfile(values);
			navigate(redirectAfterSignIn(session), { replace: true });
		} catch (error) {
			form.setError("root", { message: toApiError(error).message });
		}
	}

	return (
		<form
			method="post"
			noValidate
			onSubmit={form.handleSubmit(submit)}
			className="flex flex-col gap-5"
		>
			<FieldGroup className="gap-3">
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
					name="phone"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="phone" className="sr-only">
								Telefone
							</FieldLabel>
							<PhoneInput
								{...field}
								id="phone"
								type="tel"
								inputMode="numeric"
								autoComplete="tel-national"
								aria-invalid={fieldState.invalid}
								aria-describedby={fieldState.error ? "phone-error" : undefined}
								placeholder="Telefone com DDD"
							/>
							{fieldState.error && (
								<FieldError id="phone-error" errors={[fieldState.error]} />
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

			{form.formState.errors.root && (
				<FieldError
					className="text-center"
					errors={[form.formState.errors.root]}
				/>
			)}

			<FormButton
				isSubmitting={form.formState.isSubmitting}
				submittingText="Salvando…"
			>
				Concluir cadastro
			</FormButton>
		</form>
	);
}
