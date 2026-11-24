import { Link, useParams } from "react-router";

import { plans } from "~/content/plans";
import { PlanComparison } from "~/features/site/components/plan-comparison";
import { PlanHero } from "~/features/site/components/plan-hero";
import { PlanInfoGroups } from "~/features/site/components/plan-info-groups";
import { Button } from "~/shared/components/ui/button";

import type { Route } from "./+types/_site.pacotes.$planId";

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
			<PlanHero plan={plan} />
			<PlanInfoGroups plan={plan} />
			<PlanComparison plan={plan} />
		</div>
	);
}
