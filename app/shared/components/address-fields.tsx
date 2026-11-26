import { useRef, useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { TextField } from "~/shared/components/text-field";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "~/shared/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/shared/components/ui/select";
import { lookupZip } from "~/shared/lib/zip-lookup";
import {
	type AddressValues,
	brazilianStates,
	formatZip,
} from "~/shared/utils/address";

type AddressFieldsProps<T extends AddressValues> = {
	form: UseFormReturn<T>;
	showLegend?: boolean;
};

export function AddressFields<T extends AddressValues>({
	form: source,
	showLegend = true,
}: AddressFieldsProps<T>) {
	const form = source as unknown as UseFormReturn<AddressValues>;
	const [zipStatus, setZipStatus] = useState<"idle" | "loading" | "failed">(
		"idle",
	);
	const lastZip = useRef("");

	async function fillAddress(value: string) {
		const zip = value.replace(/\D/g, "");
		if (zip.length !== 8 || zip === lastZip.current) return;

		lastZip.current = zip;
		setZipStatus("loading");
		try {
			const address = await lookupZip(zip);
			if (lastZip.current !== zip) return;

			setZipStatus("idle");
			if (!address) {
				form.setError("zip", { message: "CEP não encontrado." });
				return;
			}

			form.clearErrors("zip");
			const options = { shouldValidate: true, shouldDirty: true };
			if (address.street) form.setValue("street", address.street, options);
			if (address.district) {
				form.setValue("district", address.district, options);
			}
			if (address.city) form.setValue("city", address.city, options);
			form.setValue("state", address.state, options);
			form.setFocus(address.street ? "number" : "street");
		} catch {
			if (lastZip.current === zip) setZipStatus("failed");
		}
	}

	return (
		<FieldSet>
			<FieldLegend className={showLegend ? "text-sm font-medium" : "sr-only"}>
				Endereço
			</FieldLegend>
			<FieldGroup className="grid grid-cols-6 gap-3">
				<TextField
					form={form}
					name="zip"
					label="CEP"
					format={formatZip}
					onValueChange={(value) => void fillAddress(value)}
					description={
						zipStatus === "loading"
							? "Buscando endereço…"
							: zipStatus === "failed"
								? "Não foi possível buscar o endereço. Preencha os campos."
								: undefined
					}
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
							<Select
								name={field.name}
								value={field.value}
								onValueChange={field.onChange}
								autoComplete="address-level1"
							>
								<SelectTrigger
									id="state"
									ref={field.ref}
									onBlur={field.onBlur}
									aria-invalid={fieldState.invalid}
									aria-describedby={
										fieldState.error ? "state-error" : undefined
									}
								>
									<SelectValue placeholder="UF" />
								</SelectTrigger>
								<SelectContent>
									{brazilianStates.map((state) => (
										<SelectItem key={state} value={state}>
											{state}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{fieldState.error && (
								<FieldError id="state-error" errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
			</FieldGroup>
		</FieldSet>
	);
}
