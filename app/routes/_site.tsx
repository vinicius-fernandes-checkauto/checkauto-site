import { Outlet } from "react-router";

import { SiteFooter } from "~/domains/site/components/site-footer";
import { SiteHeader } from "~/domains/site/components/site-header";
import { SkipLink } from "~/shared/components/skip-link";

export default function SiteLayout() {
	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<SkipLink />
			<SiteHeader carCount={2} />
			<main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
				<Outlet />
			</main>
			<SiteFooter />
		</div>
	);
}
