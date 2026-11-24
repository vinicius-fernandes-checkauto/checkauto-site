import { AccountPageHeader } from "~/features/account/components/account-page-header";
import { QueryHistory } from "~/features/account/components/query-history";
import { demoQueries } from "~/features/account/lib/queries";

import type { Route } from "./+types/conta.consultas";

export const meta: Route.MetaFunction = () => [
	{ title: "Histórico de consultas | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export default function AccountQueries() {
	return (
		<div className="flex flex-col gap-8">
			<AccountPageHeader
				title="Histórico de consultas"
				description="Todas as consultas feitas na sua conta. Se alguma der erro, é só consultar de novo."
			/>
			<QueryHistory queries={demoQueries} />
		</div>
	);
}
