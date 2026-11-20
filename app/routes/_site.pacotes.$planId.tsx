import { Link, useNavigate, useParams } from "react-router";

import ring from "~/assets/brand/symbol-ring-blue.webp";
import {
	PLATE_STORAGE_KEY,
	PlateForm,
} from "~/features/home/components/plate-form";
import { SectionEyebrow } from "~/features/home/components/section-eyebrow";
import {
	CheckIcon,
	ChevronRightIcon,
	MinusIcon,
} from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import {
	PLAN_STORAGE_KEY,
	type Plan,
	planFeatures,
	planIncludes,
	planInfoGroups,
	plans,
	sharedExtraInfoCount,
} from "~/shared/config/plans";
import { cn } from "~/shared/lib/utils";

import type { Route } from "./+types/_site.pacotes.$planId";

const PLATE_INPUT_ID = "placa-pacote";

export const meta: Route.MetaFunction = ({ params }) => {
	const plan = plans.find(({ id }) => id === params.planId);

	return [
		{ title: plan ? `${plan.name} | Checkauto` : "Pacote | Checkauto" },
		{
			name: "description",
			content:
				plan?.longDescription ?? "Pacotes de consulta veicular Checkauto.",
		},
	];
};

function savePlan(planId: string) {
	try {
		sessionStorage.setItem(PLAN_STORAGE_KEY, planId);
	} catch {}
}

function IncludedMark({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"flex size-5 shrink-0 items-center justify-center rounded-full bg-highlight text-white",
				className,
			)}
		>
			<CheckIcon aria-hidden="true" className="size-3" strokeWidth={3.2} />
		</span>
	);
}

function MissingMark({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"size-5 shrink-0 rounded-full border-[1.5px] border-dashed border-current opacity-40",
				className,
			)}
		/>
	);
}

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

