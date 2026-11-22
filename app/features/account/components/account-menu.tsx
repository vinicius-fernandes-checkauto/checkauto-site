import { Link } from "react-router";

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

const accountMenu = [
	{ ...accountNav.home, icon: HouseIcon },
	{ ...accountNav.orders, icon: FileTextIcon },
	{ ...accountNav.credits, icon: WalletIcon },
	{ ...accountNav.profile, icon: UserRoundIcon },
	{ ...accountNav.addresses, icon: MapPinIcon },
];

type AccountMenuProps = {
	user: AccountUser;
	triggerClassName?: string;
	avatarClassName?: string;
};

export function AccountMenu({
	user,
	triggerClassName,
	avatarClassName,
}: AccountMenuProps) {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger
				aria-label={`Minha conta: ${user.name}`}
				className={cn(
					"flex min-h-11 items-center rounded-full border border-border bg-card p-0.5 transition-colors outline-none hover:bg-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring data-[state=open]:bg-muted sm:border-0 sm:bg-transparent",
					triggerClassName,
				)}
			>
				<BrandAvatar className={avatarClassName} />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-68">
				<DropdownMenuLabel className="flex items-center gap-3">
					<BrandAvatar className="size-12" />
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
