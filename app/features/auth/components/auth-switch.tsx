import type { ReactNode } from "react";
import { Link } from "react-router";

type AuthSwitchProps = {
	question: string;
	to: string;
	children: ReactNode;
};

export function AuthSwitch({ question, to, children }: AuthSwitchProps) {
	return (
		<p className="text-center text-sm text-muted-foreground">
			{question}{" "}
			<Link
				to={to}
				className="font-medium text-heading hover:underline hover:underline-offset-4"
			>
				{children}
			</Link>
		</p>
	);
}
