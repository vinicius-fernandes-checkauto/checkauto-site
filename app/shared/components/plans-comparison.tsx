/** biome-ignore-all lint/a11y/useSemanticElements: <> */
import { type ReactNode, useState } from "react";
import { Link } from "react-router";

import {
	BadgeCheckIcon,
	ChevronDownIcon,
	MinusIcon,
} from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import {
	type Plan,
	type PlanInfoItem,
	planDifferentiatorItems,
	planExtraItems,
	planHighlightItems,
	planIncludes,
	plans,
} from "~/shared/config/plans";
import { cn } from "~/shared/lib/utils";

type ComparisonItem = PlanInfoItem & { hint?: string };

type Row = { kind: "item"; item: ComparisonItem } | { kind: "toggle" };

const toItemRows = (items: ComparisonItem[]): Row[] =>
	items.map((item) => ({ kind: "item", item }));

function comparisonRows(expanded: boolean): Row[] {
	return [
		...toItemRows(planHighlightItems),
		{ kind: "toggle" },
		...(expanded ? toItemRows(planExtraItems) : []),
		...toItemRows(planDifferentiatorItems),
	];
}

function rowHeights(rows: Row[]) {
	return rows
		.map((row) =>
			row.kind === "toggle" ? "2.75rem" : row.item.hint ? "3rem" : "2.5rem",
		)
		.join(" ");
}

const extraCount = planExtraItems.length;

function ExtraInfoChip() {
	return (
		<span className="rounded-full bg-brand-blue/7 px-2.5 py-0.5 text-xs/5 font-semibold text-heading tabular-nums group-data-recommended/plan:bg-brand-green/20 group-data-recommended/plan:text-brand-green">
			+{extraCount}
		</span>
	);
}

function ToggleButton({
	expanded,
	onToggle,
	className,
}: {
	expanded: boolean;
	onToggle: () => void;
	className?: string;
}) {
	return (
		<button
			type="button"
			aria-expanded={expanded}
			onClick={onToggle}
			className={cn(
				"group/toggle flex min-h-11 w-full items-center gap-2 text-left text-[0.9375rem]/5 font-semibold text-heading transition-colors hover:text-highlight",
				className,
			)}
		>
			{expanded
				? "Ocultar informações extras"
				: `+ ${extraCount} informações em todos os pacotes`}
			<ChevronDownIcon
				aria-hidden="true"
				className="ml-auto size-4.5 shrink-0 transition-transform group-aria-expanded/toggle:rotate-180"
			/>
		</button>
	);
}

function planTone(plan: Plan, _index: number) {
	return plan.recommended
		? "border-transparent bg-linear-to-b from-navy-600 via-navy-700 to-navy-900 text-white"
		: "border-border bg-card";
}

function IncludedSeal({ className }: { className?: string }) {
	return (
		<BadgeCheckIcon
			role="img"
			aria-label="Incluso"
			className={cn(
				"shrink-0 fill-highlight text-background group-data-recommended/plan:fill-brand-green group-data-recommended/plan:text-navy-700",
				className,
			)}
		/>
	);
}

const recommendedIndex = Math.max(
	0,
	plans.findIndex((plan) => plan.recommended),
);

function RecommendedBadge() {
	return (
		<span className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-brand-green px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.06em] whitespace-nowrap text-brand-blue uppercase">
			Plano recomendado
		</span>
	);
}

function PlanSummary({ plan }: { plan: Plan }) {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-highlight uppercase group-data-recommended/plan:text-brand-green">
					{plan.kicker}
				</p>
				<h3 className="text-2xl font-medium tracking-tight group-data-recommended/plan:text-white">
					{plan.shortName}
				</h3>
				<p className="text-sm/5 text-muted-foreground group-data-recommended/plan:text-mist lg:hidden">
					{plan.description}
				</p>
			</div>
			<p className="flex items-baseline gap-1.5 tabular-nums">
				<span className="text-sm font-medium">R$</span>
				<span className="text-4xl/none font-semibold tracking-tight">
					{plan.price}
				</span>
				<span className="text-sm text-muted-foreground group-data-recommended/plan:text-mist">
					/cada
				</span>
			</p>
		</div>
	);
}

