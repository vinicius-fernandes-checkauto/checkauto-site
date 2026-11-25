import { demoTransactions } from "~/domains/account/account.mock";
import { AccountPageHeader } from "~/domains/account/components/account-page-header";
import { TransactionList } from "~/domains/account/components/transaction-list";

import type { Route } from "./+types/conta.transacoes";

export const meta: Route.MetaFunction = () => [
	{ title: "Histórico de transações | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export default function AccountTransactions() {
	return (
		<div className="flex flex-col gap-8">
			<AccountPageHeader
				title="Histórico de transações"
				description="Pagamentos das suas consultas. Use o código para encontrar a consulta no histórico."
			/>
			<TransactionList transactions={demoTransactions} />
		</div>
	);
}
