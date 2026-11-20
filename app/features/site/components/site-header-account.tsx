import { Link } from "react-router";

import { AccountMenu } from "~/features/account/components/account-menu";
import type { AccountUser } from "~/features/account/lib/account";
import { HeaderCart } from "~/features/site/components/header-cart";
import { Button } from "~/shared/components/ui/button";
import { cn } from "~/shared/lib/utils";

type SiteHeaderAccountProps = {
	user?: AccountUser;
	cartCount?: number;
	className?: string;
};

function SignInLink() {
	return (
		<Button
			asChild
			variant="secondary"
			size="sm"
			className="hidden px-6 sm:inline-flex"
		>
			<Link to="/entrar">Entrar</Link>
		</Button>
	);
}

export function SiteHeaderAccount({
	user,
	cartCount = 0,
	className,
}: SiteHeaderAccountProps) {
	return (
		<div
			className={cn(
				"flex shrink-0 items-center gap-1.5",
				user
					? "sm:gap-1 sm:rounded-full sm:border sm:border-border sm:bg-card sm:p-1"
					: "sm:gap-2",
				className,
			)}
		>
			{user ? <AccountMenu user={user} /> : <SignInLink />}
			<HeaderCart count={cartCount} />
		</div>
	);
}
