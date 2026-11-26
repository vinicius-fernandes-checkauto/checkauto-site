import type * as React from "react";

import { cn } from "~/shared/lib/utils";

function Empty({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="empty"
			className={cn(
				"flex w-full min-w-0 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-brand-blue/20 px-6 py-12 text-center",
				className,
			)}
			{...props}
		/>
	);
}

function EmptyMedia({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="empty-media"
			aria-hidden="true"
			className={cn(
				"flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-blue/6 text-heading [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
				className,
			)}
			{...props}
		/>
	);
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="empty-title"
			className={cn("font-semibold text-heading", className)}
			{...props}
		/>
	);
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="empty-description"
			className={cn(
				"max-w-[40ch] text-sm/6 text-balance text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="empty-content"
			className={cn("mt-1 flex flex-col items-center gap-3", className)}
			{...props}
		/>
	);
}

export { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle };
