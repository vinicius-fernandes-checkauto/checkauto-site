import type { ReactNode } from "react";

import { Button } from "~/shared/components/ui/button";
import { cn } from "~/shared/lib/utils";

type FormButtonProps = Omit<React.ComponentProps<typeof Button>, "children"> & {
	children: ReactNode;
	isSubmitting?: boolean;
	submittingText?: ReactNode;
};

export function FormButton({
	children,
	className,
	disabled,
	isSubmitting = false,
	submittingText,
	type = "submit",
	...props
}: FormButtonProps) {
	return (
		<Button
			{...props}
			type={type}
			className={cn("w-full", className)}
			disabled={disabled || isSubmitting}
		>
			{isSubmitting && submittingText !== undefined ? submittingText : children}
		</Button>
	);
}
