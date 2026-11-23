import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";

import {
	FormField,
	fieldControlClassName,
} from "~/features/account/components/form-field";
import {
	type Address,
	type AddressField,
	type AddressFormValues,
	type AddressInput,
	addressSchema,
	brazilianStates,
	formatZip,
} from "~/features/account/lib/addresses";
import { ChevronDownIcon } from "~/shared/components/icons";
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

type AddressFormDialogProps = {
	open: boolean;
	address: Address | null;
	forceDefault: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (input: AddressInput) => void;
};

export function AddressFormDialog({
	open,
	address,
	forceDefault,
	onOpenChange,
	onSave,
}: AddressFormDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl sm:p-8">
				<DialogHeader className="pr-12">
					<DialogTitle>
						{address ? "Editar endereço" : "Novo endereço"}
					</DialogTitle>
					<DialogDescription className="text-[0.9375rem]/6">
						Usado na emissão da nota fiscal das suas compras.
					</DialogDescription>
				</DialogHeader>
				{open && (
					<AddressForm
						address={address}
						forceDefault={forceDefault}
						onSave={onSave}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}

function AddressForm({
	address,
	forceDefault,
	onSave,
}: {
	address: Address | null;
	forceDefault: boolean;
	onSave: (input: AddressInput) => void;
}) {
	const baseId = useId();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AddressFormValues, unknown, AddressInput>({
		resolver: zodResolver(addressSchema),
		defaultValues: {
			label: address?.label ?? "",
			zip: formatZip(address?.zip ?? ""),
			street: address?.street ?? "",
			number: address?.number ?? "",
			complement: address?.complement ?? "",
			district: address?.district ?? "",
			city: address?.city ?? "",
			state: address?.state,
			isDefault: address?.isDefault ?? false,
		},
	});

	const fieldId = (field: AddressField) => `${baseId}-${field}`;
	const describe = (field: AddressField) =>
		errorProps(fieldId(field), errors[field]);

	function submit(data: AddressInput) {
		onSave({ ...data, isDefault: forceDefault || data.isDefault });
	}

	return (
		<form
			noValidate
			onSubmit={handleSubmit(submit)}
			className="flex flex-col gap-6"
		>
			<div className="grid grid-cols-6 gap-4">
				<FormField
					id={fieldId("label")}
					label="Nome do endereço"
					error={errors.label?.message}
					className="col-span-6"
				>
					<input
						id={fieldId("label")}
						{...register("label")}
						placeholder="Ex.: Sede, Filial, Casa"
						{...describe("label")}
						className={fieldControlClassName}
					/>
				</FormField>
				<FormField
					id={fieldId("zip")}
					label="CEP"
					error={errors.zip?.message}
					className="col-span-6 sm:col-span-2"
				>
					<input
						id={fieldId("zip")}
						{...withMask(register("zip"), formatZip)}
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
					error={errors.street?.message}
					className="col-span-6 sm:col-span-4"
				>
					<input
						id={fieldId("street")}
						{...register("street")}
						autoComplete="address-line1"
						{...describe("street")}
						className={fieldControlClassName}
					/>
				</FormField>
				<FormField
					id={fieldId("number")}
					label="Número"
					error={errors.number?.message}
					className="col-span-2"
				>
					<input
						id={fieldId("number")}
						{...register("number")}
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
						{...register("complement")}
						autoComplete="address-line2"
						placeholder="Sala, andar, bloco"
						className={fieldControlClassName}
					/>
				</FormField>
				<FormField
					id={fieldId("district")}
					label="Bairro"
					error={errors.district?.message}
					className="col-span-6 sm:col-span-2"
				>
					<input
						id={fieldId("district")}
						{...register("district")}
						{...describe("district")}
						className={fieldControlClassName}
					/>
				</FormField>
				<FormField
					id={fieldId("city")}
					label="Cidade"
					error={errors.city?.message}
					className="col-span-4 sm:col-span-2"
				>
					<input
						id={fieldId("city")}
						{...register("city")}
						autoComplete="address-level2"
						{...describe("city")}
						className={fieldControlClassName}
					/>
				</FormField>
				<FormField
					id={fieldId("state")}
					label="Estado"
					error={errors.state?.message}
					className="col-span-2"
				>
					<div className="relative">
						<select
							id={fieldId("state")}
							{...register("state")}
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

			{!forceDefault && !address?.isDefault && (
				<label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-brand-blue/4 px-4 py-3.5 text-sm font-medium text-heading">
					<input
						type="checkbox"
						{...register("isDefault")}
						className="size-4.5 accent-primary"
					/>
					Usar como endereço principal
				</label>
			)}

			<DialogFooter>
				<DialogClose asChild>
					<Button type="button" variant="outline" size="sm">
						Cancelar
					</Button>
				</DialogClose>
				<Button type="submit" size="sm" className="sm:min-w-40">
					{address ? "Salvar alterações" : "Adicionar endereço"}
				</Button>
			</DialogFooter>
		</form>
	);
}
