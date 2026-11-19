import { Link } from "react-router";

import { AccountAvatar } from "~/features/account/components/account-avatar";
import type { AccountUser } from "~/features/account/lib/account";
import {
	ChevronDownIcon,
	FileTextIcon,
	HouseIcon,
	LogOutIcon,
	MapPinIcon,
	ShoppingBagIcon,
	UserRoundIcon,
	WalletIcon,
} from "~/shared/components/icons";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/shared/components/ui/dropdown-menu";
import { accountNav } from "~/shared/config/navigation";
import { cn } from "~/shared/lib/utils";

type HeaderAccountProps = {
	user?: AccountUser;
	cartCount?: number;
	className?: string;
};

const accountMenu = [
	{ ...accountNav.home, icon: HouseIcon },
	{ ...accountNav.orders, icon: FileTextIcon },
	{ ...accountNav.credits, icon: WalletIcon },
	{ ...accountNav.profile, icon: UserRoundIcon },
	{ ...accountNav.addresses, icon: MapPinIcon },
];

function SignInLink() {
	return (
		<Link
			to="/entrar"
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
	);
}

function AccountMenu({ user }: { user: AccountUser }) {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger
				aria-label={`Minha conta: ${user.name}`}
				className="group flex min-h-11 items-center gap-2.5 rounded-full border border-border bg-card p-1 transition-colors outline-none hover:bg-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring data-[state=open]:bg-muted sm:border-0 sm:bg-transparent sm:pr-3.5"
			>
				<AccountAvatar name={user.name} />
				<span className="hidden text-sm font-semibold whitespace-nowrap text-heading sm:inline">
					Minha conta
				</span>
				<ChevronDownIcon
					aria-hidden="true"
					className="hidden size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 sm:block"
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-68">
				<DropdownMenuLabel className="flex items-center gap-3">
					<AccountAvatar name={user.name} className="size-10" />
					<span className="flex min-w-0 flex-col">
						<span className="truncate text-sm font-semibold text-heading">
							{user.name}
						</span>
						<span className="truncate text-xs font-normal text-muted-foreground">
							{user.email}
						</span>
					</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{accountMenu.map(({ icon: Icon, ...link }) => (
						<DropdownMenuItem key={link.to} asChild>
							<Link to={link.to}>
								<Icon aria-hidden="true" className="text-muted-foreground" />
								{link.label}
								{link.to === accountNav.orders.to && user.pendingOrders > 0 && (
									<span className="ml-auto rounded-full bg-secondary px-2 text-[0.6875rem]/5 font-semibold text-secondary-foreground">
										{user.pendingOrders}
										<span className="sr-only"> aguardando pagamento</span>
									</span>
								)}
							</Link>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive" asChild>
					<Link to="/">
						<LogOutIcon aria-hidden="true" />
						Sair
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function HeaderAccount({
	user,
	cartCount = 0,
	className,
}: HeaderAccountProps) {
	const itemsLabel = cartCount === 1 ? "item" : "itens";
	const badge = cartCount > 99 ? "99+" : String(cartCount);

	return (
		<div
			className={cn(
				"flex shrink-0 items-center gap-1.5 sm:gap-1 sm:rounded-full sm:border sm:border-border sm:bg-card sm:p-1",
				className,
			)}
		>
			{user ? <AccountMenu user={user} /> : <SignInLink />}
			<Link
				to="/carrinho"
				aria-label={`Carrinho, ${cartCount} ${itemsLabel}`}
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
