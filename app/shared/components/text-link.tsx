import type { ReactNode } from "react";
import { Link } from "react-router";

type TextLinkProps = {
	to: string;
	children: ReactNode;
	newTab?: boolean;
};

export const textLinkClassName =
	"font-medium text-heading underline decoration-1 underline-offset-4 hover:text-highlight";

export function TextLink({ to, children, newTab = false }: TextLinkProps) {
	return (
		<Link
			to={to}
			className={textLinkClassName}
			{...(newTab && { target: "_blank", rel: "noopener noreferrer" })}
		>
			{children}
			{newTab && <span className="sr-only"> (abre em nova aba)</span>}
		</Link>
	);
}
