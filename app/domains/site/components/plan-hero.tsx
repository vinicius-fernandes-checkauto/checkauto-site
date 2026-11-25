import { Link, useNavigate } from "react-router";

import ring from "~/assets/brand/symbol-ring-blue.webp";
import {
	type Plan,
	planFeatures,
	plans,
	sharedExtraInfoCount,
} from "~/content/plans";
import {
	IncludedMark,
	MissingMark,
} from "~/domains/site/components/plan-marks";
import { PlateForm } from "~/domains/site/components/plate-form";
import { SectionEyebrow } from "~/domains/site/components/section-eyebrow";
import {
	PLAN_PLATE_INPUT_ID,
	savePlan,
} from "~/domains/site/lib/plan-selection";
import { ChevronRightIcon } from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

function PlanSwitcher({ current }: { current: Plan }) {
	return (
		<nav aria-label="Pacotes" className="self-start">
			<ul className="flex gap-1 rounded-full border border-border bg-card p-1">
				{plans.map((plan) => {
					const active = plan.id === current.id;

					return (
						<li key={plan.id}>
							<Link
								to={plan.detailsUrl}
								aria-current={active ? "page" : undefined}
								className={cn(
									"inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors",
									active
										? "bg-secondary text-secondary-foreground"
										: "text-muted-foreground hover:text-heading",
								)}
							>
								{plan.shortName}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

export function PlanHero({ plan }: { plan: Plan }) {
	const navigate = useNavigate();

	return (
		<section
			aria-labelledby="pacote-titulo"
			className="relative isolate overflow-hidden"
		>
			<span
				aria-hidden="true"
				style={{ maskImage: `url(${ring})` }}
				className="pointer-events-none absolute -top-52 -right-60 -z-10 aspect-896/900 w-150 rotate-200 bg-brand-green/14 mask-contain mask-no-repeat max-lg:hidden"
			/>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 pt-4 pb-14 sm:px-8 lg:pb-16">
				<nav aria-label="Você está em">
					<ol className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
						<li>
							<Link to="/" className="transition-colors hover:text-heading">
								Início
							</Link>
						</li>
						<li aria-hidden="true">
							<ChevronRightIcon className="size-3.5" />
						</li>
						<li>
							<Link
								to="/#pacotes"
								className="transition-colors hover:text-heading"
							>
								Pacotes
							</Link>
						</li>
						<li aria-hidden="true">
							<ChevronRightIcon className="size-3.5" />
						</li>
						<li aria-current="page" className="font-medium text-heading">
							{plan.name}
						</li>
					</ol>
				</nav>

				<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
					<div className="flex flex-col gap-5">
						<PlanSwitcher current={plan} />
						<div className="flex flex-col gap-2.5">
							<div className="flex flex-wrap items-center gap-2.5">
								<SectionEyebrow className="text-sm/5">
									{plan.kicker}
								</SectionEyebrow>
								{plan.recommended && (
									<span className="rounded-full bg-brand-green px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.06em] text-brand-blue uppercase">
										Plano recomendado
									</span>
								)}
							</div>
							<h1
								id="pacote-titulo"
								className="text-4xl/tight font-medium tracking-tight text-heading lg:text-[3.25rem]/[1.05]"
							>
								Checkauto{" "}
								<span className="text-highlight">{plan.shortName}</span>
							</h1>
							<p className="max-w-[46ch] text-lg/7 text-muted-foreground">
								{plan.longDescription}
							</p>
						</div>
						<div className="flex flex-wrap items-baseline gap-3">
							<p className="flex items-baseline gap-1.5 tabular-nums">
								<span className="font-semibold">R$</span>
								<span className="text-5xl/none font-semibold tracking-tight">
									{plan.price}
								</span>
								<span className="text-muted-foreground">/consulta</span>
							</p>
							<span className="rounded-full bg-brand-blue/7 px-3 py-1 text-[0.8125rem] font-semibold text-heading">
								{plan.infoCount} informações
							</span>
						</div>
						<PlateForm
							inputId={PLAN_PLATE_INPUT_ID}
							onSubmitted={() => {
								savePlan(plan.id);
								navigate("/carrinho");
							}}
						/>
						<Link
							to="/ainda-nao-tenho-placa"
							className="-mt-3 inline-flex min-h-11 w-fit items-center px-5 text-sm/5.5 font-medium text-heading underline decoration-1 underline-offset-4 hover:text-highlight hover:decoration-2"
						>
							Ainda não tenho a placa
						</Link>
					</div>

					<div className="relative isolate flex flex-col gap-3.5 overflow-hidden rounded-4xl bg-linear-to-b from-navy-600 to-navy-900 p-7 text-white shadow-[0_32px_64px_-32px_--alpha(var(--color-brand-blue)/60%)]">
						<span
							aria-hidden="true"
							style={{ maskImage: `url(${ring})` }}
							className="pointer-events-none absolute -right-24 -bottom-28 -z-10 aspect-896/900 w-76 bg-brand-green/16 mask-contain mask-no-repeat"
						/>
						<SectionEyebrow className="text-brand-green">
							O que vem no {plan.shortName}
						</SectionEyebrow>
						<p className="text-2xl/snug font-medium">
							{plan.infoCount} informações sobre o veículo em um extrato só
						</p>
						<ul className="mt-1 grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
							{planFeatures.map((feature) => {
								const included = plan.features.includes(feature);

								return (
									<li
										key={feature}
										className={cn(
											"flex items-center gap-2.5 text-sm",
											!included && "text-white/50",
										)}
									>
										{included ? (
											<IncludedMark className="bg-brand-green text-brand-blue" />
										) : (
											<MissingMark />
										)}
										{feature}
										{!included && (
											<span className="sr-only"> (não incluso)</span>
										)}
									</li>
								);
							})}
						</ul>
						<p className="border-t border-white/12 pt-3 text-[0.8125rem] text-mist">
							+ {sharedExtraInfoCount} informações em todos os pacotes
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
