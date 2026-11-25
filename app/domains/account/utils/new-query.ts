import { plans } from "~/content/plans";

export const defaultPlanId =
	plans.find((plan) => plan.recommended)?.id ?? plans[0].id;

export function readPlanState(state: unknown) {
	if (!state || typeof state !== "object" || !("planId" in state)) return null;
	const { planId } = state;
	return plans.some((plan) => plan.id === planId) ? String(planId) : null;
}
