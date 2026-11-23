import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import {
	FormField,
	fieldControlClassName,
} from "~/features/account/components/form-field";
import {
	type EmailChangeField,
	emailChangeSchema,
	maskEmail,
} from "~/features/account/lib/profile";
import { CircleCheckIcon, MailIcon } from "~/shared/components/icons";
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
import { errorProps, withMask } from "~/shared/lib/form";
import { cn } from "~/shared/lib/utils";

type ChangeEmailDialogProps = {
	open: boolean;
	email: string;
	onOpenChange: (open: boolean) => void;
	onChanged: (email: string) => void;
};

export function ChangeEmailDialog({
	open,
	email,
	onOpenChange,
	onChanged,
}: ChangeEmailDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:p-8">
				{open && <ChangeEmailFlow email={email} onChanged={onChanged} />}
			</DialogContent>
		</Dialog>
	);
}

function ChangeEmailFlow({
	email,
	onChanged,
}: {
	email: string;
	onChanged: (email: string) => void;
}) {
	const baseId = useId();
	const [step, setStep] = useState<"send" | "confirm" | "done">("send");
	const [newEmail, setNewEmail] = useState("");
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(emailChangeSchema),
		defaultValues: { code: "", newEmail: "" },
	});

	const fieldId = (field: EmailChangeField) => `${baseId}-${field}`;
	const describe = (field: EmailChangeField) =>
		errorProps(fieldId(field), errors[field]);

	function submit(data: { newEmail: string }) {
		setNewEmail(data.newEmail);
		onChanged(data.newEmail);
		setStep("done");
	}

	if (step === "done") {
		return (
			<div role="status" className="flex flex-col items-start gap-4">
				<span className="flex size-12 items-center justify-center rounded-full bg-brand-green/15 text-highlight">
					<CircleCheckIcon aria-hidden="true" className="size-6" />
				</span>
				<DialogHeader>
					<DialogTitle>E-mail alterado</DialogTitle>
					<DialogDescription className="text-[0.9375rem]/6">
						A partir de agora, use{" "}
						<strong className="font-semibold text-heading">{newEmail}</strong>{" "}
						para entrar.
					</DialogDescription>
				</DialogHeader>
				<DialogClose asChild>
					<Button size="sm">Concluir</Button>
				</DialogClose>
			</div>
		);
	}

	if (step === "send") {
		return (
			<>
				<DialogHeader className="pr-12">
					<DialogTitle>Alterar e-mail</DialogTitle>
					<DialogDescription className="text-[0.9375rem]/6">
						Para sua segurança, vamos enviar um código para o e-mail atual.
					</DialogDescription>
				</DialogHeader>
				<div className="flex items-center gap-3 rounded-2xl bg-brand-blue/4 p-4">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-heading">
						<MailIcon aria-hidden="true" className="size-5" />
					</span>
					<span className="min-w-0 truncate text-sm font-semibold text-heading">
						{maskEmail(email)}
					</span>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline" size="sm">
							Cancelar
						</Button>
					</DialogClose>
					<Button size="sm" onClick={() => setStep("confirm")}>
						Enviar código
					</Button>
				</DialogFooter>
			</>
		);
	}

	return (
		<>
			<DialogHeader className="pr-12">
				<DialogTitle>Confirme a alteração</DialogTitle>
				<DialogDescription className="text-[0.9375rem]/6">
					Enviamos um código de 6 dígitos para {maskEmail(email)}.
				</DialogDescription>
			</DialogHeader>
			<form
				noValidate
				onSubmit={handleSubmit(submit)}
				className="flex flex-col gap-6"
			>
				<div className="flex flex-col gap-4">
					<FormField
						id={fieldId("code")}
						label="Código de acesso"
						error={errors.code?.message}
						hint={
							<button
								type="button"
								className="font-medium text-highlight underline-offset-4 hover:underline"
							>
								Reenviar código
							</button>
						}
					>
						<input
							id={fieldId("code")}
							{...withMask(register("code"), (value) =>
								value.replace(/\D/g, "").slice(0, 6),
							)}
							inputMode="numeric"
							autoComplete="one-time-code"
							maxLength={6}
							placeholder="000000"
							{...describe("code")}
							className={cn(
								fieldControlClassName,
								"text-base font-semibold tracking-[0.4em]",
							)}
						/>
					</FormField>
					<FormField
						id={fieldId("newEmail")}
						label="Novo e-mail"
						error={errors.newEmail?.message}
					>
						<input
							id={fieldId("newEmail")}
							{...register("newEmail")}
							type="email"
							autoComplete="email"
							{...describe("newEmail")}
							className={fieldControlClassName}
						/>
					</FormField>
				</div>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => setStep("send")}
					>
						Voltar
					</Button>
					<Button type="submit" size="sm" className="sm:min-w-36">
						Confirmar
					</Button>
				</DialogFooter>
			</form>
		</>
	);
}
