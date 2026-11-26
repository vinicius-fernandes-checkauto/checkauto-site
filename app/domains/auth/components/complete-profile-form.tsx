import { zodResolver } from "@hookform/resolvers/zod";
import { type ComponentProps, useState } from "react";
import {
	Controller,
	type FieldPath,
	type UseFormReturn,
	useForm,
} from "react-hook-form";
import { useNavigate } from "react-router";

import { legalNav } from "~/content/navigation";
import {
	completeGoogleSignUp,
	redirectAfterSignIn,
} from "~/domains/auth/services/auth.service";
import {
	type CompleteProfileFormValues,
	completeProfileSchema,
} from "~/domains/auth/utils/auth.schema";
import { readPendingGoogleSignUp } from "~/domains/auth/utils/google-identity";
import { CnpjInput } from "~/shared/components/cnpj-input";
import { CpfInput } from "~/shared/components/cpf-input";
import { FormButton } from "~/shared/components/form-button";
import { PhoneInput } from "~/shared/components/phone-input";
import { TextLink } from "~/shared/components/text-link";
import { Button } from "~/shared/components/ui/button";
import { Checkbox } from "~/shared/components/ui/checkbox";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "~/shared/components/ui/field";
import { Input } from "~/shared/components/ui/input";
import { NativeSelect } from "~/shared/components/ui/native-select";
import { fieldErrors, toApiError } from "~/shared/lib/api";
import { brazilianStates, formatZip } from "~/shared/utils/address";

type FormValues = CompleteProfileFormValues;

type TextFieldName = Exclude<
	FieldPath<FormValues>,
	"personType" | "state" | "terms" | "marketing"
>;

type TextFieldProps = {
	form: UseFormReturn<FormValues>;
	name: TextFieldName;
	label: string;
	as?: typeof Input;
	format?: (value: string) => string;
	className?: string;
} & Omit<ComponentProps<typeof Input>, "form" | "name">;

function TextField({
	form,
	name,
	label,
	as: Control = Input,
	format,
	className,
	...props
}: TextFieldProps) {
	return (
		<Controller
			name={name}
			control={form.control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid} className={className}>
					<FieldLabel htmlFor={name}>{label}</FieldLabel>
					<Control
						{...props}
						{...field}
						id={name}
						onChange={(event) => {
							if (format) {
								event.currentTarget.value = format(event.currentTarget.value);
							}
							field.onChange(event);
						}}
						aria-invalid={fieldState.invalid}
						aria-describedby={fieldState.error ? `${name}-error` : undefined}
					/>
					{fieldState.error && (
						<FieldError id={`${name}-error`} errors={[fieldState.error]} />
					)}
				</Field>
			)}
		/>
	);
}

const apiFields: Record<string, FieldPath<FormValues>> = {
	person_type: "personType",
	first_name: "firstName",
	last_name: "lastName",
	cpf: "cpf",
	cnpj: "cnpj",
	corporate_name: "corporateName",
	fantasy_name: "fantasyName",
	phone: "phone",
	cep: "zip",
	street: "street",
	number_address: "number",
	complement: "complement",
	district: "district",
	city: "city",
	uf: "state",
	accept_terms: "terms",
	terms_version: "terms",
};

const restartCodes = new Set([
	"google_already_registered",
	"google_token_invalid",
	"google_email_not_verified",
]);

const termsLink = legalNav.find(({ label }) => label === "Termos de compra");

const personTypes = [
	{ value: "pf", label: "Pessoa física" },
	{ value: "pj", label: "Pessoa jurídica" },
] as const;

