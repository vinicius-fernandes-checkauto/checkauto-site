import { cn } from "~/shared/lib/utils";

export function IconBadge({
	className,
	...props
}: React.ComponentPropsWithoutRef<"span">) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"flex size-11 shrink-0 items-center justify-center rounded-full [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
				className,
			)}
			{...props}
		/>
	);
}
