import type { ReactNode } from "react";

type SectionEyebrowProps = {
	children: ReactNode;
};

export function SectionEyebrow({ children }: SectionEyebrowProps) {
	return (
		<p className="text-eyebrow tracking-widest text-highlight uppercase">
			{children}
		</p>
	);
}
