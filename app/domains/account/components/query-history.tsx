import { debounce, useQueryStates } from "nuqs";
import { useEffect, useId, useState } from "react";
import { useNavigation, useRevalidator } from "react-router";
import { toast } from "sonner";

import { Pagination } from "~/domains/account/components/pagination";
import { StatusBadge } from "~/domains/account/components/status-badge";
import {
	getStatementUrl,
	requeryQuery,
} from "~/domains/account/services/account.service";
import type {
	QueryPage,
	VehicleQuery,
} from "~/domains/account/types/account.types";
import {
	canOpenStatement,
	isRunning,
	MAX_QUERY_MONTHS,
	PAGE_SIZES,
	pageSize,
	queryPeriod,
	querySearchParams,
	queryStatus,
} from "~/domains/account/utils/queries";
import {
	FileSearchIcon,
	FileTextIcon,
	LoaderCircleIcon,
	RefreshCwIcon,
	SearchIcon,
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
import { Input } from "~/shared/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/shared/components/ui/tooltip";
import { toApiError } from "~/shared/lib/api";
import { cn } from "~/shared/lib/utils";

const POLL_INTERVAL = 30_000;

type RequeryButtonProps = {
	query: VehicleQuery;
	disabled: boolean;
	onRequery: (query: VehicleQuery) => void;
};

function RequeryButton({ query, disabled, onRequery }: RequeryButtonProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					type="button"
					size="icon-sm"
					disabled={disabled}
					onClick={() => onRequery(query)}
				>
					<RefreshCwIcon aria-hidden="true" />
					<span className="sr-only">Reconsultar a placa {query.plate}</span>
				</Button>
			</TooltipTrigger>
			<TooltipContent>Reconsultar</TooltipContent>
		</Tooltip>
	);
}

type StatementButtonProps = {
	query: VehicleQuery;
	loading: boolean;
	disabled: boolean;
	onOpen: (query: VehicleQuery) => void;
};

function StatementButton({
	query,
	loading,
	disabled,
	onOpen,
}: StatementButtonProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					type="button"
					variant="outline"
					size="icon-sm"
					disabled={disabled}
					aria-busy={loading}
					onClick={() => onOpen(query)}
				>
					{loading ? (
						<LoaderCircleIcon aria-hidden="true" className="animate-spin" />
					) : (
						<FileTextIcon aria-hidden="true" />
					)}
					<span className="sr-only">
						{loading
							? `Gerando o extrato da placa ${query.plate}`
							: `Ver extrato da placa ${query.plate} (abre em nova aba)`}
					</span>
				</Button>
			</TooltipTrigger>
			<TooltipContent>Ver extrato</TooltipContent>
		</Tooltip>
	);
}

type QueryActionsProps = {
	query: VehicleQuery;
	requerying: boolean;
	onRequery: (query: VehicleQuery) => void;
	opening: string | null;
	onOpen: (query: VehicleQuery) => void;
};

function QueryActions({
	query,
	requerying,
	onRequery,
	opening,
	onOpen,
}: QueryActionsProps) {
	return (
		<div className="flex items-center justify-end gap-2">
			{query.canRequery && (
				<RequeryButton
					query={query}
					disabled={requerying}
					onRequery={onRequery}
				/>
			)}
			{canOpenStatement(query.status) && (
				<StatementButton
					query={query}
					loading={opening === query.id}
					disabled={opening !== null}
					onOpen={onOpen}
				/>
			)}
		</div>
	);
}

