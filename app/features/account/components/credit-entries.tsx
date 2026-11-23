import { useState } from "react";

import {
	type CreditEntry,
	type CreditFilter,
	creditFilters,
	formatCurrency,
	formatDate,
} from "~/features/account/lib/credits";
import {
	ArrowDownLeftIcon,
	ArrowUpRightIcon,
	WalletIcon,
} from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

function Amount({ entry }: { entry: CreditEntry }) {
	const credit = entry.kind === "credit";

	return (
		<span
			className={cn(
				"font-semibold whitespace-nowrap tabular-nums",
				credit ? "text-highlight" : "text-heading",
			)}
		>
			{credit ? "+" : "−"} {formatCurrency(entry.amount)}
			<span className="sr-only">{credit ? " de entrada" : " de saída"}</span>
		</span>
	);
}

function KindIcon({ entry }: { entry: CreditEntry }) {
	const credit = entry.kind === "credit";
	const Icon = credit ? ArrowDownLeftIcon : ArrowUpRightIcon;

	return (
		<span
			aria-hidden="true"
			className={cn(
				"flex size-9 shrink-0 items-center justify-center rounded-full",
				credit
					? "bg-brand-green/15 text-highlight"
					: "bg-brand-blue/6 text-heading",
			)}
		>
			<Icon className="size-4" />
		</span>
	);
}

export function CreditEntries({ entries }: { entries: CreditEntry[] }) {
	const [filter, setFilter] = useState<CreditFilter>("all");
	const visible =
		filter === "all"
			? entries
			: entries.filter((entry) => entry.kind === filter);

	return (
		<section
			aria-labelledby="creditos-lancamentos"
			className="flex flex-col gap-4"
		>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h2
					id="creditos-lancamentos"
					className="text-xl/tight font-medium tracking-tight"
				>
					Lançamentos
				</h2>
				<fieldset className="flex gap-1 rounded-full bg-brand-blue/6 p-1">
					<legend className="sr-only">Filtrar lançamentos</legend>
					{creditFilters.map((item) => (
						<button
							key={item.id}
							type="button"
							aria-pressed={filter === item.id}
							onClick={() => setFilter(item.id)}
							className="h-9 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-heading aria-pressed:bg-card aria-pressed:text-heading aria-pressed:shadow-[0_4px_14px_-6px_--alpha(var(--color-brand-blue)/30%)]"
						>
							{item.label}
						</button>
					))}
				</fieldset>
			</div>

			{visible.length === 0 ? (
				<div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-brand-blue/20 px-6 py-12 text-center">
					<span className="flex size-12 items-center justify-center rounded-full bg-brand-blue/6 text-heading">
						<WalletIcon aria-hidden="true" className="size-5" />
					</span>
					<p className="font-semibold text-heading">Nenhum lançamento</p>
					<p className="max-w-[40ch] text-sm/6 text-muted-foreground">
						Créditos de compras, estornos e bônus aparecem aqui.
					</p>
				</div>
			) : (
				<div className="overflow-hidden rounded-3xl border border-border bg-card">
					<table className="w-full text-left text-sm max-md:hidden">
						<thead className="border-b border-border text-xs font-medium tracking-wide text-muted-foreground uppercase">
							<tr>
								<th scope="col" className="py-3.5 pl-6 font-medium">
									Data
								</th>
								<th scope="col" className="px-4 py-3.5 font-medium">
									Histórico
								</th>
								<th scope="col" className="px-4 py-3.5 font-medium">
									Tipo
								</th>
								<th scope="col" className="px-4 py-3.5 font-medium">
									Expiração
								</th>
								<th scope="col" className="py-3.5 pr-6 text-right font-medium">
									Valor
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{visible.map((entry) => (
								<tr key={entry.id}>
									<td className="py-4 pl-6 whitespace-nowrap text-muted-foreground tabular-nums">
										{formatDate(entry.date)}
									</td>
									<td className="px-4 py-4">
										<div className="flex items-center gap-3">
											<KindIcon entry={entry} />
											<div className="flex min-w-0 flex-col">
												<span className="font-medium text-heading">
													{entry.description}
												</span>
												{entry.detail && (
													<span className="text-xs text-muted-foreground">
														{entry.detail}
													</span>
												)}
											</div>
										</div>
									</td>
									<td className="px-4 py-4">
										<span className="rounded-full bg-brand-blue/6 px-2.5 py-1 text-xs font-medium text-heading">
											{entry.category}
										</span>
									</td>
									<td className="px-4 py-4 whitespace-nowrap text-muted-foreground tabular-nums">
										{entry.expiresAt ? formatDate(entry.expiresAt) : "—"}
									</td>
									<td className="py-4 pr-6 text-right">
										<Amount entry={entry} />
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<ul className="divide-y divide-border md:hidden">
						{visible.map((entry) => (
							<li key={entry.id} className="flex items-start gap-3 p-4">
								<KindIcon entry={entry} />
								<div className="flex min-w-0 flex-1 flex-col gap-1">
									<div className="flex items-start justify-between gap-3">
										<span className="text-sm/5 font-medium text-heading">
											{entry.description}
										</span>
										<span className="text-sm/5">
											<Amount entry={entry} />
										</span>
									</div>
									<p className="text-xs/5 text-muted-foreground">
										{formatDate(entry.date)} · {entry.category}
										{entry.detail && ` · ${entry.detail}`}
									</p>
									{entry.expiresAt && (
										<p className="text-xs/5 text-muted-foreground">
											Expira em {formatDate(entry.expiresAt)}
										</p>
									)}
								</div>
							</li>
						))}
					</ul>
				</div>
			)}
		</section>
	);
}
