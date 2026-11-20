import {
	IncludedMark,
	MissingMark,
} from "~/features/site/components/plan-marks";
import { SectionEyebrow } from "~/features/site/components/section-eyebrow";
import { type Plan, planIncludes, planInfoGroups } from "~/shared/config/plans";
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
