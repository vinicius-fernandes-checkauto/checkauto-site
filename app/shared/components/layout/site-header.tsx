import { Link } from "react-router";

import type { AccountUser } from "~/features/account/lib/account";
import { CheckautoLogo } from "~/shared/components/checkauto-logo";
import { MenuIcon } from "~/shared/components/icons";
import { HeaderAccount } from "~/shared/components/layout/header-account";
import { Button } from "~/shared/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/shared/components/ui/sheet";
import { headerNav } from "~/shared/config/navigation";
import { useScrolled } from "~/shared/hooks/use-scrolled";
import { cn } from "~/shared/lib/utils";

function HeaderNav() {
	return (
		<nav aria-label="Principal" className="mx-auto hidden xl:block">
			<ul className="flex items-center gap-1">
				{headerNav.map((link) => (
					<li key={link.to}>
						<Link
							to={link.to}
							className="relative inline-flex min-h-11 items-center px-3 text-sm/5.5 font-medium whitespace-nowrap text-heading transition-colors after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform hover:text-highlight hover:after:scale-x-100"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

function MobileMenu({ user }: { user?: AccountUser }) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="outline"
					size="icon-sm"
					className="shrink-0 sm:size-12 xl:hidden"
				>
					<MenuIcon aria-hidden="true" />
					<span className="sr-only">Abrir menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent
				side="top"
				aria-describedby={undefined}
				className="max-h-dvh overflow-y-auto data-[side=top]:rounded-b-none"
			>
				<SheetHeader className="pr-20">
					<SheetTitle>Menu</SheetTitle>
				</SheetHeader>
				<nav aria-label="Menu" className="px-3 pb-4">
					<ul className="flex flex-col gap-1">
						{headerNav.map((link) => (
							<li key={link.to}>
								<SheetClose asChild>
									<Link
										to={link.to}
										className="flex min-h-12 items-center rounded-full px-4 font-medium text-heading transition-colors hover:bg-muted hover:text-highlight"
									>
										{link.label}
									</Link>
								</SheetClose>
							</li>
						))}
					</ul>
				</nav>
				<SheetFooter>
					<SheetClose asChild>
						<Button asChild className="w-full">
							<Link to="/conta">Minha conta</Link>
						</Button>
					</SheetClose>
					{!user && (
						<SheetClose asChild>
							<Button asChild variant="ghost" className="w-full">
								<Link to="/conta/pedidos">Meus pedidos</Link>
							</Button>
						</SheetClose>
					)}
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}

export function SiteHeader({ user }: { user?: AccountUser }) {
	const scrolled = useScrolled();

	return (
		<header
			className={cn(
				"sticky top-0 z-40 border-b transition-colors duration-300",
				scrolled
					? "border-border bg-background/90 backdrop-blur-md"
					: "border-transparent bg-background",
			)}
		>
			<div className="relative mx-auto flex min-h-19 w-full max-w-7xl items-center gap-1.5 px-4 sm:gap-2 sm:px-8">
				<CheckautoLogo className="h-6 sm:h-7" />
				<HeaderNav />
				<HeaderAccount user={user} className="ml-auto xl:ml-0" />
				<MobileMenu user={user} />
			</div>
		</header>
	);
}
