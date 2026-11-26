import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { Controller, type FieldPath, useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";

import { AccountSection } from "~/domains/account/components/account-section";
import { saveProfile } from "~/domains/account/services/account.service";
import type { AccountProfile } from "~/domains/account/types/account.types";
import {
	type ProfileFormInput,
	type ProfileFormValues,
	profileSchema,
} from "~/domains/account/utils/account.schema";
import { AddressFields } from "~/shared/components/address-fields";
import { FormButton } from "~/shared/components/form-button";
import {
	CircleCheckIcon,
	FileTextIcon,
	LockIcon,
} from "~/shared/components/icons";
import { PhoneInput } from "~/shared/components/phone-input";
import { TextField } from "~/shared/components/text-field";
import { Button } from "~/shared/components/ui/button";
import { Checkbox } from "~/shared/components/ui/checkbox";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "~/shared/components/ui/field";
import { Input } from "~/shared/components/ui/input";
import { fieldErrors, toApiError } from "~/shared/lib/api";
import { brazilianStates, formatZip } from "~/shared/utils/address";
import { formatCnpj } from "~/shared/utils/cnpj";
import { formatCpf } from "~/shared/utils/cpf";
import { formatPhone } from "~/shared/utils/phone";

const acceptedAtFormat = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "long",
	year: "numeric",
});

function formatAcceptedAt(value: string) {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : acceptedAtFormat.format(date);
}

const apiFields: Record<string, FieldPath<ProfileFormInput>> = {
	phone: "phone",
	cep: "zip",
	street: "street",
	number_address: "number",
	complement: "complement",
	district: "district",
	city: "city",
	uf: "state",
};

type ReadOnlyFieldProps = {
	id: string;
	label: string;
	value: string;
	className?: string;
};

function ReadOnlyField({ id, label, value, className }: ReadOnlyFieldProps) {
	return (
		<Field className={className}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<div className="relative">
				<Input
					id={id}
					value={value}
					readOnly
					disabled
					className="pr-11 tabular-nums"
				/>
				<LockIcon
					aria-hidden="true"
					className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
				/>
			</div>
		</Field>
	);
}

function toFormValues(profile: AccountProfile): ProfileFormInput {
	const state = brazilianStates.find((item) => item === profile.state);

	return {
		phone: formatPhone(profile.phone),
		zip: formatZip(profile.zip),
		street: profile.street,
		number: profile.number,
		complement: profile.complement,
		district: profile.district,
		city: profile.city,
		state: state ?? ("" as ProfileFormInput["state"]),
		marketing: profile.marketingConsent,
	};
}

export function ProfileForm({ profile }: { profile: AccountProfile }) {
	const baseId = useId();
	const [current, setCurrent] = useState(profile);
	const form = useForm<ProfileFormInput, unknown, ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: toFormValues(profile),
	});

	const { company } = current;
	const acceptedAt = formatAcceptedAt(current.termsAcceptedAt);

	async function submit(values: ProfileFormValues) {
		try {
			const updated = await saveProfile(current, values);
			setCurrent(updated);
			form.reset(toFormValues(updated));
			toast.success("Alterações salvas");
		} catch (error) {
			const { message, data } = toApiError(error);
			const errors = Object.entries(fieldErrors(data)).filter(
				([field]) => field in apiFields,
			);
			for (const [field, fieldMessage] of errors) {
				form.setError(
					apiFields[field],
					{ message: fieldMessage },
					{ shouldFocus: true },
				);
			}
			if (errors.length === 0) form.setError("root", { message });
		}
	}

	return (
		<form
			noValidate
			onSubmit={form.handleSubmit(submit)}
			className="flex flex-col gap-6"
		>
			<AccountSection
				id={`${baseId}-dados`}
				title="Dados pessoais"
				description="Para alterar nome ou documento, fale com o atendimento."
			>
				<FieldGroup className="grid gap-4 sm:grid-cols-2">
					<ReadOnlyField
						id={`${baseId}-nome`}
						label="Nome"
						value={current.firstName}
					/>
					<ReadOnlyField
						id={`${baseId}-sobrenome`}
						label="Sobrenome"
						value={current.lastName}
					/>
					{current.cpf && (
						<ReadOnlyField
							id={`${baseId}-cpf`}
							label="CPF"
							value={formatCpf(current.cpf)}
						/>
					)}
					<TextField
						form={form}
						name="phone"
						label="Telefone com DDD"
						as={PhoneInput}
						type="tel"
						inputMode="numeric"
						autoComplete="tel-national"
					/>
				</FieldGroup>
			</AccountSection>

			{company && (
				<AccountSection
					id={`${baseId}-empresa`}
					title="Dados da empresa"
					description="Para alterar os dados da empresa, fale com o atendimento."
				>
					<FieldGroup className="grid gap-4 sm:grid-cols-2">
						<ReadOnlyField
							id={`${baseId}-razao-social`}
							label="Razão social"
							value={company.corporateName}
							className="sm:col-span-2"
						/>
						<ReadOnlyField
							id={`${baseId}-nome-fantasia`}
							label="Nome fantasia"
							value={company.fantasyName}
						/>
						<ReadOnlyField
							id={`${baseId}-cnpj`}
							label="CNPJ"
							value={formatCnpj(company.cnpj)}
						/>
						{company.stateRegistration && (
							<ReadOnlyField
								id={`${baseId}-inscricao-estadual`}
								label="Inscrição estadual"
								value={company.stateRegistration}
							/>
						)}
					</FieldGroup>
				</AccountSection>
			)}

			<AccountSection
				id={`${baseId}-endereco`}
				title="Endereço"
				description="Usado na nota fiscal das suas consultas."
			>
				<AddressFields form={form} showLegend={false} />
			</AccountSection>

			<AccountSection
				id={`${baseId}-privacidade`}
				title="Contrato e privacidade"
				description="O contrato que você aceitou e suas preferências de comunicação."
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
							{(acceptedAt || current.termsAcceptedVersion) && (
								<p className="flex items-center gap-1.5 text-xs/5 text-muted-foreground">
									<CircleCheckIcon
										aria-hidden="true"
										className="size-3.5 text-highlight"
									/>
									Aceito
									{acceptedAt && ` em ${acceptedAt}`}
									{current.termsAcceptedVersion &&
										` (versão ${current.termsAcceptedVersion})`}
								</p>
							)}
						</div>
					</div>
					<Button
						asChild
						variant="outline"
						size="sm"
						className="h-10 text-sm max-sm:w-full"
					>
						<Link to="/contrato" target="_blank" rel="noopener noreferrer">
							Ler contrato
							<span className="sr-only"> (abre em nova aba)</span>
						</Link>
					</Button>
				</div>

				<Controller
					name="marketing"
					control={form.control}
					render={({ field }) => (
						<Field orientation="horizontal">
							<Checkbox
								id={`${baseId}-marketing`}
								name={field.name}
								checked={field.value}
								onCheckedChange={field.onChange}
								onBlur={field.onBlur}
								ref={field.ref}
							/>
							<FieldLabel
								htmlFor={`${baseId}-marketing`}
								className="font-normal"
							>
								Quero receber novidades e ofertas por e-mail
							</FieldLabel>
						</Field>
					)}
				/>
			</AccountSection>

			<div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
				{form.formState.errors.root && (
					<FieldError errors={[form.formState.errors.root]} />
				)}
				<FormButton
					className="sm:w-auto sm:min-w-48"
					isSubmitting={form.formState.isSubmitting}
					submittingText="Salvando…"
				>
					Salvar alterações
				</FormButton>
			</div>
		</form>
	);
}
