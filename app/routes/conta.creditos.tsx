import { AccountPageHeader } from "~/features/account/components/account-page-header";
import { CreditEntries } from "~/features/account/components/credit-entries";
import { CreditsSummary } from "~/features/account/components/credits-summary";
import {
	demoCreditEntries,
	summarizeCredits,
} from "~/features/account/lib/credits";

import type { Route } from "./+types/conta.creditos";

export const meta: Route.MetaFunction = () => [
	{ title: "Meus créditos | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export default function AccountCredits() {
	const summary = summarizeCredits(demoCreditEntries);

	return (
		<div className="flex flex-col gap-8">
			<AccountPageHeader
				title="Meus créditos"
				description="Saldo da sua conta corrente para usar em novas consultas."
			/>
			<CreditsSummary {...summary} />
			<CreditEntries entries={demoCreditEntries} />
		</div>
	);
}
