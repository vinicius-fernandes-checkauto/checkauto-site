import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { setPassword } from "~/domains/auth/services/auth.service";
import {
	type SetPasswordFormValues,
	setPasswordSchema,
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
import { Input } from "~/shared/components/ui/input";
import { fieldErrors, toApiError } from "~/shared/lib/api";

type SetPasswordFormProps = { defaultEmail?: string };

const passwordFields = [
	{ name: "password", label: "Nova senha" },
	{ name: "confirmPassword", label: "Confirmar nova senha" },
] as const;

export function SetPasswordForm({ defaultEmail = "" }: SetPasswordFormProps) {
	const form = useForm({
		resolver: zodResolver(setPasswordSchema),
		defaultValues: { email: defaultEmail, password: "", confirmPassword: "" },
	});

	const navigate = useNavigate();

	async function submit(values: SetPasswordFormValues) {
		try {
			await setPassword(values);
			navigate("/entrar", {
				replace: true,
				state: {
					notice: "Senha criada. Entre com a nova senha.",
					email: values.email,
				},
			});
		} catch (error) {
			const { message, data } = toApiError(error);
			const errors = fieldErrors(data);
			if (errors.password) {
				form.setError("password", { message: errors.password });
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

				<FieldDescription className="px-1.5">
					8 a 16 caracteres, com maiúscula, minúscula, número e símbolo.
				</FieldDescription>
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
				Criar senha
			</FormButton>
		</form>
	);
}
