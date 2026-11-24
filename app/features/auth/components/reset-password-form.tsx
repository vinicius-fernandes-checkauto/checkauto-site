import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { resetPasswordSchema } from "~/features/auth/lib/auth-schema";
import { Button } from "~/shared/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "~/shared/components/ui/field";
import { Input } from "~/shared/components/ui/input";

type ResetPasswordFormProps = {
	onSubmit: (email: string) => void;
};

export function ResetPasswordForm({ onSubmit }: ResetPasswordFormProps) {
	const form = useForm({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { email: "" },
	});

	return (
		<form
			noValidate
			onSubmit={form.handleSubmit(({ email }) => onSubmit(email))}
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

			<Button type="submit" className="w-full">
				Enviar link
			</Button>
		</form>
	);
}
