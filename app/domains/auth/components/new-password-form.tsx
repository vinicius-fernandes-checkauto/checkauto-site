import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { resetPassword } from "~/domains/auth/services/auth.service";
import {
	type NewPasswordFormValues,
	newPasswordSchema,
	passwordHint,
} from "~/domains/auth/utils/auth.schema";
import { FormButton } from "~/shared/components/form-button";
import { PasswordInput } from "~/shared/components/password-input";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "~/shared/components/ui/field";
import { fieldErrors, toApiError } from "~/shared/lib/api";

type NewPasswordFormProps = { token: string };

const passwordFields = [
	{ name: "password", label: "Nova senha" },
	{ name: "confirmPassword", label: "Confirmar nova senha" },
] as const;

export function NewPasswordForm({ token }: NewPasswordFormProps) {
	const form = useForm({
		resolver: zodResolver(newPasswordSchema),
		defaultValues: { password: "", confirmPassword: "" },
	});

	const navigate = useNavigate();

	async function submit({ password }: NewPasswordFormValues) {
		try {
			await resetPassword(token, password);
			navigate("/entrar", {
				replace: true,
				state: { notice: "Senha alterada. Entre com a nova senha." },
			});
		} catch (error) {
			const { message, data } = toApiError(error);
			const errors = fieldErrors(data);
			if (errors.password) {
				form.setError(
					"password",
					{ message: errors.password },
					{ shouldFocus: true },
				);
				return;
			}
			form.setError("root", { message });
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
				{passwordFields.map(({ name, label }) => (
					<Controller
						key={name}
						name={name}
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={name} className="sr-only">
									{label}
								</FieldLabel>
								<PasswordInput
									{...field}
									id={name}
									placeholder={label}
									autoComplete="new-password"
									aria-invalid={fieldState.invalid}
									aria-describedby={
										fieldState.error ? `${name}-error` : undefined
									}
								/>
								{fieldState.error && (
									<FieldError
										id={`${name}-error`}
										errors={[fieldState.error]}
									/>
								)}
							</Field>
						)}
					/>
				))}

				<FieldDescription className="px-1.5">{passwordHint}</FieldDescription>
			</FieldGroup>

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
				Salvar nova senha
			</FormButton>
		</form>
	);
}
