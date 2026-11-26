import { Link, NavLink } from "react-router";

import { accountNav } from "~/content/navigation";
import type { AccountUser } from "~/domains/account/types/account.types";
import { signOut } from "~/domains/auth/services/auth.service";
import { BrandAvatar } from "~/shared/components/brand-avatar";
import {
	FileTextIcon,
	LogOutIcon,
	PackageIcon,
	SearchIcon,
	UserRoundIcon,
	WalletIcon,
} from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { cn } from "~/shared/lib/utils";

const sections = [
	{ ...accountNav.queries, icon: FileTextIcon },
	{ ...accountNav.transactions, icon: WalletIcon },
	{ ...accountNav.plans, icon: PackageIcon },
	{ ...accountNav.profile, icon: UserRoundIcon },
];

export function AccountSidebar({ user }: { user: AccountUser }) {
	return (
		<aside
			aria-label="Minha conta"
			className="hidden min-w-0 flex-col gap-3 lg:sticky lg:top-6 lg:flex"
		>
			<div className="flex items-center gap-3 px-2 pb-2">
				<BrandAvatar className="size-13" src={user.picture} />
				<div className="flex min-w-0 flex-col">
					<p className="truncate text-sm font-semibold text-heading">
						{user.name}
					</p>
					<p className="truncate text-xs text-muted-foreground">{user.email}</p>
				</div>
			</div>

			<nav aria-label="Seções da conta">
				<Button asChild size="sm" className="mb-3 w-full">
					<Link to={accountNav.newQuery.to}>
						<SearchIcon aria-hidden="true" />
						{accountNav.newQuery.label}
					</Link>
				</Button>
				<ul className="flex flex-col gap-0.5">
					{sections.map(({ icon: Icon, ...section }) => (
						<li key={section.to}>
							<NavLink
								to={section.to}
								className={({ isActive }) =>
									cn(
										"group flex h-11.5 items-center gap-3 rounded-full px-3.5 text-sm font-medium whitespace-nowrap transition-colors",
										isActive
											? "bg-accent font-semibold text-heading"
											: "text-muted-foreground hover:bg-accent/60 hover:text-heading",
									)
								}
							>
								<Icon
									aria-hidden="true"
									className="size-4.5 group-aria-[current=page]:text-highlight"
								/>
								{section.label}
							</NavLink>
						</li>
					))}
				</ul>

				<div className="mt-3 border-t border-border pt-3">
					<Link
						to="/"
						replace
						onClick={signOut}
						className="flex h-11.5 items-center gap-3 rounded-full px-3.5 text-sm font-medium text-muted-foreground/80 transition-colors hover:bg-red-50 hover:text-destructive"
					>
						<LogOutIcon aria-hidden="true" className="size-4.5" />
						Sair
					</Link>
				</div>
			</nav>
		</aside>
	);
}
