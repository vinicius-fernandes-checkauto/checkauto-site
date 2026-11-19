import { useEffect, useState } from "react";
import { Link } from "react-router";

import type { AccountUser } from "~/features/account/lib/account";
import { CheckautoLogo } from "~/shared/components/checkauto-logo";
import { MenuIcon, UserRoundIcon } from "~/shared/components/icons";
import { HeaderAccount } from "~/shared/components/layout/header-account";
import { Button } from "~/shared/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/shared/components/ui/sheet";
import { cn } from "~/shared/lib/utils";
import type { NavLink } from "~/shared/types";

export const headerNav: NavLink[] = [
	{ label: "Dados da consulta", to: "/#dados-da-consulta" },
	{ label: "Por que Checkauto", to: "/#por-que-checkauto" },
	{ label: "Como funciona", to: "/#como-funciona" },
	{ label: "Pacotes", to: "/#pacotes" },
	{ label: "Lojista", to: "/#hora-de-vender" },
	{ label: "FAQ", to: "/#faq" },
];

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
			<SheetContent side="right" aria-describedby={undefined}>
				<SheetHeader className="pr-20">
					<SheetTitle>Menu</SheetTitle>
				</SheetHeader>
				<nav aria-label="Menu" className="px-3 pb-6">
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
					<SheetClose asChild>
						<Link
							to="/conta"
							className="mt-4 flex min-h-12 items-center gap-3 rounded-full bg-accent px-4 font-semibold text-heading transition-colors hover:bg-green-100 sm:hidden"
						>
							<UserRoundIcon
								aria-hidden="true"
								className="size-5 text-highlight"
							/>
							Minha conta
						</Link>
					</SheetClose>
				</nav>
			</SheetContent>
		</Sheet>
	);
}

export function SiteHeader({ user }: { user?: AccountUser }) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		function update() {
			setScrolled(window.scrollY > 8);
		}

		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);

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
				<MobileMenu />
			</div>
		</header>
	);
}