export function CompleteProfileForm() {
	const [pending] = useState(readPendingGoogleSignUp);
	const navigate = useNavigate();

	const form = useForm<FormValues>({
		resolver: zodResolver(completeProfileSchema),
		defaultValues: {
			personType: "pf",
			firstName: pending?.firstName ?? "",
			lastName: pending?.lastName ?? "",
			cpf: "",
			cnpj: "",
			corporateName: "",
			fantasyName: "",
			phone: "",
			zip: "",
			street: "",
			number: "",
			complement: "",
			district: "",
			city: "",
			state: "SP",
			terms: false,
			marketing: false,
		},
	});

	const company = form.watch("personType") === "pj";

	async function submit(values: FormValues) {
		try {
			const session = await completeGoogleSignUp(values);
			navigate(redirectAfterSignIn(session), { replace: true });
		} catch (error) {
			const { code, message, data } = toApiError(error);
			if (restartCodes.has(code ?? "")) {
				navigate("/entrar", {
					replace: true,
					state: {
						notice:
							code === "google_already_registered"
								? "Essa conta Google já tem cadastro. Entre com o Google."
								: message,
					},
				});
				return;
			}

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
		<form
			method="post"
			noValidate
			onSubmit={form.handleSubmit(submit)}
			className="flex flex-col gap-6"
		>
			{pending?.email && (
				<Field>
					<FieldLabel htmlFor="google-email">E-mail do Google</FieldLabel>
					<Input id="google-email" value={pending.email} readOnly disabled />
				</Field>
			)}

			<Controller
				name="personType"
				control={form.control}
				render={({ field }) => (
					<FieldSet>
						<FieldLegend className="sr-only">Tipo de cadastro</FieldLegend>
						<div role="radiogroup" className="grid grid-cols-2 gap-2">
							{personTypes.map(({ value, label }) => (
								<Button
									key={value}
									type="button"
									role="radio"
									aria-checked={field.value === value}
									variant={field.value === value ? "secondary" : "outline"}
									size="sm"
									onClick={() => field.onChange(value)}
								>
									{label}
								</Button>
							))}
						</div>
					</FieldSet>
				)}
			/>

			<FieldGroup className="grid grid-cols-2 gap-3">
				<TextField
					form={form}
					name="firstName"
					label="Nome"
					autoComplete="given-name"
				/>
				<TextField
					form={form}
					name="lastName"
					label="Sobrenome"
					autoComplete="family-name"
				/>
				{company ? (
					<>
						<TextField
							form={form}
							name="cnpj"
							label="CNPJ"
							as={CnpjInput}
							inputMode="numeric"
							className="col-span-2"
						/>
						<TextField
							form={form}
							name="corporateName"
							label="Razão social"
							autoComplete="organization"
							className="col-span-2"
						/>
						<TextField
							form={form}
							name="fantasyName"
							label="Nome fantasia"
							className="col-span-2"
						/>
					</>
				) : (
					<TextField
						form={form}
						name="cpf"
						label="CPF"
						as={CpfInput}
						inputMode="numeric"
						autoComplete="off"
						className="col-span-2"
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
					className="col-span-2"
				/>
			</FieldGroup>

			<FieldSet>
				<FieldLegend className="text-sm font-medium">Endereço</FieldLegend>
				<FieldGroup className="grid grid-cols-6 gap-3">
					<TextField
						form={form}
						name="zip"
						label="CEP"
						format={formatZip}
						inputMode="numeric"
						autoComplete="postal-code"
						className="col-span-6 sm:col-span-3"
					/>
					<TextField
						form={form}
						name="street"
						label="Rua"
						autoComplete="address-line1"
						className="col-span-6"
					/>
					<TextField
						form={form}
						name="number"
						label="Número"
						className="col-span-2"
					/>
					<TextField
						form={form}
						name="complement"
						label="Complemento"
						autoComplete="address-line2"
						className="col-span-4"
					/>
					<TextField
						form={form}
						name="district"
						label="Bairro"
						className="col-span-6"
					/>
					<TextField
						form={form}
						name="city"
						label="Cidade"
						autoComplete="address-level2"
						className="col-span-4"
					/>
					<Controller
						name="state"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid} className="col-span-2">
								<FieldLabel htmlFor="state">UF</FieldLabel>
								<NativeSelect
									{...field}
									id="state"
									autoComplete="address-level1"
									aria-invalid={fieldState.invalid}
								>
									{brazilianStates.map((state) => (
										<option key={state} value={state}>
											{state}
										</option>
									))}
								</NativeSelect>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
				</FieldGroup>
			</FieldSet>

			<FieldGroup className="gap-3">
				<Controller
					name="terms"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<div className="flex items-start gap-2.5">
								<Checkbox
									id="terms"
									name={field.name}
									checked={field.value}
									onCheckedChange={field.onChange}
									onBlur={field.onBlur}
									ref={field.ref}
									aria-invalid={fieldState.invalid}
									aria-describedby={
										fieldState.error ? "terms-error" : undefined
									}
								/>
								<FieldContent className="flex-row flex-wrap gap-1">
									<FieldLabel
										htmlFor="terms"
										className="inline-flex font-normal"
									>
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
				<Controller
					name="marketing"
					control={form.control}
					render={({ field }) => (
						<Field orientation="horizontal">
							<Checkbox
								id="marketing"
								name={field.name}
								checked={field.value}
								onCheckedChange={field.onChange}
								onBlur={field.onBlur}
								ref={field.ref}
							/>
							<FieldLabel htmlFor="marketing" className="font-normal">
								Quero receber novidades e ofertas por e-mail
							</FieldLabel>
						</Field>
					)}
				/>
			</FieldGroup>

			{form.formState.errors.root && (
				<FieldError
					className="text-center"
					errors={[form.formState.errors.root]}
				/>
			)}

			<FormButton
				isSubmitting={form.formState.isSubmitting}
				submittingText="Criando conta…"
			>
				Concluir cadastro
			</FormButton>
		</form>
	);
}
