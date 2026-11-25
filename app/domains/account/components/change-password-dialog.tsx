import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import {
	type PasswordField,
	passwordSchema,
} from "~/domains/account/utils/account.schema";
import { CircleCheckIcon } from "~/shared/components/icons";
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
import { errorProps } from "~/shared/utils/form";

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

function ChangePasswordForm() {
	const baseId = useId();
	const [done, setDone] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(passwordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const fieldId = (field: PasswordField) => `${baseId}-${field}`;
	if (done) {
		return (
			<div role="status" className="flex flex-col items-start gap-4">
				<span className="flex size-12 items-center justify-center rounded-full bg-brand-green/15 text-highlight">
					<CircleCheckIcon aria-hidden="true" className="size-6" />
				</span>
				<DialogHeader>
					<DialogTitle>Senha alterada</DialogTitle>
					<DialogDescription className="text-[0.9375rem]/6">
						Use a nova senha no próximo acesso.
					</DialogDescription>
				</DialogHeader>
				<DialogClose asChild>
					<Button size="sm">Concluir</Button>
				</DialogClose>
			</div>
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

	return (
		<>
			<DialogHeader className="pr-12">
				<DialogTitle>Alterar senha</DialogTitle>
				<DialogDescription className="text-[0.9375rem]/6">
					A nova senha precisa ter pelo menos 8 caracteres.
				</DialogDescription>
			</DialogHeader>
			<form
				noValidate
				onSubmit={handleSubmit(() => setDone(true))}
				className="flex flex-col gap-6"
			>
				<FieldGroup className="gap-4">
					{fields.map((field) => {
						const error = errors[field.name];

						return (
							<Field key={field.name} data-invalid={Boolean(error)}>
								<FieldLabel htmlFor={fieldId(field.name)}>
									{field.label}
								</FieldLabel>
								<PasswordInput
									id={fieldId(field.name)}
									{...register(field.name)}
									autoComplete={field.auto}
									{...errorProps(fieldId(field.name), error)}
								/>
								{error?.message && (
									<FieldError id={`${fieldId(field.name)}-erro`}>
										{error.message}
									</FieldError>
								)}
							</Field>
						);
					})}
				</FieldGroup>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline" size="sm">
							Cancelar
						</Button>
					</DialogClose>
					<Button type="submit" size="sm" className="sm:min-w-36">
						Alterar senha
					</Button>
				</DialogFooter>
			</form>
		</>
	);
}