function SelectButton({
	plan,
	onSelect,
}: {
	plan: Plan;
	onSelect: (planId: string) => void;
}) {
	return (
		<div className="mt-auto flex w-full flex-col gap-1">
			<Button
				variant={plan.recommended ? "default" : "outline"}
				size="sm"
				className="w-full"
				onClick={() => onSelect(plan.id)}
			>
				Consultar
				<span className="sr-only"> com o {plan.name}</span>
			</Button>
			<Link
				to={plan.detailsUrl}
				className="inline-flex min-h-8 items-center justify-center rounded-full text-sm font-semibold text-heading underline decoration-1 underline-offset-4 transition-colors group-data-recommended/plan:text-white hover:decoration-2"
			>
				Detalhes do plano
				<span className="sr-only"> {plan.name}</span>
			</Link>
		</div>
	);
}

function PlanCard({
	plan,
	index,
	onSelect,
	children,
}: {
	plan: Plan;
	index: number;
	onSelect: (planId: string) => void;
	children?: ReactNode;
}) {
	return (
		<article
			data-plan
			data-recommended={plan.recommended || undefined}
			className={cn(
				"group/plan relative flex flex-col gap-5 rounded-3xl border p-5",
				planTone(plan, index),
			)}
		>
			{plan.recommended && <RecommendedBadge />}
			<PlanSummary plan={plan} />
			{children}
			<SelectButton plan={plan} onSelect={onSelect} />
		</article>
	);
}

function PlanColumn({
	plan,
	index,
	rows,
	onSelect,
}: {
	plan: Plan;
	index: number;
	rows: Row[];
	onSelect: (planId: string) => void;
}) {
	return (
		<article
			data-plan
			data-recommended={plan.recommended || undefined}
			className={cn(
				"group/plan relative row-span-full grid grid-rows-subgrid rounded-3xl border px-5 pb-4",
				planTone(plan, index),
			)}
		>
			{plan.recommended && <RecommendedBadge />}
			<div className="sticky top-[var(--plans-sticky-top,0px)] z-10 -mx-5 rounded-t-3xl bg-inherit px-5 pt-5 pb-4 group-data-recommended/plan:bg-navy-600">
				<PlanSummary plan={plan} />
			</div>
			<ul className="contents">
				{rows.map((row) => {
					if (row.kind === "toggle") {
						return (
							<li
								key="extras"
								className="flex items-center justify-center border-t border-foreground/12 group-data-recommended/plan:border-white/12"
							>
								<ExtraInfoChip />
								<span className="sr-only">e mais {extraCount} informações</span>
							</li>
						);
					}

					const { item } = row;
					const included = planIncludes(plan, item);

					return (
						<li
							key={item.name}
							className="flex items-center justify-center border-t border-foreground/12 group-data-recommended/plan:border-white/12"
						>
							{included ? (
								<IncludedSeal className="size-6" />
							) : (
								<MinusIcon
									aria-hidden="true"
									className="size-4.5 text-muted-foreground group-data-recommended/plan:text-mist"
								/>
							)}
							<span className="sr-only">
								{item.name}
								{included ? "" : " (não incluso)"}
							</span>
						</li>
					);
				})}
			</ul>
			<div className="flex border-t border-foreground/12 pt-4 group-data-recommended/plan:border-white/12">
				<SelectButton plan={plan} onSelect={onSelect} />
			</div>
		</article>
	);
}