export function QueryHistory({ queries, total }: QueryPage) {
	const baseId = useId();
	const [filters, setFilters] = useQueryStates(querySearchParams, {
		shallow: false,
		history: "replace",
	});
	const navigation = useNavigation();
	const revalidator = useRevalidator();
	const [requerying, setRequerying] = useState<string | null>(null);
	const [opening, setOpening] = useState<string | null>(null);

	const loading =
		navigation.state === "loading" || revalidator.state === "loading";
	const size = pageSize(filters.itens);
	const pageCount = Math.max(1, Math.ceil(total / size));
	const page = Math.min(Math.max(1, filters.pagina), pageCount);
	const hasFilters = Boolean(filters.busca || filters.de || filters.ate);
	const period = queryPeriod(filters);
	const running = queries.some(({ status }) => isRunning(status));

	useEffect(() => {
		if (!running) return;

		const timer = setInterval(() => {
			void revalidator.revalidate();
		}, POLL_INTERVAL);
		return () => clearInterval(timer);
	}, [running, revalidator]);

	async function requery(query: VehicleQuery) {
		setRequerying(query.id);
		try {
			await requeryQuery(query.id);
			toast.success("Reconsulta iniciada", {
				description: `Placa ${query.plate}. O resultado aparece aqui em instantes.`,
			});
			await revalidator.revalidate();
		} catch (error) {
			toast.error(toApiError(error).message);
		} finally {
			setRequerying(null);
		}
	}

	async function openStatement(query: VehicleQuery) {
		setOpening(query.id);
		try {
			const url = await getStatementUrl(query.id);
			const tab = window.open(url, "_blank");
			if (tab) {
				tab.opener = null;
			} else {
				toast.success("Extrato pronto", {
					description: `Placa ${query.plate}. O navegador bloqueou a nova aba.`,
					duration: Number.POSITIVE_INFINITY,
					action: {
						label: "Abrir extrato",
						onClick: () => window.open(url, "_blank", "noopener"),
					},
				});
			}
		} catch (error) {
			toast.error("Não foi possível abrir o extrato", {
				description: toApiError(error).message,
			});
		} finally {
			setOpening(null);
		}
	}

	return (
		<section aria-label="Consultas realizadas" className="flex flex-col gap-4">
			<fieldset className="grid grid-cols-2 gap-3 rounded-3xl border border-border bg-card p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
				<legend className="sr-only">Filtrar consultas</legend>
				<Field className="col-span-2 sm:col-span-1">
					<FieldLabel htmlFor={`${baseId}-busca`}>Busca</FieldLabel>
					<div className="relative">
						<SearchIcon
							aria-hidden="true"
							className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
						/>
						<Input
							id={`${baseId}-busca`}
							type="search"
							value={filters.busca}
							onChange={(event) =>
								void setFilters(
									{ busca: event.target.value, pagina: 1 },
									{ limitUrlUpdates: debounce(400) },
								)
							}
							placeholder="Placa, chassi ou código"
							autoComplete="off"
							className="pl-10"
						/>
					</div>
				</Field>
				<Field className="col-span-2 sm:col-span-1">
					<FieldLabel htmlFor={`${baseId}-periodo`}>Período</FieldLabel>
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
				<Button
					type="button"
					variant="ghost"
					size="sm"
					disabled={!hasFilters}
					onClick={() =>
						void setFilters({ busca: null, de: null, ate: null, pagina: 1 })
					}
					className="col-span-2 sm:col-span-1"
				>
					Limpar filtros
				</Button>
				{period.exceeded && (
					<p className="col-span-2 px-1 text-xs/5 text-muted-foreground sm:col-span-3">
						O período máximo é de {MAX_QUERY_MONTHS} meses. Mostrando as
						consultas dos {MAX_QUERY_MONTHS} meses anteriores à data final.
					</p>
				)}
			</fieldset>

			<p id={`${baseId}-resultado`} role="status" className="sr-only">
				{loading ? "Carregando consultas…" : `${total} consultas encontradas`}
			</p>

			{queries.length === 0 ? (
				<Empty>
					<EmptyMedia>
						<FileSearchIcon />
					</EmptyMedia>
					<EmptyTitle>
						{hasFilters
							? "Nenhuma consulta encontrada"
							: "Nenhuma consulta ainda"}
					</EmptyTitle>
					<EmptyDescription>
						{hasFilters
							? "Confira a busca ou o período e tente de novo."
							: `As consultas dos últimos ${MAX_QUERY_MONTHS} meses aparecem aqui.`}
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
							{queries.map((query) => (
								<tr key={query.id}>
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
										{query.date}
									</td>
									<td className="px-4 py-3">
										<StatusBadge tone={queryStatus[query.status].tone}>
											{queryStatus[query.status].label}
										</StatusBadge>
									</td>
									<td className="py-2 pr-6">
										<QueryActions
											query={query}
											requerying={requerying !== null}
											onRequery={requery}
											opening={opening}
											onOpen={openStatement}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<ul className="divide-y divide-border md:hidden">
						{queries.map((query) => (
							<li key={query.id} className="flex items-center gap-3 p-4">
								<div className="flex min-w-0 flex-1 flex-col gap-2">
									<div className="flex items-start justify-between gap-3">
										<span className="text-sm/5 font-semibold tracking-wider text-heading">
											{query.plate}
										</span>
										<StatusBadge tone={queryStatus[query.status].tone}>
											{queryStatus[query.status].label}
										</StatusBadge>
									</div>
									<p className="text-xs/5 text-muted-foreground">
										Consulta <span className="tabular-nums">{query.code}</span>{" "}
										· {query.plan}
									</p>
									<p className="text-xs/5 text-muted-foreground tabular-nums">
										{query.date}
									</p>
								</div>
								<QueryActions
									query={query}
									requerying={requerying !== null}
									onRequery={requery}
									opening={opening}
									onOpen={openStatement}
								/>
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
					label="Páginas do histórico de consultas"
				/>
			)}
		</section>
	);
}
