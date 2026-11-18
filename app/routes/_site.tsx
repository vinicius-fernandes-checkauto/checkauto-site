import { Outlet } from "react-router";

import { SiteFooter } from "~/shared/components/layout/site-footer";
import { SiteHeader } from "~/shared/components/layout/site-header";

export default function SiteLayout() {
	return (
		<div className="flex min-h-dvh flex-col bg-muted">
			<a
				href="#conteudo"
				className="sr-only rounded-full bg-primary px-5 py-3 text-button text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
			>
				Pular para o conteúdo
			</a>
			<SiteHeader />
			<main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
				<Outlet />
			</main>
			<SiteFooter />
		</div>
	);
}
