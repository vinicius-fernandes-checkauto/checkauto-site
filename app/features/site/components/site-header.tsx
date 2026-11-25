import { Link } from "react-router";

import { accountNav, headerNav } from "~/@content/navigation";
import { HeaderCart } from "~/features/site/components/header-cart";
import { BrandAvatar } from "~/shared/components/brand-avatar";
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
import { useScrolled } from "~/shared/hooks/use-scrolled";
import { useSession } from "~/shared/hooks/use-session";
import { cn } from "~/shared/lib/utils";

function MobileMenu({ signedIn }: { signedIn: boolean }) {
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
						{headerNav.map(({ to, label }) => (
							<li key={to}>
								<SheetClose asChild>
									<Link
										to={to}
										className="flex min-h-12 items-center rounded-full px-4 font-medium text-heading transition-colors hover:bg-brand-blue/6"
									>
										{label}
									</Link>
								</SheetClose>
							</li>
						))}
					</ul>
				</nav>
				<SheetFooter className="gap-2 border-t border-border pb-6 sm:hidden">
					<SheetClose asChild>
						{signedIn ? (
							<Button asChild variant="secondary" className="w-full">
								<Link to={accountNav.queries.to}>Minha conta</Link>
							</Button>
						) : (
							<Button asChild className="w-full">
								<Link to="/entrar">Entrar</Link>
							</Button>
						)}
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}

type SiteHeaderProps = { carCount?: number };

export function SiteHeader({ carCount = 0 }: SiteHeaderProps) {
	const scrolled = useScrolled();
	const { data: session, status } = useSession();

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

				{/* Main Navigation */}
				<nav aria-label="Principal" className="mx-auto hidden xl:block">
					<ul className="flex items-center gap-1">
						{headerNav.map(({ to, label }) => (
							<li key={to}>
								<Link
									to={to}
									className="relative inline-flex min-h-11 items-center px-3 text-sm/5.5 font-medium whitespace-nowrap text-heading transition-colors after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-brand-blue after:transition-transform hover:after:scale-x-100"
								>
									{label}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<div className="ml-auto flex shrink-0 items-center gap-1.5 xl:ml-0">
					<HeaderCart count={carCount} />
					{session ? (
						<Link
							to={accountNav.queries.to}
							aria-label={`Minha conta: ${session.user.name}`}
							className="hidden rounded-full sm:inline-flex"
						>
							<BrandAvatar />
						</Link>
					) : (
						<Button
							asChild
							size="sm"
							className={cn(
								"hidden px-6 sm:inline-flex",
								status === "loading" && "invisible",
							)}
						>
							<Link to="/entrar">Entrar</Link>
						</Button>
					)}
				</div>

				<MobileMenu signedIn={status === "authenticated"} />
			</div>
		</header>
	);
}
