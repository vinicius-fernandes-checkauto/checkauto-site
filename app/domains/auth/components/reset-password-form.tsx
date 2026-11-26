import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { resetPasswordSchema } from "~/domains/auth/utils/auth.schema";
import { FormButton } from "~/shared/components/form-button";
import { TextLink } from "~/shared/components/text-link";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "~/shared/components/ui/field";
import { Input } from "~/shared/components/ui/input";
import { toApiError } from "~/shared/lib/api";

type ResetPasswordFormProps = {
	onSubmit: (email: string) => Promise<void>;
};

export function ResetPasswordForm({ onSubmit }: ResetPasswordFormProps) {
	const form = useForm({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { email: "" },
	});

	const [googleAccount, setGoogleAccount] = useState(false);

	async function submit(email: string) {
		setGoogleAccount(false);
		try {
			await onSubmit(email);
		} catch (error) {
			const { code, message } = toApiError(error);
			setGoogleAccount(code === "google_account");
			form.setError("root", { message });
		}
	}

	return (
		<form
			noValidate
			onSubmit={form.handleSubmit(({ email }) => submit(email))}
			className="flex flex-col gap-5"
		>
			<FieldGroup>
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
								placeholder="E-mail"
								autoComplete="email"
								aria-invalid={fieldState.invalid}
								aria-describedby={fieldState.error ? "email-error" : undefined}
							/>
							{fieldState.error && (
								<FieldError id="email-error" errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
			</FieldGroup>

			{form.formState.errors.root && (
				<div className="flex flex-col items-center gap-2">
					<FieldError
						className="text-center"
						errors={[form.formState.errors.root]}
					/>
					{googleAccount && (
						<TextLink to="/entrar">Entrar com o Google</TextLink>
					)}
				</div>
			)}

			<FormButton
				isSubmitting={form.formState.isSubmitting}
				submittingText="Enviando…"
			>
				Enviar e-mail
			</FormButton>
		</form>
	);
}
