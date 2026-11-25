import { Outlet, redirect } from "react-router";

import { AccountHeader } from "~/domains/account/components/account-header";
import { AccountSidebar } from "~/domains/account/components/account-sidebar";
import {
	authOptions,
	getAuthRedirect,
} from "~/domains/auth/services/auth.service";
import { SiteFooter } from "~/domains/site/components/site-footer";
import { SkipLink } from "~/shared/components/skip-link";
import { getSession } from "~/shared/lib/session";

import type { Route } from "./+types/conta";

function requireSession() {
	const session = getSession();
	const redirectTo = getAuthRedirect(session);
	if (!session || redirectTo) {
		throw redirect(redirectTo ?? authOptions.pages.signIn);
	}
	return session;
}

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
	() => {
		requireSession();
	},
];

export function clientLoader() {
	return { user: requireSession().user };
}

export function HydrateFallback() {
	return (
		<div className="flex min-h-dvh items-center justify-center bg-background">
			<p role="status" className="text-sm text-muted-foreground">
				Carregando sua conta…
			</p>
		</div>
	);
}

export default function AccountLayout({ loaderData }: Route.ComponentProps) {
	const { user } = loaderData;

	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<SkipLink />
			<AccountHeader user={user} />
			<div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-[minmax(0,1fr)] content-start items-start gap-4 px-4 pt-2 pb-18 sm:px-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8 lg:pt-10">
				<AccountSidebar user={user} />
				<main id="conteudo" tabIndex={-1} className="min-w-0 outline-none">
					<Outlet />
				</main>
			</div>
			<SiteFooter />
		</div>
	);
}
