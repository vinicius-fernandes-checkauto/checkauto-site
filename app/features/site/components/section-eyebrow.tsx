import type { ReactNode } from "react";

import { cn } from "~/shared/lib/utils";

type SectionEyebrowProps = {
	children: ReactNode;
	className?: string;
};

export function SectionEyebrow({ children, className }: SectionEyebrowProps) {
	return (
		<p
			data-slot="eyebrow"
			className={cn(
				"text-base/5 font-semibold tracking-widest text-highlight uppercase",
				className,
			)}
		>
			{children}
		</p>
	);
}
