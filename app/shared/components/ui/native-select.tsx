import type * as React from "react";

import { ChevronDownIcon } from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

function NativeSelect({
	className,
	children,
	...props
}: React.ComponentProps<"select">) {
	return (
		<div className="relative w-full">
			<select
				data-slot="native-select"
				className={cn(
					"h-11 w-full min-w-0 appearance-none rounded-full border border-border bg-card pr-10 pl-4.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive",
					className,
				)}
				{...props}
			>
				{children}
			</select>
			<ChevronDownIcon
				aria-hidden="true"
				className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
			/>
		</div>
	);
}

export { NativeSelect };
