import { Outlet } from "react-router";

import { SiteFooter } from "~/shared/components/layout/site-footer";
import { SiteHeader } from "~/shared/components/layout/site-header";
import { SkipLink } from "~/shared/components/layout/skip-link";

export default function SiteLayout() {
	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<SkipLink />
			<SiteHeader />
			<main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
				<Outlet />
			</main>
			<SiteFooter />
		</div>
	);
}
