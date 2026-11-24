import { Link, useNavigate } from "react-router";

import {
	type Plan,
	planComparisonItems,
	planIncludes,
	planInfoGroups,
	plans,
} from "~/@content/plans";
import { IncludedMark } from "~/features/site/components/plan-marks";
import { PLATE_STORAGE_KEY } from "~/features/site/components/plate-form";
import { SectionEyebrow } from "~/features/site/components/section-eyebrow";
import {
	PLAN_PLATE_INPUT_ID,
	savePlan,
} from "~/features/site/lib/plan-selection";
import { MinusIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { cn } from "~/shared/lib/utils";

export function PlanComparison({ plan }: { plan: Plan }) {
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

		const input = document.getElementById(PLAN_PLATE_INPUT_ID);
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
						As {planComparisonItems.length} informações, lado a lado
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
