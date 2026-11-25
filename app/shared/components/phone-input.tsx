import type { ComponentProps } from "react";

import { Input } from "~/shared/components/ui/input";
import { formatPhone } from "~/shared/utils/phone";

export function PhoneInput({
	onChange,
	...props
}: ComponentProps<typeof Input>) {
	return (
		<Input
			{...props}
			onChange={(event) => {
				event.currentTarget.value = formatPhone(event.currentTarget.value);
				onChange?.(event);
			}}
		/>
	);
}
