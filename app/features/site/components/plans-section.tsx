import { Link, useNavigate } from "react-router";

import {
	focusHeroPlateInput,
	PLATE_STORAGE_KEY,
} from "~/features/site/components/plate-form";
import { SectionEyebrow } from "~/features/site/components/section-eyebrow";
import { CheckIcon } from "~/shared/components/icons";
import { PlansComparison } from "~/shared/components/plans-comparison";
import { Button } from "~/shared/components/ui/button";
import { corporatePlan, PLAN_STORAGE_KEY, plans } from "~/shared/content/plans";

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
			navigate("/carrinho");
			return;
		}

		focusHeroPlateInput();
	}

	return (
		<div className="relative isolate overflow-clip">
			<section
				id="pacotes"
				aria-labelledby="pacotes-titulo"
				className="mx-auto flex w-full max-w-7xl flex-col px-4 py-16 sm:px-8 lg:py-6"
			>
				<div className="flex max-w-2xl flex-col gap-3 lg:hidden">
					<SectionEyebrow>Pacotes</SectionEyebrow>
					<h2
						id="pacotes-titulo"
						className="text-3xl/tight font-medium tracking-tight text-balance"
					>
						Escolha a consulta ideal para você.
					</h2>
					<p className="text-muted-foreground">
						Todos os pacotes trazem {plans[0].infoCount} informações essenciais.
					</p>
				</div>

				<div className="mt-8 lg:mt-0">
					<PlansComparison
						onSelect={handleSelect}
						intro={
							<>
								<SectionEyebrow>Pacotes</SectionEyebrow>
								<h2
									id="pacotes-titulo-desktop"
									className="text-[2rem]/[1.12] font-medium tracking-tight"
								>
									Escolha a consulta ideal para você.
								</h2>
							</>
						}
					/>
				</div>

				<div
					data-plan
					className="mt-4 flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 lg:mt-10 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)_auto] lg:items-center lg:gap-8 lg:px-8 lg:py-7"
				>
					<div className="flex flex-col gap-1.5">
						<p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-highlight uppercase group-data-recommended/plan:text-brand-green">
							{corporatePlan.kicker}
						</p>
						<h3 className="text-2xl font-medium tracking-tight group-data-recommended/plan:text-white">
							{corporatePlan.name}
						</h3>
						<p className="text-sm/5.5 text-muted-foreground">
							{corporatePlan.description}
						</p>
					</div>
					<ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 py-1.5 sm:grid-cols-2">
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
