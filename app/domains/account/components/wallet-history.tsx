import { useQueryStates } from "nuqs";
import { useId } from "react";
import { useNavigation, useRevalidator } from "react-router";

import { Pagination } from "~/domains/account/components/pagination";
import type {
	WalletMovement,
	WalletPage,
} from "~/domains/account/types/account.types";
import {
	formatAmount,
	MAX_QUERY_MONTHS,
	PAGE_SIZES,
	pageSize,
	queryPeriod,
} from "~/domains/account/utils/queries";
import {
	formatSignedAmount,
	walletSearchParams,
} from "~/domains/account/utils/wallet";
import {
	ArrowDownLeftIcon,
	ArrowUpRightIcon,
	ReceiptTextIcon,
} from "~/shared/components/icons";
import { PeriodFilter } from "~/shared/components/period-filter";
import { Button } from "~/shared/components/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyMedia,
	EmptyTitle,
} from "~/shared/components/ui/empty";
import { Field, FieldLabel } from "~/shared/components/ui/field";
import { cn } from "~/shared/lib/utils";

const amountTone = {
	in: "text-highlight",
	out: "text-destructive",
	none: "text-heading",
};

function MovementIcon({ direction }: Pick<WalletMovement, "direction">) {
	const Icon = direction === "out" ? ArrowUpRightIcon : ArrowDownLeftIcon;

	return (
		<span
			aria-hidden="true"
			className={cn(
				"flex size-9 shrink-0 items-center justify-center rounded-full",
				direction === "in" && "bg-brand-green/15 text-highlight",
				direction === "out" && "bg-destructive/10 text-destructive",
				direction === "none" && "bg-brand-blue/6 text-heading",
			)}
		>
			<Icon className="size-4" />
		</span>
	);
}

function Amount({ movement }: { movement: WalletMovement }) {
	return (
		<span
			className={cn(
				"font-semibold whitespace-nowrap tabular-nums",
				amountTone[movement.direction],
			)}
		>
			{formatSignedAmount(movement.amount)}
		</span>
	);
}

export function WalletHistory({
	movements,
	total,
}: Omit<WalletPage, "balance">) {
	const baseId = useId();
	const [filters, setFilters] = useQueryStates(walletSearchParams, {
		shallow: false,
		history: "replace",
	});
	const navigation = useNavigation();
	const revalidator = useRevalidator();

	const loading =
		navigation.state === "loading" || revalidator.state === "loading";
	const size = pageSize(filters.itens);
	const pageCount = Math.max(1, Math.ceil(total / size));
	const page = Math.min(Math.max(1, filters.pagina), pageCount);
	const hasFilters = Boolean(filters.de || filters.ate);
	const period = queryPeriod(filters);

	return (
		<section
			aria-labelledby={`${baseId}-titulo`}
			className="flex flex-col gap-4"
		>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<h2
					id={`${baseId}-titulo`}
					className="text-lg/tight font-semibold tracking-tight"
				>
					Movimentações
				</h2>
				<fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,16rem)_auto] sm:items-end">
					<legend className="sr-only">Filtrar movimentações</legend>
					<Field>
						<FieldLabel htmlFor={`${baseId}-periodo`} className="sr-only">
							Período
						</FieldLabel>
						<PeriodFilter
							id={`${baseId}-periodo`}
							value={
								filters.de && filters.ate
									? { from: filters.de, to: filters.ate }
									: null
							}
							onChange={(next) =>
								void setFilters({
									de: next?.from ?? null,
									ate: next?.to ?? null,
									pagina: 1,
								})
							}
							defaultLabel={`Últimos ${MAX_QUERY_MONTHS} meses`}
							maxMonths={MAX_QUERY_MONTHS}
						/>
					</Field>
					{hasFilters && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() =>
								void setFilters({ de: null, ate: null, pagina: 1 })
							}
						>
							Limpar filtros
						</Button>
					)}
				</fieldset>
			</div>
			{period.exceeded && (
				<p className="px-1 text-xs/5 text-muted-foreground">
					O período máximo é de {MAX_QUERY_MONTHS} meses. Mostrando as
					movimentações dos {MAX_QUERY_MONTHS} meses anteriores à data final.
				</p>
			)}

			<p role="status" className="sr-only">
				{loading
					? "Carregando movimentações…"
					: `${total} movimentações encontradas`}
			</p>

			{movements.length === 0 ? (
				<Empty>
					<EmptyMedia>
						<ReceiptTextIcon />
					</EmptyMedia>
					<EmptyTitle>Nenhuma movimentação no período</EmptyTitle>
					<EmptyDescription>
						Créditos de pedidos, consultas e estornos aparecem aqui.
					</EmptyDescription>
				</Empty>
			) : (
				<div
					aria-busy={loading}
					className={cn(
						"overflow-hidden rounded-3xl border border-border bg-card transition-opacity",
						loading && "opacity-60",
					)}
				>
					<table className="w-full text-left text-sm max-md:hidden">
						<thead className="border-b border-border text-xs font-medium tracking-wide text-muted-foreground uppercase">
							<tr>
								<th scope="col" className="py-3 pl-6 font-medium">
									Movimento
								</th>
								<th scope="col" className="px-4 py-3 font-medium">
									Data
								</th>
								<th scope="col" className="px-4 py-3 text-right font-medium">
									Valor
								</th>
								<th scope="col" className="py-3 pr-6 text-right font-medium">
									Saldo após
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{movements.map((movement) => (
								<tr key={movement.id}>
									<td className="py-3 pl-6">
										<div className="flex items-center gap-3">
											<MovementIcon direction={movement.direction} />
											<div className="flex min-w-0 flex-col">
												<span className="font-medium text-heading">
													{movement.label}
												</span>
												{movement.reason && (
													<span className="truncate text-xs/5 text-muted-foreground">
														{movement.reason}
													</span>
												)}
											</div>
										</div>
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-muted-foreground tabular-nums">
										{movement.date}
									</td>
									<td className="px-4 py-3 text-right">
										<Amount movement={movement} />
									</td>
									<td className="py-3 pr-6 text-right whitespace-nowrap text-muted-foreground tabular-nums">
										{formatAmount(movement.balanceAfter)}
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<ul className="divide-y divide-border md:hidden">
						{movements.map((movement) => (
							<li key={movement.id} className="flex items-center gap-3 p-4">
								<MovementIcon direction={movement.direction} />
								<div className="flex min-w-0 flex-1 flex-col gap-0.5">
									<span className="text-sm/5 font-medium text-heading">
										{movement.label}
									</span>
									<span className="text-xs/5 text-muted-foreground tabular-nums">
										{movement.date}
									</span>
									{movement.reason && (
										<span className="truncate text-xs/5 text-muted-foreground">
											{movement.reason}
										</span>
									)}
								</div>
								<div className="flex shrink-0 flex-col items-end gap-0.5 text-sm/5">
									<Amount movement={movement} />
									<span className="text-xs/5 text-muted-foreground tabular-nums">
										Saldo {formatAmount(movement.balanceAfter)}
									</span>
								</div>
							</li>
						))}
					</ul>
				</div>
			)}

			{total > PAGE_SIZES[0] && (
				<Pagination
					page={page}
					pageCount={pageCount}
					total={total}
					pageSize={size}
					pageSizes={PAGE_SIZES}
					onPageChange={(pagina) =>
						void setFilters({ pagina }, { history: "push" })
					}
					onPageSizeChange={(itens) => void setFilters({ itens, pagina: 1 })}
					label="Páginas do histórico de transações"
				/>
			)}
		</section>
	);
}
