import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import {
	type PasswordField,
	type PasswordFormValues,
	passwordSchema,
} from "~/domains/account/utils/account.schema";
import { changePassword } from "~/domains/auth/services/auth.service";
import { FormButton } from "~/shared/components/form-button";
import { PasswordInput } from "~/shared/components/password-input";
import { Button } from "~/shared/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/shared/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "~/shared/components/ui/field";
import { fieldErrors, toApiError } from "~/shared/lib/api";

type ChangePasswordDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function ChangePasswordDialog({
	open,
	onOpenChange,
}: ChangePasswordDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:p-8">
				{open && <ChangePasswordForm />}
			</DialogContent>
		</Dialog>
	);
}

const fields = [
	{ name: "currentPassword", label: "Senha atual", auto: "current-password" },
	{ name: "newPassword", label: "Nova senha", auto: "new-password" },
	{
		name: "confirmPassword",
		label: "Confirmar nova senha",
		auto: "new-password",
	},
] as const;

const apiFields: Record<string, PasswordField> = {
	current_password: "currentPassword",
	new_password: "newPassword",
	new_password_again: "confirmPassword",
};

function ChangePasswordForm() {
	const baseId = useId();
	const navigate = useNavigate();
	const form = useForm({
		resolver: zodResolver(passwordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const fieldId = (field: PasswordField) => `${baseId}-${field}`;

	async function submit(values: PasswordFormValues) {
		try {
			await changePassword(values);
			navigate("/entrar", {
				replace: true,
				state: { notice: "Senha alterada. Entre com a nova senha." },
			});
		} catch (error) {
			const { message, data } = toApiError(error);
			const errors = Object.entries(fieldErrors(data)).filter(
				([field]) => field in apiFields,
			);
			for (const [field, fieldMessage] of errors) {
				form.setError(apiFields[field], { message: fieldMessage });
			}
			if (errors.length === 0) form.setError("root", { message });
		}
	}

	return (
		<>
			<DialogHeader className="pr-12">
				<DialogTitle>Alterar senha</DialogTitle>
				<DialogDescription className="text-base/6">
					Use de 8 a 16 caracteres, com maiúscula, minúscula, número e símbolo.
					Depois de alterar, entre de novo com a nova senha.
				</DialogDescription>
			</DialogHeader>
			<form
				noValidate
				onSubmit={form.handleSubmit(submit)}
				className="flex flex-col gap-6"
			>
				<FieldGroup className="gap-4">
					{fields.map(({ name, label, auto }) => (
						<Controller
							key={name}
							name={name}
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={fieldId(name)}>{label}</FieldLabel>
									<PasswordInput
										{...field}
										id={fieldId(name)}
										autoComplete={auto}
										aria-invalid={fieldState.invalid}
										aria-describedby={
											fieldState.error ? `${fieldId(name)}-error` : undefined
										}
									/>
									{fieldState.error && (
										<FieldError
											id={`${fieldId(name)}-error`}
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
					))}
				</FieldGroup>
				{form.formState.errors.root && (
					<FieldError errors={[form.formState.errors.root]} />
				)}
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline" size="sm">
							Cancelar
						</Button>
					</DialogClose>
					<FormButton
						size="sm"
						className="w-auto sm:min-w-36"
						isSubmitting={form.formState.isSubmitting}
						submittingText="Alterando…"
					>
						Alterar senha
					</FormButton>
				</DialogFooter>
			</form>
		</>
	);
}
