import { Outlet } from "react-router";

import { AccountHeader } from "~/features/account/components/account-header";
import { AccountSidebar } from "~/features/account/components/account-sidebar";
import { demoAccount } from "~/features/account/lib/account";
import { SiteFooter } from "~/features/site/components/site-footer";
import { SkipLink } from "~/shared/components/skip-link";

export default function AccountLayout() {
	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<SkipLink />
			<AccountHeader user={demoAccount} />
			<div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-[minmax(0,1fr)] content-start items-start gap-4 px-4 pt-2 pb-18 sm:px-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8 lg:pt-10">
				<AccountSidebar user={demoAccount} />
				<main id="conteudo" tabIndex={-1} className="min-w-0 outline-none">
					<Outlet />
				</main>
			</div>
			<SiteFooter />
		</div>
	);
}
