import type { ComponentProps } from "react";

import { Input } from "~/shared/components/ui/input";
import { formatCnpj } from "~/shared/utils/cnpj";

export function CnpjInput({
	onChange,
	...props
}: ComponentProps<typeof Input>) {
	return (
		<Input
			{...props}
			onChange={(event) => {
				event.currentTarget.value = formatCnpj(event.currentTarget.value);
				onChange?.(event);
			}}
		/>
	);
}
