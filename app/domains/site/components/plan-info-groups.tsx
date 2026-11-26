import { type Plan, planComparisonItems, planIncludes } from "~/content/plans";
import {
	IncludedMark,
	MissingMark,
} from "~/domains/site/components/plan-marks";
import { SectionEyebrow } from "~/domains/site/components/section-eyebrow";
import { cn } from "~/shared/lib/utils";

export function PlanInfoGroups({ plan }: { plan: Plan }) {
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
					<p className="max-w-sm text-base/6 text-muted-foreground">
						Em linguagem simples: o que é cada item e por que ele importa na
						hora de comprar.
					</p>
				</div>
				<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{planComparisonItems.map((item) => {
						const has = planIncludes(plan, item);

						return (
							<li
								key={item.name}
								className={cn(
									"flex flex-col gap-2 rounded-3xl border p-4.5",
									item.requires && has
										? "border-highlight/25 bg-brand-green/10"
										: "border-border bg-background",
									!has && "opacity-55",
								)}
							>
								<div className="flex items-start gap-2.5">
									{has ? (
										<IncludedMark className="mt-0.5" />
									) : (
										<MissingMark className="mt-0.5 text-heading" />
									)}
									<h3 className="text-sm/5 font-semibold text-heading">
										{item.name}
										{!has && <span className="sr-only"> (não incluso)</span>}
									</h3>
								</div>
								<p className="text-sm/5 text-muted-foreground">
									{item.description}
								</p>
								{!has && (
									<span
										aria-hidden="true"
										className="mt-auto text-xs font-semibold text-heading"
									>
										Não incluso neste pacote
									</span>
								)}
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
}