function FeatureList({
	plan,
	rows,
	expanded,
	onToggle,
}: {
	plan: Plan;
	rows: Row[];
	expanded: boolean;
	onToggle: () => void;
}) {
	return (
		<ul className="flex flex-col border-t border-foreground/15 group-data-recommended/plan:border-white/15">
			{rows.map((row) => {
				if (row.kind === "toggle") {
					return (
						<li
							key="extras"
							className="border-b border-foreground/15 group-data-recommended/plan:border-white/15"
						>
							<ToggleButton
								expanded={expanded}
								onToggle={onToggle}
								className="text-sm group-data-recommended/plan:text-white"
							/>
						</li>
					);
				}

				const { item } = row;
				const included = planIncludes(plan, item);

				return (
					<li
						key={item.name}
						className="flex min-h-11.5 items-center gap-3 border-b border-foreground/15 text-[0.9375rem] group-data-recommended/plan:border-white/15 last:border-b-0"
					>
						{included ? (
							<IncludedSeal className="size-5.5" />
						) : (
							<MinusIcon
								aria-hidden="true"
								className="size-5 shrink-0 text-muted-foreground group-data-recommended/plan:text-mist"
							/>
						)}
						<span
							className={cn(
								!included &&
									"text-muted-foreground line-through group-data-recommended/plan:text-mist",
							)}
						>
							{item.name}
							{item.hint && (
								<span className="text-xs text-muted-foreground group-data-recommended/plan:text-mist">
									{" "}
									({item.hint.toLowerCase()})
								</span>
							)}
							{!included && <span className="sr-only"> (não incluso)</span>}
						</span>
					</li>
				);
			})}
		</ul>
	);
}

type PlansComparisonProps = {
	onSelect: (planId: string) => void;
	intro?: ReactNode;
};

export function PlansComparison({ onSelect, intro }: PlansComparisonProps) {
	const [active, setActive] = useState(recommendedIndex);
	const [expanded, setExpanded] = useState(false);
	const activePlan = plans[active];
	const rows = comparisonRows(expanded);
	const toggle = () => setExpanded((value) => !value);

	return (
		<>
			<div className="lg:hidden">
				<div
					role="tablist"
					aria-label="Pacotes"
					className="grid grid-cols-3 gap-1 rounded-full border border-border bg-card p-1"
				>
					{plans.map((plan, index) => (
						<button
							key={plan.id}
							type="button"
							role="tab"
							id={`pacote-aba-${plan.id}`}
							aria-selected={index === active}
							aria-controls="pacote-painel"
							onClick={() => setActive(index)}
							className={cn(
								"h-10 rounded-full text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
								index === active
									? "bg-secondary text-secondary-foreground"
									: "text-muted-foreground",
							)}
						>
							{plan.shortName}
						</button>
					))}
				</div>
				<div
					id="pacote-painel"
					role="tabpanel"
					aria-labelledby={`pacote-aba-${activePlan.id}`}
					className="mt-6"
				>
					<PlanCard plan={activePlan} index={active} onSelect={onSelect}>
						<FeatureList
							plan={activePlan}
							rows={rows}
							expanded={expanded}
							onToggle={toggle}
						/>
					</PlanCard>
				</div>
			</div>

			<div
				className="hidden grid-cols-[minmax(0,1.15fr)_repeat(3,minmax(0,1fr))] gap-x-4 pt-3 lg:grid"
				style={{ gridTemplateRows: `auto ${rowHeights(rows)} auto` }}
			>
				<div className="row-span-full grid grid-rows-subgrid">
					<div className="flex flex-col gap-2 self-end pb-4">
						{intro}
						<p className="mt-1 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
							Principais itens de cada pacote
						</p>
					</div>
					{rows.map((row) =>
						row.kind === "toggle" ? (
							<div
								key="extras"
								className="flex items-center border-t border-border"
							>
								<ToggleButton expanded={expanded} onToggle={toggle} />
							</div>
						) : (
							<span
								key={row.item.name}
								aria-hidden="true"
								className="flex flex-col justify-center border-t border-border text-[0.9375rem]/5 font-medium last:border-b"
							>
								{row.item.name}
								{row.item.hint && (
									<span className="text-xs font-normal text-muted-foreground">
										{row.item.hint}
									</span>
								)}
							</span>
						),
					)}
				</div>
				{plans.map((plan, index) => (
					<PlanColumn
						key={plan.id}
						plan={plan}
						index={index}
						rows={rows}
						onSelect={onSelect}
					/>
				))}
			</div>
		</>
	);
}
