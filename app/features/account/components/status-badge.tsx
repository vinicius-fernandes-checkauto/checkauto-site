import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/shared/lib/utils";

const statusBadge = cva(
	"inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
	{
		variants: {
			tone: {
				success: "bg-brand-green/15 text-highlight",
				warning: "bg-warning/12 text-warning",
				danger: "bg-destructive/10 text-destructive",
				neutral: "bg-brand-blue/6 text-heading",
			},
		},
	},
);

export type StatusTone = NonNullable<VariantProps<typeof statusBadge>["tone"]>;

export function StatusBadge({
	tone,
	children,
	className,
}: {
	tone: StatusTone;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<span className={cn(statusBadge({ tone }), className)}>{children}</span>
	);
}
