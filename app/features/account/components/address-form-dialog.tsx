import { type FormEvent, type ReactNode, useId, useState } from "react";

import {
	type Address,
	type AddressField,
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
import { cn } from "~/shared/lib/utils";

const controlClassName =
	"h-11 w-full rounded-full border border-border bg-card px-4.5 text-sm text-heading outline-none placeholder:text-muted-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid aria-invalid:border-destructive";

type Errors = Partial<Record<AddressField, string>>;

function Field({
	id,
	label,
	error,
	optional,
	className,
	children,
}: {
	id: string;
	label: string;
	error?: string;
	optional?: boolean;
	className?: string;
	children: ReactNode;
}) {
	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<label
				htmlFor={id}
				className="px-1 text-[0.8125rem] font-medium text-heading"
			>
				{label}
				{optional && (
					<span className="font-normal text-muted-foreground"> (opcional)</span>
				)}
			</label>
			{children}
			{error && (
				<p
					id={`${id}-erro`}
					className="px-1 text-sm/5.5 font-medium text-destructive"
				>
					{error}
				</p>
			)}
		</div>
	);
}

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
	const [zip, setZip] = useState(formatZip(address?.zip ?? ""));
	const [errors, setErrors] = useState<Errors>({});

	const fieldId = (field: AddressField) => `${baseId}-${field}`;
	const describe = (field: AddressField) =>
		errors[field]
			? { "aria-invalid": true, "aria-describedby": `${fieldId(field)}-erro` }
			: {};

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const result = addressSchema.safeParse({
			...Object.fromEntries(data),
			isDefault: forceDefault || data.get("isDefault") === "on",
		});

		if (!result.success) {
			const next: Errors = {};
			for (const issue of result.error.issues) {
				const field = issue.path[0] as AddressField;
				next[field] ??= issue.message;
			}
			setErrors(next);
			const first = Object.keys(next)[0] as AddressField | undefined;
			if (first) document.getElementById(fieldId(first))?.focus();
			return;
		}

		onSave(result.data);
	}

	return (
		<form
			noValidate
			onSubmit={handleSubmit}
			onChange={(event) => {
				const target = event.target;
				if (!(target instanceof HTMLElement) || !("name" in target)) return;
				const field = target.name as AddressField;
				if (errors[field]) setErrors({ ...errors, [field]: undefined });
			}}
			className="flex flex-col gap-6"
		>
			<div className="grid grid-cols-6 gap-4">
				<Field
					id={fieldId("label")}
					label="Nome do endereço"
					error={errors.label}
					className="col-span-6"
				>
					<input
						id={fieldId("label")}
						name="label"
						defaultValue={address?.label}
						placeholder="Ex.: Sede, Filial, Casa"
						{...describe("label")}
						className={controlClassName}
					/>
				</Field>
				<Field
					id={fieldId("zip")}
					label="CEP"
					error={errors.zip}
					className="col-span-6 sm:col-span-2"
				>
					<input
						id={fieldId("zip")}
						name="zip"
						inputMode="numeric"
						autoComplete="postal-code"
						placeholder="00000-000"
						value={zip}
						onChange={(event) => setZip(formatZip(event.target.value))}
						{...describe("zip")}
						className={controlClassName}
					/>
				</Field>
				<Field
					id={fieldId("street")}
					label="Rua"
					error={errors.street}
					className="col-span-6 sm:col-span-4"
				>
					<input
						id={fieldId("street")}
						name="street"
						autoComplete="address-line1"
						defaultValue={address?.street}
						{...describe("street")}
						className={controlClassName}
					/>
				</Field>
				<Field
					id={fieldId("number")}
					label="Número"
					error={errors.number}
					className="col-span-2"
				>
					<input
						id={fieldId("number")}
						name="number"
						inputMode="numeric"
						defaultValue={address?.number}
						{...describe("number")}
						className={controlClassName}
					/>
				</Field>
				<Field
					id={fieldId("complement")}
					label="Complemento"
					optional
					className="col-span-4"
				>
					<input
						id={fieldId("complement")}
						name="complement"
						autoComplete="address-line2"
						defaultValue={address?.complement}
						placeholder="Sala, andar, bloco"
						className={controlClassName}
					/>
				</Field>
				<Field
					id={fieldId("district")}
					label="Bairro"
					error={errors.district}
					className="col-span-6 sm:col-span-2"
				>
					<input
						id={fieldId("district")}
						name="district"
						defaultValue={address?.district}
						{...describe("district")}
						className={controlClassName}
					/>
				</Field>
				<Field
					id={fieldId("city")}
					label="Cidade"
					error={errors.city}
					className="col-span-4 sm:col-span-2"
				>
					<input
						id={fieldId("city")}
						name="city"
						autoComplete="address-level2"
						defaultValue={address?.city}
						{...describe("city")}
						className={controlClassName}
					/>
				</Field>
				<Field
					id={fieldId("state")}
					label="Estado"
					error={errors.state}
					className="col-span-2"
				>
					<div className="relative">
						<select
							id={fieldId("state")}
							name="state"
							autoComplete="address-level1"
							defaultValue={address?.state ?? ""}
							{...describe("state")}
							className={cn(
								controlClassName,
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
				</Field>
			</div>

			{!forceDefault && !address?.isDefault && (
				<label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-brand-blue/4 px-4 py-3.5 text-sm font-medium text-heading">
					<input
						type="checkbox"
						name="isDefault"
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
