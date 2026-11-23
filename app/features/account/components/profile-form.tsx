import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import { AccountSection } from "~/features/account/components/account-section";
import {
	FormField,
	fieldControlClassName,
} from "~/features/account/components/form-field";
import {
	type AccountProfile,
	type ProfileField,
	type ProfileFormValues,
	profileSchema,
} from "~/features/account/lib/profile";
import {
	CircleCheckIcon,
	FileTextIcon,
	LockIcon,
} from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { errorProps, withMask } from "~/shared/lib/form";
import { cn } from "~/shared/lib/utils";
import { formatPhone } from "~/shared/utils/phone";

const acceptedAt = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "long",
	year: "numeric",
	timeZone: "UTC",
});

const consentOptions = [
	{
		value: "sim",
		title: "Sim, concordo",
		description: "Usamos seus dados para melhorar ofertas e serviços.",
	},
	{
		value: "nao",
		title: "Não concordo",
		description: "Seus dados ficam só para a prestação do serviço.",
	},
] as const;

export function ProfileForm({ profile }: { profile: AccountProfile }) {
	const baseId = useId();
	const company = profile.personType === "Pessoa jurídica";
	const [saved, setSaved] = useState(false);
	const {
		register,
		handleSubmit,
		watch,
		clearErrors,
		formState: { errors },
	} = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: profile.name,
			stateRegistration: profile.stateRegistration,
			stateRegistrationExempt: !company || profile.stateRegistrationExempt,
			phone: profile.phone,
			secondaryPhone: profile.secondaryPhone,
			shareData: profile.shareData ? "sim" : "nao",
		},
	});
	const exempt = watch("stateRegistrationExempt");

	const fieldId = (field: ProfileField) => `${baseId}-${field}`;
	const describe = (field: ProfileField) =>
		errorProps(fieldId(field), errors[field]);

	return (
		<form
			noValidate
			onSubmit={handleSubmit(() => setSaved(true))}
			onChange={() => setSaved(false)}
			className="flex flex-col gap-5"
		>
			<AccountSection
				id={`${baseId}-dados`}
				title={company ? "Dados da empresa" : "Dados pessoais"}
				description="Aparecem na nota fiscal e nos contatos sobre seus pedidos."
			>
				<div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
					<FormField
						id={fieldId("name")}
						label={company ? "Razão social" : "Nome completo"}
						error={errors.name?.message}
						className="sm:col-span-2"
					>
						<input
							id={fieldId("name")}
							{...register("name")}
							autoComplete={company ? "organization" : "name"}
							{...describe("name")}
							className={fieldControlClassName}
						/>
					</FormField>
					<FormField
						id={`${baseId}-documento`}
						label={company ? "CNPJ" : "CPF"}
						hint="Para alterar, fale com o atendimento."
					>
						<div className="relative">
							<input
								id={`${baseId}-documento`}
								value={profile.document}
								readOnly
								disabled
								aria-describedby={`${baseId}-documento-dica`}
								className={cn(fieldControlClassName, "pr-11 tabular-nums")}
							/>
							<LockIcon
								aria-hidden="true"
								className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
							/>
						</div>
					</FormField>
					{company && (
						<FormField
							id={fieldId("stateRegistration")}
							label="Inscrição estadual"
							error={errors.stateRegistration?.message}
						>
							<div className="flex items-center gap-3">
								<input
									id={fieldId("stateRegistration")}
									{...register("stateRegistration", { disabled: exempt })}
									inputMode="numeric"
									placeholder={exempt ? "Isento" : undefined}
									{...describe("stateRegistration")}
									className={fieldControlClassName}
								/>
								<label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm font-medium text-heading">
									<input
										type="checkbox"
										{...register("stateRegistrationExempt", {
											onChange: () => clearErrors("stateRegistration"),
										})}
										className="size-4.5 accent-primary"
									/>
									Isento
								</label>
							</div>
						</FormField>
					)}
					<FormField
						id={fieldId("phone")}
						label="Telefone principal"
						error={errors.phone?.message}
					>
						<input
							id={fieldId("phone")}
							{...withMask(register("phone"), formatPhone)}
							type="tel"
							inputMode="tel"
							autoComplete="tel-national"
							placeholder="(00) 00000-0000"
							{...describe("phone")}
							className={fieldControlClassName}
						/>
					</FormField>
					<FormField
						id={fieldId("secondaryPhone")}
						label="Telefone secundário"
						optional
						error={errors.secondaryPhone?.message}
					>
						<input
							id={fieldId("secondaryPhone")}
							{...withMask(register("secondaryPhone"), formatPhone)}
							type="tel"
							inputMode="tel"
							placeholder="(00) 00000-0000"
							{...describe("secondaryPhone")}
							className={fieldControlClassName}
						/>
					</FormField>
				</div>
			</AccountSection>

			<AccountSection
				id={`${baseId}-privacidade`}
				title="Contrato e privacidade"
				description="Como seus dados são usados pela Checkauto."
			>
				<div className="flex flex-col gap-4 rounded-2xl bg-brand-blue/4 p-4 sm:flex-row sm:items-center">
					<div className="flex min-w-0 flex-1 items-center gap-4">
						<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-heading">
							<FileTextIcon aria-hidden="true" className="size-5" />
						</span>
						<div className="flex min-w-0 flex-1 flex-col">
							<p className="text-sm/5 font-semibold text-heading">
								Contrato de fornecimento de informações
							</p>
							<p className="flex items-center gap-1.5 text-xs/5 text-muted-foreground">
								<CircleCheckIcon
									aria-hidden="true"
									className="size-3.5 text-highlight"
								/>
								Aceito em{" "}
								{acceptedAt.format(new Date(profile.contractAcceptedAt))}
							</p>
						</div>
					</div>
					<Button
						asChild
						variant="outline"
						size="sm"
						className="h-10 text-sm max-sm:w-full"
					>
						<Link to="/contrato">Ler contrato</Link>
					</Button>
				</div>

				<fieldset className="flex flex-col gap-3">
					<legend className="mb-3 text-sm/6 font-medium text-heading">
						Você permite o compartilhamento dos seus dados com parceiros da
						Checkauto?
					</legend>
					<div className="grid gap-3 sm:grid-cols-2">
						{consentOptions.map((option) => (
							<label
								key={option.value}
								className="flex cursor-pointer gap-3 rounded-2xl border border-border p-4 transition-colors hover:border-brand-blue/25 has-checked:border-primary has-checked:bg-brand-green/8"
							>
								<input
									type="radio"
									{...register("shareData")}
									value={option.value}
									className="mt-0.5 size-4.5 shrink-0 accent-primary"
								/>
								<span className="flex flex-col gap-0.5">
									<span className="text-sm font-semibold text-heading">
										{option.title}
									</span>
									<span className="text-xs/5 text-muted-foreground">
										{option.description}
									</span>
								</span>
							</label>
						))}
					</div>
				</fieldset>
			</AccountSection>

			<div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
				<p
					role="status"
					className="flex items-center justify-center gap-2 text-sm font-medium text-highlight"
				>
					{saved && (
						<>
							<CircleCheckIcon aria-hidden="true" className="size-4.5" />
							Alterações salvas
						</>
					)}
				</p>
				<Button type="submit" className="sm:min-w-48">
					Salvar alterações
				</Button>
			</div>
		</form>
	);
}
