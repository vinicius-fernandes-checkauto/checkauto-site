import { AccountPageHeader } from "~/features/account/components/account-page-header";
import { TransactionList } from "~/features/account/components/transaction-list";
import { demoTransactions } from "~/features/account/lib/transactions";

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
