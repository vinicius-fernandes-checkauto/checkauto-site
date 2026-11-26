import { StatusBadge } from "~/domains/account/components/status-badge";
import type { Transaction } from "~/domains/account/types/account.types";
import { formatCurrency, formatDate } from "~/domains/account/utils/credits";
import { transactionStatus } from "~/domains/account/utils/transactions";
import { ReceiptTextIcon } from "~/shared/components/icons";
import {
	Empty,
	EmptyDescription,
	EmptyMedia,
	EmptyTitle,
} from "~/shared/components/ui/empty";
import { cn } from "~/shared/lib/utils";

function TransactionStatusBadge({ status }: { status: Transaction["status"] }) {
	const { label, tone } = transactionStatus[status];

	return <StatusBadge tone={tone}>{label}</StatusBadge>;
}

function Amount({ transaction }: { transaction: Transaction }) {
	const refunded = transaction.status === "refunded";

	return (
		<span
			className={cn(
				"font-semibold whitespace-nowrap tabular-nums",
				refunded ? "text-muted-foreground line-through" : "text-heading",
			)}
		>
			{formatCurrency(transaction.amount)}
		</span>
	);
}

export function TransactionList({
	transactions,
}: {
	transactions: Transaction[];
}) {
	if (transactions.length === 0) {
		return (
			<Empty>
				<EmptyMedia>
					<ReceiptTextIcon />
				</EmptyMedia>
				<EmptyTitle>Nenhuma transação</EmptyTitle>
				<EmptyDescription>
					Os pagamentos das suas consultas aparecem aqui.
				</EmptyDescription>
			</Empty>
		);
	}

	return (
		<div className="overflow-hidden rounded-3xl border border-border bg-card">
			<table className="w-full text-left text-sm max-md:hidden">
				<thead className="border-b border-border text-xs font-medium tracking-wide text-muted-foreground uppercase">
					<tr>
						<th scope="col" className="py-3.5 pl-6 font-medium">
							Data
						</th>
						<th scope="col" className="px-4 py-3.5 font-medium">
							Código da consulta
						</th>
						<th scope="col" className="px-4 py-3.5 font-medium">
							Placa
						</th>
						<th scope="col" className="px-4 py-3.5 font-medium">
							Pacote
						</th>
						<th scope="col" className="px-4 py-3.5 font-medium">
							Status
						</th>
						<th scope="col" className="py-3.5 pr-6 text-right font-medium">
							Valor
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-border">
					{transactions.map((transaction) => (
						<tr key={transaction.id}>
							<td className="py-4 pl-6 whitespace-nowrap text-muted-foreground tabular-nums">
								{formatDate(transaction.date)}
							</td>
							<td className="px-4 py-4 font-medium text-heading tabular-nums">
								{transaction.queryCode}
							</td>
							<td className="px-4 py-4 font-semibold tracking-wider whitespace-nowrap text-heading">
								{transaction.plate}
							</td>
							<td className="px-4 py-4 text-muted-foreground">
								{transaction.plan}
							</td>
							<td className="px-4 py-4">
								<TransactionStatusBadge status={transaction.status} />
							</td>
							<td className="py-4 pr-6 text-right">
								<Amount transaction={transaction} />
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<ul className="divide-y divide-border md:hidden">
				{transactions.map((transaction) => (
					<li key={transaction.id} className="flex flex-col gap-2 p-4">
						<div className="flex items-start justify-between gap-3">
							<span className="text-sm/5 font-semibold tracking-wider text-heading">
								{transaction.plate}
							</span>
							<span className="text-sm/5">
								<Amount transaction={transaction} />
							</span>
						</div>
						<p className="text-xs/5 text-muted-foreground">
							{formatDate(transaction.date)} · Consulta{" "}
							<span className="tabular-nums">{transaction.queryCode}</span> ·{" "}
							{transaction.plan}
						</p>
						<div>
							<TransactionStatusBadge status={transaction.status} />
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
