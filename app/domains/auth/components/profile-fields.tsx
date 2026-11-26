import {
	Controller,
	type FieldPath,
	type UseFormReturn,
} from "react-hook-form";

import type { ProfileFieldsValues } from "~/domains/auth/utils/auth.schema";
import { CnpjInput } from "~/shared/components/cnpj-input";
import { CpfInput } from "~/shared/components/cpf-input";
import { PhoneInput } from "~/shared/components/phone-input";
import { TextField } from "~/shared/components/text-field";
import { Button } from "~/shared/components/ui/button";
import {
	FieldGroup,
	FieldLegend,
	FieldSet,
} from "~/shared/components/ui/field";

type ProfileFieldsProps<T extends ProfileFieldsValues> = {
	form: UseFormReturn<T>;
};

function profileForm<T extends ProfileFieldsValues>(form: UseFormReturn<T>) {
	return form as unknown as UseFormReturn<ProfileFieldsValues>;
}

const personTypes = [
	{ value: "pf", label: "Pessoa física" },
	{ value: "pj", label: "Pessoa jurídica" },
] as const;

export function PersonFields<T extends ProfileFieldsValues>({
	form: source,
}: ProfileFieldsProps<T>) {
	const form = profileForm(source);
	const company = form.watch("personType") === "pj";

	return (
		<>
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
		</>
	);
}

export const profileApiFields = {
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
} as const satisfies Record<string, FieldPath<ProfileFieldsValues>>;