function Hero({ plan }: { plan: Plan }) {
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
							inputId={PLATE_INPUT_ID}
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

function InfoGroups({ plan }: { plan: Plan }) {
	return (
		<section
			aria-labelledby="pacote-informacoes"
			className="border-y border-border bg-card"
		>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-16 sm:px-8 lg:py-20">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
					<div className="flex flex-col gap-3">
						<SectionEyebrow>Tudo o que você recebe</SectionEyebrow>
						<h2
							id="pacote-informacoes"
							className="text-3xl/tight font-normal tracking-tight text-heading lg:text-4xl/tight"
						>
							Entenda cada informação do{" "}
							<span className="text-highlight">{plan.shortName}</span>
						</h2>
					</div>
					<p className="max-w-sm text-[0.9375rem]/6 text-muted-foreground">
						Em linguagem simples: o que é cada item e por que ele importa na
						hora de comprar.
					</p>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{planInfoGroups.map((group) => {
						const included = group.items.filter((item) =>
							planIncludes(plan, item),
						).length;

						return (
							<article
								key={group.title}
								className={cn(
									"flex flex-col gap-3.5 rounded-3xl border p-5.5",
									group.differentiator
										? "border-highlight/25 bg-[color-mix(in_oklab,var(--color-brand-green)_10%,var(--card))]"
										: "border-border bg-background",
								)}
							>
								<div className="flex items-center justify-between gap-2">
									<h3 className="text-[1.0625rem] font-semibold text-heading">
										{group.title}
									</h3>
									<span className="text-xs font-semibold text-muted-foreground">
										{group.differentiator
											? `${included} de ${group.items.length} neste pacote`
											: `${group.items.length} infos`}
									</span>
								</div>
								<ul className="flex flex-col gap-3">
									{group.items.map((item) => {
										const has = planIncludes(plan, item);

										return (
											<li
												key={item.name}
												className={cn("flex gap-2.5", !has && "opacity-55")}
											>
												{has ? (
													<IncludedMark className="mt-0.5" />
												) : (
													<MissingMark className="mt-0.5 text-heading" />
												)}
												<span className="flex flex-col gap-0.5">
													<span className="text-sm font-semibold text-heading">
														{item.name}
														{!has && (
															<span className="sr-only"> (não incluso)</span>
														)}
													</span>
													<span className="text-[0.8125rem]/5 text-muted-foreground">
														{item.description}
													</span>
												</span>
											</li>
										);
									})}
								</ul>
							</article>
						);
					})}
				</div>
			</div>
		</section>
	);
}

function Comparison({ plan }: { plan: Plan }) {
	const navigate = useNavigate();

	function handleSelect(planId: string) {
		savePlan(planId);

		let plate: string | null = null;
		try {
			plate = sessionStorage.getItem(PLATE_STORAGE_KEY);
		} catch {}

		if (plate) {
			navigate("/carrinho");
			return;
		}

		const input = document.getElementById(PLATE_INPUT_ID);
		input?.scrollIntoView({ block: "center" });
		input?.focus({ preventScroll: true });
	}

	const highlight = (id: string) => id === plan.id && "bg-brand-green/12";

	return (
		<section aria-labelledby="pacote-comparacao">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-16 sm:px-8 lg:py-20">
				<div className="flex flex-col gap-3">
					<SectionEyebrow>Compare os pacotes</SectionEyebrow>
					<h2
						id="pacote-comparacao"
						className="text-3xl/tight font-normal tracking-tight text-heading lg:text-4xl/tight"
					>
						As 18 informações, lado a lado
					</h2>
				</div>

				<div className="relative -mx-4 min-w-0 overflow-x-auto px-4 sm:mx-0 sm:px-0">
					<table className="w-full min-w-150 border-separate border-spacing-0 overflow-hidden rounded-3xl border border-border bg-card text-left">
						<caption className="sr-only">
							Comparação das informações de cada pacote
						</caption>
						<thead>
							<tr>
								<th
									scope="col"
									className="border-b border-border px-5 py-4 text-[0.8125rem] font-semibold text-muted-foreground"
								>
									Informação
								</th>
								{plans.map((item) => (
									<th
										key={item.id}
										scope="col"
										className={cn(
											"border-b border-border px-2 py-3 text-center",
											highlight(item.id),
										)}
									>
										<span className="block text-[0.9375rem] font-semibold text-heading">
											{item.shortName}
										</span>
										<span className="block text-xs font-normal text-muted-foreground">
											R$ {item.price}
										</span>
									</th>
								))}
							</tr>
						</thead>
						{planInfoGroups.map((group) => (
							<tbody key={group.title}>
								<tr>
									<th
										scope="rowgroup"
										colSpan={plans.length + 1}
										className="border-t border-border px-5 pt-4 pb-2 text-xs font-semibold tracking-[0.1em] text-highlight uppercase"
									>
										{group.title}
									</th>
								</tr>
								{group.items.map((item) => (
									<tr key={item.name}>
										<th
											scope="row"
											className="border-t border-border/60 px-5 py-2.5 text-sm font-medium text-heading"
										>
											{item.name}
										</th>
										{plans.map((column) => {
											const has = planIncludes(column, item);

											return (
												<td
													key={column.id}
													className={cn(
														"border-t border-border/60 text-center",
														highlight(column.id),
													)}
												>
													{has ? (
														<IncludedMark className="mx-auto" />
													) : (
														<MinusIcon
															aria-hidden="true"
															className="mx-auto size-4 text-muted-foreground"
														/>
													)}
													<span className="sr-only">
														{has ? "Incluso" : "Não incluso"}
													</span>
												</td>
											);
										})}
									</tr>
								))}
							</tbody>
						))}
						<tfoot>
							<tr>
								<td className="border-t border-border" />
								{plans.map((column) => {
									const current = column.id === plan.id;

									return (
										<td
											key={column.id}
											className={cn(
												"border-t border-border px-2.5 py-3.5",
												highlight(column.id),
											)}
										>
											<div className="flex flex-col gap-1">
												<Button
													size="sm"
													variant={current ? "default" : "outline"}
													className="w-full"
													onClick={() => handleSelect(column.id)}
												>
													Consultar
													<span className="sr-only"> com o {column.name}</span>
												</Button>
												{current ? (
													<span className="inline-flex min-h-9 items-center justify-center text-[0.8125rem] font-medium text-muted-foreground">
														Você está aqui
													</span>
												) : (
													<Link
														to={column.detailsUrl}
														className="inline-flex min-h-9 items-center justify-center text-[0.8125rem] font-semibold text-heading underline decoration-1 underline-offset-4 hover:decoration-2"
													>
														Detalhes do plano
														<span className="sr-only"> {column.name}</span>
													</Link>
												)}
											</div>
										</td>
									);
								})}
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</section>
	);
}

export default function PlanDetails() {
	const { planId } = useParams();
	const plan = plans.find(({ id }) => id === planId);

	if (!plan) {
		return (
			<div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-4 py-24 sm:px-8">
				<h1 className="text-3xl font-medium tracking-tight text-heading">
					Pacote não encontrado
				</h1>
				<Button asChild>
					<Link to="/#pacotes">Ver os pacotes</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="bg-background">
			<Hero plan={plan} />
			<InfoGroups plan={plan} />
			<Comparison plan={plan} />
		</div>
	);
}
