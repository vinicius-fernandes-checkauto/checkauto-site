/** biome-ignore-all lint/a11y/useSemanticElements: <> */
import { type ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router";

import ticks from "~/assets/brand/symbol-ticks.webp";
import {
	BadgeCheckIcon,
	CheckIcon,
	MinusIcon,
} from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { cartLink } from "~/shared/config/navigation";
import {
	corporatePlan,
	type Plan,
	planFeatures,
	plans,
} from "~/shared/config/plans";
import { cn } from "~/shared/lib/utils";

import { focusHeroPlateInput, PLATE_STORAGE_KEY } from "./plate-form";
import { SectionEyebrow } from "./section-eyebrow";

const PLAN_STORAGE_KEY = "checkauto:plan";

function readPlate() {
	try {
		return sessionStorage.getItem(PLATE_STORAGE_KEY);
	} catch {
		return null;
	}
}

const columns =
	"grid grid-cols-[minmax(0,1.15fr)_repeat(3,minmax(0,1fr))] gap-x-4";

function IncludedSeal({ className }: { className?: string }) {
	return (
		<BadgeCheckIcon
			role="img"
			aria-label="Incluso"
			className={cn("shrink-0 fill-highlight text-background", className)}
		/>
	);
}

const recommendedIndex = Math.max(
	0,
	plans.findIndex((plan) => plan.recommended),
);

function PlanCard({
	plan,
	onSelect,
	children,
	className,
}: {
	plan: Plan;
	onSelect: (planId: string) => void;
	children?: ReactNode;
	className?: string;
}) {
	return (
		<article
			data-plan
			className={cn(
				"relative flex flex-col gap-5 rounded-3xl border p-5",
				plan.recommended
					? "border-transparent surface-inverse bg-background text-foreground"
					: "border-border bg-card",
				className,
			)}
		>
			{plan.recommended && (
				<span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-highlight px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.06em] whitespace-nowrap text-secondary-foreground uppercase">
					Plano recomendado
				</span>
			)}
			<div className="flex flex-col gap-1.5">
				<p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-highlight uppercase">
					{plan.kicker}
				</p>
				<h3 className="text-2xl font-medium tracking-tight">
					{plan.shortName}
				</h3>
				<p className="text-sm/5 text-muted-foreground lg:min-h-15">
					{plan.description}
				</p>
			</div>
			<p className="flex items-baseline gap-1.5 tabular-nums">
				<span className="text-sm font-medium">R$</span>
				<span className="text-4xl/none font-semibold tracking-tight">
					{plan.price}
				</span>
				<span className="text-sm text-muted-foreground">/cada</span>
			</p>
			{children}
			<Button
				variant={plan.recommended ? "default" : "outline"}
				size="sm"
				className="mt-auto w-full"
				onClick={() => onSelect(plan.id)}
			>
				Consultar
				<span className="sr-only"> com o {plan.name}</span>
			</Button>
		</article>
	);
}

function FeatureList({ plan }: { plan: Plan }) {
	return (
		<ul className="flex flex-col border-t border-foreground/15">
			{planFeatures.map((feature) => {
				const included = plan.features.includes(feature);

				return (
					<li
						key={feature}
						className="flex min-h-11.5 items-center gap-3 border-b border-foreground/15 text-[0.9375rem] last:border-b-0"
					>
						{included ? (
							<IncludedSeal className="size-5.5" />
						) : (
							<MinusIcon
								aria-hidden="true"
								className="size-5 shrink-0 text-muted-foreground"
							/>
						)}
						<span
							className={cn(!included && "text-muted-foreground line-through")}
						>
							{feature}
							{!included && <span className="sr-only"> (não incluso)</span>}
						</span>
					</li>
				);
			})}
		</ul>
	);
}

