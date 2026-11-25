import { useId, useState } from "react";

import { fieldControlClassName } from "~/domains/account/components/form-field";
import { Pagination } from "~/domains/account/components/pagination";
import { StatusBadge } from "~/domains/account/components/status-badge";
import type {
	QueryFilters,
	VehicleQuery,
} from "~/domains/account/types/account.types";
import {
	filterQueries,
	formatDateTime,
	QUERIES_PER_PAGE,
	queryStatus,
} from "~/domains/account/utils/queries";
import {
	FileSearchIcon,
	RefreshCwIcon,
	SearchIcon,
} from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { cn } from "~/shared/lib/utils";

const emptyFilters: QueryFilters = { plate: "", from: "", to: "" };

function RetryButton({
	query,
	onRetry,
}: {
	query: VehicleQuery;
	onRetry: (code: string) => void;
}) {
	return (
		<Button
			type="button"
			size="sm"
			className="h-9 min-h-9 px-4 text-xs"
			onClick={() => onRetry(query.code)}
		>
			<RefreshCwIcon aria-hidden="true" />
			Consultar
			<span className="sr-only"> novamente a placa {query.plate}</span>
		</Button>
	);
}

export function QueryHistory({
	queries: initial,
}: {
	queries: VehicleQuery[];
}) {
	const baseId = useId();
	const [queries, setQueries] = useState(initial);
	const [filters, setFilters] = useState(emptyFilters);
	const [page, setPage] = useState(1);

	const filtered = filterQueries(queries, filters);
	const pageCount = Math.max(1, Math.ceil(filtered.length / QUERIES_PER_PAGE));
	const current = Math.min(page, pageCount);
	const visible = filtered.slice(
		(current - 1) * QUERIES_PER_PAGE,
		current * QUERIES_PER_PAGE,
	);
	const hasFilters = Boolean(filters.plate || filters.from || filters.to);

	function updateFilter(name: keyof QueryFilters, value: string) {
		setFilters((previous) => ({ ...previous, [name]: value }));
		setPage(1);
	}

	function retry(code: string) {
		setQueries((previous) =>
			previous.map((query) =>
				query.code === code ? { ...query, status: "processing" } : query,
			),
		);
	}

	return (
		<section aria-label="Consultas realizadas" className="flex flex-col gap-4">
			<fieldset className="grid grid-cols-2 gap-3 rounded-3xl border border-border bg-card p-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
				<legend className="sr-only">Filtrar consultas</legend>
				<label className="col-span-2 flex flex-col gap-1.5 sm:col-span-1">
					<span className="px-1 text-[0.8125rem] font-medium text-heading">
						Placa
					</span>
					<span className="relative">
						<SearchIcon
							aria-hidden="true"
							className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
						/>
						<input
							type="search"
							value={filters.plate}
							onChange={(event) => updateFilter("plate", event.target.value)}
							placeholder="Buscar placa"
							autoComplete="off"
							className={cn(
								fieldControlClassName,
								"pl-10 uppercase placeholder:normal-case",
							)}
						/>
					</span>
				</label>
				<label className="flex flex-col gap-1.5">
					<span className="px-1 text-[0.8125rem] font-medium text-heading">
						De
					</span>
					<input
						type="date"
						value={filters.from}
						max={filters.to || undefined}
						onChange={(event) => updateFilter("from", event.target.value)}
						className={cn(
							fieldControlClassName,
							"px-3 max-sm:text-[0.8125rem]",
						)}
					/>
				</label>
				<label className="flex flex-col gap-1.5">
					<span className="px-1 text-[0.8125rem] font-medium text-heading">
						Até
					</span>
					<input
						type="date"
						value={filters.to}
						min={filters.from || undefined}
						onChange={(event) => updateFilter("to", event.target.value)}
						className={cn(
							fieldControlClassName,
							"px-3 max-sm:text-[0.8125rem]",
						)}
					/>
				</label>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					disabled={!hasFilters}
					onClick={() => {
						setFilters(emptyFilters);
						setPage(1);
					}}
					className="col-span-2 sm:col-span-1"
				>
					Limpar filtros
				</Button>
			</fieldset>

			<p id={`${baseId}-resultado`} role="status" className="sr-only">
				{filtered.length} consultas encontradas
			</p>

			{visible.length === 0 ? (
				<div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-brand-blue/20 px-6 py-12 text-center">
					<span className="flex size-12 items-center justify-center rounded-full bg-brand-blue/6 text-heading">
						<FileSearchIcon aria-hidden="true" className="size-5" />
					</span>
					<p className="font-semibold text-heading">
						{hasFilters
							? "Nenhuma consulta encontrada"
							: "Nenhuma consulta ainda"}
					</p>
					<p className="max-w-[40ch] text-sm/6 text-muted-foreground">
						{hasFilters
							? "Confira a placa ou o período e tente de novo."
							: "As consultas que você fizer aparecem aqui."}
					</p>
				</div>
			) : (
				<div className="overflow-hidden rounded-3xl border border-border bg-card">
					<table className="w-full text-left text-sm max-md:hidden">
						<thead className="border-b border-border text-xs font-medium tracking-wide text-muted-foreground uppercase">
							<tr>
								<th scope="col" className="py-3 pl-6 font-medium">
									Código
								</th>
								<th scope="col" className="px-4 py-3 font-medium">
									Placa
								</th>
								<th scope="col" className="px-4 py-3 font-medium">
									Pacote
								</th>
								<th scope="col" className="px-4 py-3 font-medium">
									Data
								</th>
								<th scope="col" className="px-4 py-3 font-medium">
									Status
								</th>
								<th scope="col" className="py-3 pr-6 text-right font-medium">
									<span className="sr-only">Ação</span>
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{visible.map((query) => (
								<tr key={query.code}>
									<td className="py-3 pl-6 font-medium text-heading tabular-nums">
										{query.code}
									</td>
									<td className="px-4 py-3 font-semibold tracking-wider whitespace-nowrap text-heading">
										{query.plate}
									</td>
									<td className="px-4 py-3 text-muted-foreground">
										{query.plan}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-muted-foreground tabular-nums">
										{formatDateTime(query.date)}
									</td>
									<td className="px-4 py-3">
										<StatusBadge tone={queryStatus[query.status].tone}>
											{queryStatus[query.status].label}
										</StatusBadge>
									</td>
									<td className="py-2 pr-6 text-right">
										{query.status === "error" && (
											<RetryButton query={query} onRetry={retry} />
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<ul className="divide-y divide-border md:hidden">
						{visible.map((query) => (
							<li key={query.code} className="flex flex-col gap-2 p-4">
								<div className="flex items-start justify-between gap-3">
									<span className="text-sm/5 font-semibold tracking-wider text-heading">
										{query.plate}
									</span>
									<StatusBadge tone={queryStatus[query.status].tone}>
										{queryStatus[query.status].label}
									</StatusBadge>
								</div>
								<p className="text-xs/5 text-muted-foreground">
									Consulta <span className="tabular-nums">{query.code}</span> ·{" "}
									{query.plan}
								</p>
								<p className="text-xs/5 text-muted-foreground tabular-nums">
									{formatDateTime(query.date)}
								</p>
								{query.status === "error" && (
									<div>
										<RetryButton query={query} onRetry={retry} />
									</div>
								)}
							</li>
						))}
					</ul>
				</div>
			)}

			{filtered.length > QUERIES_PER_PAGE && (
				<Pagination
					page={current}
					pageCount={pageCount}
					total={filtered.length}
					pageSize={QUERIES_PER_PAGE}
					onPageChange={setPage}
					label="Páginas do histórico de consultas"
				/>
			)}
		</section>
	);
}
