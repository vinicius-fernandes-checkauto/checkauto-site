import { Link } from "react-router";

import { ShoppingBagIcon, UserRoundIcon } from "~/shared/components/icons";
import { accountLink, cartLink } from "~/shared/config/navigation";
import { cn } from "~/shared/lib/utils";

type HeaderAccountProps = {
	cartCount?: number;
	className?: string;
};

export function HeaderAccount({
	cartCount = 0,
	className,
}: HeaderAccountProps) {
	const itemsLabel = cartCount === 1 ? "item" : "itens";
	const badge = cartCount > 99 ? "99+" : String(cartCount);

	return (
		<div
			className={cn(
				"flex shrink-0 items-center sm:gap-1 sm:rounded-full sm:border sm:border-border sm:bg-card sm:p-1",
				className,
			)}
		>
			<Link
				to={accountLink.to}
				className="hidden min-h-11 items-center gap-3 rounded-full pr-4 transition-colors hover:bg-muted sm:flex"
			>
				<span
					aria-hidden="true"
					className="flex size-11 items-center justify-center rounded-full bg-accent text-highlight"
				>
					<UserRoundIcon className="size-5" />
				</span>
				<span className="flex flex-col leading-tight whitespace-nowrap">
					<span className="text-xs/4.5 text-muted-foreground">Entre ou</span>
					<span className="text-sm/5.5 font-semibold text-heading">
						Cadastre-se
					</span>
				</span>
			</Link>
			<Link
				to={cartLink.to}
				aria-label={`${cartLink.label}, ${cartCount} ${itemsLabel}`}
				className="relative flex size-11 items-center justify-center rounded-full border border-border bg-card text-heading transition-colors hover:border-slate-300 sm:border-0 sm:bg-accent sm:text-highlight sm:hover:bg-green-100"
			>
				<ShoppingBagIcon aria-hidden="true" className="size-5" />
				<span
					aria-hidden="true"
					className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-card bg-primary px-1 text-[0.6875rem] leading-none font-semibold text-primary-foreground"
				>
					{badge}
				</span>
			</Link>
		</div>
	);
}
