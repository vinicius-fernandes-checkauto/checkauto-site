import type { ReactNode } from "react";

type AccountPageHeaderProps = {
	title: string;
	description?: string;
	action?: ReactNode;
};

export function AccountPageHeader({
	title,
	description,
	action,
}: AccountPageHeaderProps) {
	return (
		<header className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-end sm:justify-between">
			<div className="flex flex-col gap-1.5">
				<h1 className="text-3xl/tight font-medium tracking-tight text-heading lg:text-4xl/tight">
					{title}
				</h1>
				{description && (
					<p className="max-w-[52ch] text-[0.9375rem]/6 text-muted-foreground">
						{description}
					</p>
				)}
			</div>
			{action && <div className="shrink-0">{action}</div>}
		</header>
	);
}
