import type { ReactNode } from "react";

type SectionEyebrowProps = {
	children: ReactNode;
};

export function SectionEyebrow({ children }: SectionEyebrowProps) {
	return (
		<p
			data-slot="eyebrow"
			className="text-base/5 font-semibold tracking-widest text-highlight uppercase"
		>
			{children}
		</p>
	);
}
