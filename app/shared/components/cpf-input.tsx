import type { ComponentProps } from "react";

import { Input } from "~/shared/components/ui/input";
import { formatCpf } from "~/shared/utils/cpf";

export function CpfInput({ onChange, ...props }: ComponentProps<typeof Input>) {
	return (
		<Input
			{...props}
			onChange={(event) => {
				event.currentTarget.value = formatCpf(event.currentTarget.value);
				onChange?.(event);
			}}
		/>
	);
}
