import { Link, NavLink } from "react-router";

import { AccountAvatar } from "~/features/account/components/account-avatar";
import type { AccountUser } from "~/features/account/lib/account";
import {
	FileTextIcon,
	HouseIcon,
	LogOutIcon,
	MapPinIcon,
	UserRoundIcon,
	WalletIcon,
} from "~/shared/components/icons";
import { accountNav } from "~/shared/config/navigation";
import { cn } from "~/shared/lib/utils";

const sections = [
	{ ...accountNav.home, icon: HouseIcon, end: true },
	{ ...accountNav.orders, icon: FileTextIcon, end: false },
	{ ...accountNav.credits, icon: WalletIcon, end: false },
	{ ...accountNav.profile, icon: UserRoundIcon, end: false },
	{ ...accountNav.addresses, icon: MapPinIcon, end: false },
];

export function AccountSidebar({ user }: { user: AccountUser }) {
	return (
		<aside
			aria-label="Minha conta"
			className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-24"
		>
			<div className="hidden items-center gap-3 px-2 pb-2 lg:flex">
				<AccountAvatar name={user.name} className="size-11 text-sm" />
				<div className="flex min-w-0 flex-col">
					<p className="truncate text-sm font-semibold text-heading">
						{user.name}
					</p>
					<p className="truncate text-xs text-muted-foreground">{user.email}</p>
				</div>
			</div>

			<nav
				aria-label="Seções da conta"
				className="-mx-4 scrollbar-none overflow-x-auto px-4 py-1 sm:-mx-8 sm:px-8 lg:mx-0 lg:overflow-visible lg:p-0"
			>
				<ul className="flex gap-2 lg:flex-col lg:gap-0.5">
					{sections.map(({ icon: Icon, ...section }) => (
						<li key={section.to} className="shrink-0">
							<NavLink
								to={section.to}
								end={section.end}
								className={({ isActive }) =>
									cn(
										"group flex h-10 items-center gap-3 rounded-full border px-4 text-[0.8125rem] font-medium whitespace-nowrap transition-colors lg:h-11.5 lg:border-0 lg:px-3.5 lg:text-sm",
										isActive
											? "border-secondary bg-secondary text-secondary-foreground lg:bg-accent lg:font-semibold lg:text-heading"
											: "border-border bg-card text-muted-foreground hover:text-heading lg:bg-transparent lg:hover:bg-accent/60",
									)
								}
							>
								<Icon
									aria-hidden="true"
									className="hidden size-4.5 group-aria-[current=page]:text-highlight lg:block"
								/>
								{section.label}
								{section.to === accountNav.orders.to &&
									user.pendingOrders > 0 && (
										<span className="ml-0.5 rounded-full bg-accent px-1.5 text-[0.6875rem]/5 font-semibold text-highlight lg:ml-auto lg:bg-secondary lg:px-2 lg:text-secondary-foreground">
											{user.pendingOrders}
											<span className="sr-only"> aguardando pagamento</span>
										</span>
									)}
							</NavLink>
						</li>
					))}
				</ul>

				<div className="mt-3 hidden border-t border-border pt-3 lg:block">
					<Link
						to="/"
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
