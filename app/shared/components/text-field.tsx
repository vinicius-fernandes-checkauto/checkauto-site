import type { ComponentProps } from "react";
import {
	Controller,
	type FieldPath,
	type FieldValues,
	type UseFormReturn,
} from "react-hook-form";

import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "~/shared/components/ui/field";
import { Input } from "~/shared/components/ui/input";

type TextFieldProps<T extends FieldValues> = {
	form: UseFormReturn<T>;
	name: FieldPath<T>;
	label: string;
	as?: typeof Input;
	format?: (value: string) => string;
	onValueChange?: (value: string) => void;
	description?: string;
	className?: string;
} & Omit<ComponentProps<typeof Input>, "form" | "name">;

export function TextField<T extends FieldValues>({
	form,
	name,
	label,
	as: Control = Input,
	format,
	onValueChange,
	description,
	className,
	...props
}: TextFieldProps<T>) {
	return (
		<Controller
			name={name}
			control={form.control}
			render={({ field, fieldState }) => {
				const describedBy = [
					description && `${name}-description`,
					fieldState.error && `${name}-error`,
				]
					.filter(Boolean)
					.join(" ");

				return (
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
								onValueChange?.(event.currentTarget.value);
							}}
							aria-invalid={fieldState.invalid}
							aria-describedby={describedBy || undefined}
						/>
						{description && (
							<FieldDescription id={`${name}-description`}>
								{description}
							</FieldDescription>
						)}
						{fieldState.error && (
							<FieldError id={`${name}-error`} errors={[fieldState.error]} />
						)}
					</Field>
				);
			}}
		/>
	);
}
