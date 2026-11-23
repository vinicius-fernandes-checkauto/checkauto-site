import type { ReactNode } from "react";

import { cn } from "~/shared/lib/utils";

type AccountSectionProps = {
	id: string;
	title: string;
	description?: string;
	className?: string;
	children: ReactNode;
};

export function AccountSection({
	id,
	title,
	description,
	className,
	children,
}: AccountSectionProps) {
	return (
		<section
			aria-labelledby={id}
			className={cn(
				"flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 sm:p-7",
				className,
			)}
		>
			<div className="flex flex-col gap-1">
				<h2 id={id} className="text-lg/tight font-semibold tracking-tight">
					{title}
				</h2>
				{description && (
					<p className="text-sm/6 text-muted-foreground">{description}</p>
				)}
			</div>
			{children}
		</section>
	);
}
