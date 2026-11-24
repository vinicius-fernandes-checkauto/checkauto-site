import type { ReactNode } from "react";
import { Link } from "react-router";

type TextLinkProps = {
	to: string;
	children: ReactNode;
};

export function TextLink({ to, children }: TextLinkProps) {
	return (
		<Link
			to={to}
			className="font-medium text-heading underline decoration-1 underline-offset-4 hover:text-highlight"
		>
			{children}
		</Link>
	);
}
