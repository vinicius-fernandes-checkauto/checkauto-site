import { cn } from "~/shared/lib/utils";

function AuthHeading({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("flex flex-col items-center gap-2 text-center", className)}
			{...props}
		/>
	);
}

function AuthHeadingTitle({ className, ...props }: React.ComponentProps<"h1">) {
	return (
		<h1
			className={cn(
				"text-[1.75rem]/tight font-semibold tracking-tight text-heading lg:text-3xl/tight",
				className,
			)}
			{...props}
		/>
	);
}

function AuthHeadingDescription({
	className,
	...props
}: React.ComponentProps<"p">) {
	return (
		<p
			className={cn("text-sm/5.5 text-muted-foreground", className)}
			{...props}
		/>
	);
}

export { AuthHeading, AuthHeadingDescription, AuthHeadingTitle };
