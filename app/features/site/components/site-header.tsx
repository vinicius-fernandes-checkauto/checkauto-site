import { Link } from "react-router";

import type { AccountUser } from "~/features/account/lib/account";
import { SiteHeaderAccount } from "~/features/site/components/site-header-account";
import { CheckautoLogo } from "~/shared/components/checkauto-logo";
import { MenuIcon } from "~/shared/components/icons";
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
import { accountNav, headerNav } from "~/shared/config/navigation";
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
							className="relative inline-flex min-h-11 items-center px-3 text-sm/5.5 font-medium whitespace-nowrap text-heading transition-colors after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-brand-blue after:transition-transform hover:after:scale-x-100"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

function MobileMenu() {
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
			<SheetContent side="top" aria-describedby={undefined}>
				<SheetHeader className="pr-20">
					<SheetTitle>Menu</SheetTitle>
				</SheetHeader>
				<nav aria-label="Menu" className="px-3">
					<ul className="flex flex-col gap-1">
						{headerNav.map((link) => (
							<li key={link.to}>
								<SheetClose asChild>
									<Link
										to={link.to}
										className="flex min-h-12 items-center rounded-full px-4 font-medium text-heading transition-colors hover:bg-brand-blue/6"
									>
										{link.label}
									</Link>
								</SheetClose>
							</li>
						))}
					</ul>
				</nav>
				<SheetFooter className="gap-2 border-t border-border pb-6 sm:hidden">
					<SheetClose asChild>
						<Button asChild variant="secondary" className="w-full">
							<Link to={accountNav.home.to}>{accountNav.home.label}</Link>
						</Button>
					</SheetClose>
					<SheetClose asChild>
						<Button asChild variant="ghost" className="w-full">
							<Link to={accountNav.orders.to}>{accountNav.orders.label}</Link>
						</Button>
					</SheetClose>
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
				"z-40 border-b border-transparent bg-background transition-shadow duration-300 max-lg:sticky max-lg:top-0 max-lg:border-border",
				scrolled &&
					"max-lg:shadow-[0_10px_28px_-14px_--alpha(var(--color-brand-blue)/35%)]",
			)}
		>
			<div className="relative mx-auto flex min-h-19 w-full max-w-7xl items-center gap-1.5 px-4 sm:gap-2 sm:px-8">
				<CheckautoLogo className="h-6 sm:h-7" />
				<HeaderNav />
				<SiteHeaderAccount user={user} className="ml-auto xl:ml-0" />
				<MobileMenu />
			</div>
		</header>
	);
}
