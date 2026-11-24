import type { ReactNode } from "react";

import { cn } from "~/shared/lib/utils";

export const fieldControlClassName =
	"h-11 w-full rounded-full border border-border bg-card px-4.5 text-sm text-heading outline-none placeholder:text-muted-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground aria-invalid:border-destructive";

type FormFieldProps = {
	id: string;
	label: string;
	error?: string;
	hint?: ReactNode;
	optional?: boolean;
	className?: string;
	children: ReactNode;
};

export function FormField({
	id,
	label,
	error,
	hint,
	optional,
	className,
	children,
}: FormFieldProps) {
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
			{error ? (
				<p
					id={`${id}-erro`}
					className="px-1 text-sm/5.5 font-medium text-destructive"
				>
					{error}
				</p>
			) : (
				hint && (
					<p id={`${id}-dica`} className="px-1 text-xs/5 text-muted-foreground">
						{hint}
					</p>
				)
			)}
		</div>
	);
}
