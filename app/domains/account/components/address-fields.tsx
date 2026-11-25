import type { FieldErrors, UseFormRegister } from "react-hook-form";

import {
	FormField,
	fieldControlClassName,
} from "~/domains/account/components/form-field";
import type {
	AddressField,
	ProfileFormValues,
} from "~/domains/account/utils/account.schema";
import { brazilianStates, formatZip } from "~/domains/account/utils/addresses";
import { ChevronDownIcon } from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";
import { errorProps, withMask } from "~/shared/utils/form";

type AddressFieldsProps = {
	baseId: string;
	register: UseFormRegister<ProfileFormValues>;
	errors?: FieldErrors<ProfileFormValues>["address"];
};

export function AddressFields({
	baseId,
	register,
	errors,
}: AddressFieldsProps) {
	const fieldId = (field: AddressField) => `${baseId}-endereco-${field}`;
	const describe = (field: AddressField) =>
		errorProps(fieldId(field), errors?.[field]);

	return (
		<div className="grid grid-cols-6 gap-4">
			<FormField
				id={fieldId("zip")}
				label="CEP"
				error={errors?.zip?.message}
				className="col-span-6 sm:col-span-2"
			>
				<input
					id={fieldId("zip")}
					{...withMask(register("address.zip"), formatZip)}
					inputMode="numeric"
					autoComplete="postal-code"
					placeholder="00000-000"
					{...describe("zip")}
					className={fieldControlClassName}
				/>
			</FormField>
			<FormField
				id={fieldId("street")}
				label="Rua"
				error={errors?.street?.message}
				className="col-span-6 sm:col-span-4"
			>
				<input
					id={fieldId("street")}
					{...register("address.street")}
					autoComplete="address-line1"
					{...describe("street")}
					className={fieldControlClassName}
				/>
			</FormField>
			<FormField
				id={fieldId("number")}
				label="Número"
				error={errors?.number?.message}
				className="col-span-2"
			>
				<input
					id={fieldId("number")}
					{...register("address.number")}
					inputMode="numeric"
					{...describe("number")}
					className={fieldControlClassName}
				/>
			</FormField>
			<FormField
				id={fieldId("complement")}
				label="Complemento"
				optional
				className="col-span-4"
			>
				<input
					id={fieldId("complement")}
					{...register("address.complement")}
					autoComplete="address-line2"
					placeholder="Sala, andar, bloco"
					className={fieldControlClassName}
				/>
			</FormField>
			<FormField
				id={fieldId("district")}
				label="Bairro"
				error={errors?.district?.message}
				className="col-span-6 sm:col-span-2"
			>
				<input
					id={fieldId("district")}
					{...register("address.district")}
					{...describe("district")}
					className={fieldControlClassName}
				/>
			</FormField>
			<FormField
				id={fieldId("city")}
				label="Cidade"
				error={errors?.city?.message}
				className="col-span-4 sm:col-span-2"
			>
				<input
					id={fieldId("city")}
					{...register("address.city")}
					autoComplete="address-level2"
					{...describe("city")}
					className={fieldControlClassName}
				/>
			</FormField>
			<FormField
				id={fieldId("state")}
				label="Estado"
				error={errors?.state?.message}
				className="col-span-2"
			>
				<div className="relative">
					<select
						id={fieldId("state")}
						{...register("address.state")}
						autoComplete="address-level1"
						{...describe("state")}
						className={cn(
							fieldControlClassName,
							"cursor-pointer appearance-none pr-9 pl-4",
						)}
					>
						<option value="" disabled>
							UF
						</option>
						{brazilianStates.map((state) => (
							<option key={state} value={state}>
								{state}
							</option>
						))}
					</select>
					<ChevronDownIcon
						aria-hidden="true"
						className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
					/>
				</div>
			</FormField>
		</div>
	);
}
