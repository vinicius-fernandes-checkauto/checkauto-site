import { Outlet } from "react-router";

import { SiteFooter } from "~/features/site/components/site-footer";
import { SiteHeader } from "~/features/site/components/site-header";
import { SkipLink } from "~/shared/components/skip-link";

export default function SiteLayout() {
	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<SkipLink />
			<SiteHeader
				user={{
					name: "John Doe",
					email: "john.doe@example.com",
					pendingOrders: 10,
					personType: "Pessoa física",
				}}
			/>
			<main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
				<Outlet />
			</main>
			<SiteFooter />
		</div>
	);
}
