import { Link } from "react-router";

import { ShoppingBagIcon } from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

type HeaderCartProps = {
	count?: number;
	className?: string;
};

export function HeaderCart({ count = 0, className }: HeaderCartProps) {
	const itemsLabel = count === 1 ? "item" : "itens";
	const badge = count > 99 ? "99+" : String(count);

	return (
		<Link
			to="/carrinho"
			aria-label={`Carrinho, ${count} ${itemsLabel}`}
			className={cn(
				"relative flex size-11 items-center justify-center rounded-full border border-border bg-card text-heading transition-colors hover:bg-brand-blue/6 sm:border-0 sm:bg-brand-blue/6 sm:hover:bg-brand-blue/10",
				className,
			)}
		>
			<ShoppingBagIcon aria-hidden="true" className="size-5" />
			<span
				aria-hidden="true"
				className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-card bg-primary px-1 text-[0.6875rem] leading-none font-semibold text-primary-foreground"
			>
				{badge}
			</span>
		</Link>
	);
}
