import { Link, NavLink } from "react-router";

import type { AccountUser } from "~/features/account/lib/account";
import { BrandAvatar } from "~/shared/components/brand-avatar";
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
			className="hidden min-w-0 flex-col gap-3 lg:sticky lg:top-24 lg:flex"
		>
			<div className="flex items-center gap-3 px-2 pb-2">
				<BrandAvatar name={user.name} className="size-13" />
				<div className="flex min-w-0 flex-col">
					<p className="truncate text-sm font-semibold text-heading">
						{user.name}
					</p>
					<p className="truncate text-xs text-muted-foreground">{user.email}</p>
				</div>
			</div>

			<nav aria-label="Seções da conta">
				<ul className="flex flex-col gap-0.5">
					{sections.map(({ icon: Icon, ...section }) => (
						<li key={section.to}>
							<NavLink
								to={section.to}
								end={section.end}
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
								{section.to === accountNav.orders.to &&
									user.pendingOrders > 0 && (
										<span className="ml-auto rounded-full bg-secondary px-2 text-[0.6875rem]/5 font-semibold text-secondary-foreground">
											{user.pendingOrders}
											<span className="sr-only"> aguardando pagamento</span>
										</span>
									)}
							</NavLink>
						</li>
					))}
				</ul>

				<div className="mt-3 border-t border-border pt-3">
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
