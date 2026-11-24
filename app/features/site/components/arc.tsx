import ring from "~/@assets/brand/symbol-ring-blue.webp";
import { cn } from "~/shared/lib/utils";

export function Arc({
	className,
	...props
}: React.ComponentPropsWithoutRef<"span">) {
	return (
		<span
			aria-hidden="true"
			style={{ maskImage: `url(${ring})` }}
			className={cn(
				"pointer-events-none absolute -z-10 aspect-896/900 bg-brand-blue/6 mask-contain mask-no-repeat",
				className,
			)}
			{...props}
		/>
	);
}
