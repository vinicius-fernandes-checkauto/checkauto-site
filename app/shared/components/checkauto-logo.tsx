import { Link } from "react-router";

import logo from "~/assets/brand/checkauto-logo.png";
import logoWhite from "~/assets/brand/checkauto-logo-white.png";
import { cn } from "~/shared/lib/utils";

type CheckautoLogoProps = {
	variant?: "default" | "white";
	className?: string;
};

export function CheckautoLogo({
	variant = "default",
	className,
}: CheckautoLogoProps) {
	return (
		<Link
			to="/"
			className="inline-flex min-h-11 shrink-0 items-center rounded-full"
		>
			<img
				src={variant === "white" ? logoWhite : logo}
				alt="Página inicial da Checkauto"
				width={800}
				height={109}
				className={cn("h-7 w-auto", className)}
			/>
		</Link>
	);
}
