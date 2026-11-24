import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

type ChangeEvent = Parameters<UseFormRegisterReturn["onChange"]>[0];

export function withMask<Name extends string>(
	registration: UseFormRegisterReturn<Name>,
	mask: (value: string) => string,
): UseFormRegisterReturn<Name> {
	return {
		...registration,
		onChange: (event: ChangeEvent) => {
			event.target.value = mask(event.target.value);
			return registration.onChange(event);
		},
	};
}

export function errorProps(id: string, error?: FieldError) {
	return error
		? { "aria-invalid": true as const, "aria-describedby": `${id}-erro` }
		: {};
}