export function PlansSection() {
	const navigate = useNavigate();
	const [active, setActive] = useState(recommendedIndex);

	function handleSelect(planId: string) {
		try {
			sessionStorage.setItem(PLAN_STORAGE_KEY, planId);
		} catch {}

		if (readPlate()) {
			navigate(cartLink.to);
			return;
		}

		focusHeroPlateInput();
	}

	const activePlan = plans[active];

	return (
		<div className="relative isolate overflow-hidden">
			<span
				aria-hidden="true"
				style={{ maskImage: `url(${ticks})` }}
				className="pointer-events-none absolute -right-24 -bottom-12 -z-10 aspect-878/389 w-80 bg-brand-green/15 mask-contain mask-no-repeat max-lg:hidden lg:-right-20 lg:-bottom-16 lg:w-136"
			/>
			<section
				id="pacotes"
				aria-labelledby="pacotes-titulo"
				className="mx-auto flex w-full max-w-7xl flex-col px-4 py-16 sm:px-8 lg:py-28"
			>
				<div className="flex max-w-2xl flex-col gap-3 lg:gap-4">
					<SectionEyebrow>Consultas veiculares</SectionEyebrow>
					<h2
						id="pacotes-titulo"
						className="text-3xl/tight font-medium tracking-tight text-balance lg:text-5xl/tight"
					>
						Escolha a consulta ideal para você.
					</h2>
					<p className="text-muted-foreground lg:text-lg">
						Pacotes personalizados para a sua necessidade: três opções, com
						acesso online e resultado após a confirmação do pagamento.
					</p>
				</div>

				<div className="mt-8 lg:hidden">
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
						<PlanCard plan={activePlan} onSelect={handleSelect}>
							<FeatureList plan={activePlan} />
						</PlanCard>
					</div>
				</div>

				<div className="mt-16 hidden lg:block">
					<div className={columns}>
						<div aria-hidden="true" />
						{plans.map((plan) => (
							<PlanCard key={plan.id} plan={plan} onSelect={handleSelect} />
						))}
					</div>

					<table className="mt-10 block w-full text-left">
						<caption className="block border-b border-border pb-3.5 text-left text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
							Principais itens de cada pacote
						</caption>
						<thead className="sr-only">
							<tr>
								<th scope="col">Item</th>
								{plans.map((plan) => (
									<th key={plan.id} scope="col">
										{plan.name}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="block">
							{planFeatures.map((feature) => (
								<tr
									key={feature}
									className={cn(
										columns,
										"min-h-15 items-center border-b border-border",
									)}
								>
									<th scope="row" className="text-[0.9375rem] font-medium">
										{feature}
									</th>
									{plans.map((plan) => (
										<td key={plan.id} className="flex justify-center">
											{plan.features.includes(feature) ? (
												<IncludedSeal className="size-6" />
											) : (
												<MinusIcon
													role="img"
													aria-label="Não incluso"
													className="size-4.5 text-muted-foreground"
												/>
											)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div
					data-plan
					className="mt-4 flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 lg:mt-14 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)_auto] lg:items-center lg:gap-8 lg:px-8 lg:py-7"
				>
					<div className="flex flex-col gap-1.5">
						<p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-highlight uppercase">
							{corporatePlan.kicker}
						</p>
						<h3 className="text-2xl font-medium tracking-tight">
							{corporatePlan.name}
						</h3>
						<p className="text-sm/5.5 text-muted-foreground">
							{corporatePlan.description}
						</p>
					</div>
					<ul className="flex flex-col gap-2.5 py-1.5 lg:flex-row lg:flex-wrap lg:gap-x-6">
						{corporatePlan.segments.map((segment) => (
							<li key={segment} className="flex items-center gap-2.5 text-sm">
								<CheckIcon
									aria-hidden="true"
									className="size-4.5 shrink-0 text-highlight"
								/>
								{segment}
							</li>
						))}
					</ul>
					<Button asChild size="sm">
						<Link to={corporatePlan.cta.to}>{corporatePlan.cta.label}</Link>
					</Button>
				</div>

				<p className="mt-6 max-w-[72ch] text-xs/5 text-muted-foreground">
					Valores apresentados com base nos planos vigentes da plataforma
					Checkauto e sujeitos a alteração. Consulte as condições atualizadas
					antes da compra.
				</p>
			</section>
		</div>
	);
}
