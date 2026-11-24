import { Link } from "react-router";

import { AccountMenu } from "~/features/account/components/account-menu";
import type { AccountUser } from "~/features/account/lib/account";
import { CheckautoLogo } from "~/shared/components/checkauto-logo";
import { useScrolled } from "~/shared/hooks/use-scrolled";
import { cn } from "~/shared/lib/utils";

export function AccountHeader({ user }: { user: AccountUser }) {
	const scrolled = useScrolled();

	return (
		<header
			className={cn(
				"sticky top-0 z-40 border-b border-border bg-background transition-shadow duration-300",
				scrolled &&
					"shadow-[0_10px_28px_-14px_--alpha(var(--color-brand-blue)/35%)]",
			)}
		>
			<div className="mx-auto flex min-h-19 w-full max-w-7xl items-center gap-2 px-4 sm:px-8">
				<CheckautoLogo className="h-6 sm:h-7" />
				<div className="ml-auto flex shrink-0 items-center gap-3">
					<div className="lg:hidden">
						<AccountMenu user={user} />
					</div>
					<Link
						to="/faq"
						className="hidden min-h-11 items-center rounded-full px-3 text-sm font-medium text-heading transition-colors hover:text-highlight lg:inline-flex"
					>
						Ajuda
					</Link>
				</div>
			</div>
		</header>
	);
}
