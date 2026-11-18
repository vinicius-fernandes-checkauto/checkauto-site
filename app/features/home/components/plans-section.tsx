import { Link, useNavigate } from "react-router";

import { CircleCheckIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { cartLink } from "~/shared/config/navigation";
import { plans } from "~/shared/config/plans";
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

export function PlansSection() {
	const navigate = useNavigate();

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

	return (
		<section
			id="pacotes"
			aria-labelledby="pacotes-titulo"
			className="mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-4 py-16 sm:px-8 lg:py-24"
		>
			<div className="flex flex-col items-center gap-3 text-center">
				<SectionEyebrow>Pacotes</SectionEyebrow>
				<h2 id="pacotes-titulo" className="text-h2-sm lg:text-h2">
					Nossos planos
				</h2>
			</div>

			<ul className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3 md:items-stretch">
				{plans.map((plan) => (
					<li
						key={plan.id}
						className={cn(
							"flex flex-col gap-6 rounded-3xl border p-6 lg:p-7",
							plan.recommended
								? "border-transparent surface-inverse md:-my-4 md:py-10"
								: "border-border bg-card",
						)}
					>
						<div className="flex flex-col gap-3">
							{plan.recommended && (
								<p className="flex w-fit items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-caption font-semibold text-primary-foreground">
									<CircleCheckIcon aria-hidden="true" className="size-4" />
									Plano recomendado
								</p>
							)}
							<h3 className="text-h4">{plan.name}</h3>
							<p className="flex items-baseline gap-1.5 text-heading">
								<span className="text-small">R$</span>
								<span className="text-stat">{plan.price}</span>
								<span className="text-small text-muted-foreground">/cada</span>
							</p>
							{plan.description && (
								<p className="text-small text-muted-foreground">
									{plan.description}
								</p>
							)}
						</div>

						<div className="flex flex-1 flex-col gap-3 border-t pt-5">
							<p className="text-small font-semibold text-heading">
								Informações
							</p>
							<ul className="flex flex-col gap-2.5">
								{plan.features.map((feature) => (
									<li
										key={feature}
										className="flex items-center gap-2.5 text-small"
									>
										<CircleCheckIcon
											aria-hidden="true"
											className="size-5 shrink-0 text-highlight"
										/>
										{feature}
									</li>
								))}
								<li className="flex items-center gap-2.5 text-small">
									<CircleCheckIcon
										aria-hidden="true"
										className="size-5 shrink-0 text-highlight"
									/>
									<Link
										to={plan.moreUrl}
										className="font-semibold text-heading underline underline-offset-4 hover:decoration-2"
									>
										E muito mais
										<span className="sr-only"> no {plan.name}</span>
									</Link>
								</li>
							</ul>
						</div>

						<div className="flex flex-col items-center gap-2">
							<Button
								type="button"
								onClick={() => handleSelect(plan.id)}
								variant={plan.recommended ? "default" : "secondary"}
								className="w-full"
							>
								Consultar
								<span className="sr-only"> com o {plan.name}</span>
							</Button>
							<Link
								to={plan.detailsUrl}
								className="inline-flex min-h-11 items-center text-small font-medium text-heading underline underline-offset-4 hover:decoration-2"
							>
								Detalhes do plano
								<span className="sr-only"> {plan.name}</span>
							</Link>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
