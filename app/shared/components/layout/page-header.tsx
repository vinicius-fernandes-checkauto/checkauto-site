import type { ReactNode } from "react";
import { Link } from "react-router";

import { ChevronRightIcon } from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

export function PageHeader({
	label,
	title,
	description,
	className,
}: {
	label: string;
	title: ReactNode;
	description: string;
	className?: string;
}) {
	return (
		<header className={cn("flex flex-col gap-3", className)}>
			<nav aria-label="Você está em" className="pb-5">
				<ol className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
					<li>
						<Link to="/" className="transition-colors hover:text-heading">
							Início
						</Link>
					</li>
					<li aria-hidden="true">
						<ChevronRightIcon className="size-3.5" />
					</li>
					<li aria-current="page" className="font-medium text-heading">
						{label}
					</li>
				</ol>
			</nav>
			<h1 className="text-3xl/tight font-medium tracking-tight text-heading lg:text-4xl/tight">
				{title}
			</h1>
			<p className="max-w-[56ch] text-base/7 text-muted-foreground">
				{description}
			</p>
		</header>
	);
}
