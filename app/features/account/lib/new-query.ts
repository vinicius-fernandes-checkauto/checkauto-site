import { z } from "zod";

import { plans } from "~/shared/content/plans";
import { plateSchema } from "~/shared/lib/plate";

export const newQuerySchema = z.object({
	planId: z.string().refine((id) => plans.some((plan) => plan.id === id), {
		error: "Escolha um pacote.",
	}),
	plate: plateSchema,
});

export type NewQueryValues = z.input<typeof newQuerySchema>;
export type NewQuery = z.output<typeof newQuerySchema>;

export const defaultPlanId =
	plans.find((plan) => plan.recommended)?.id ?? plans[0].id;

export function readPlanState(state: unknown) {
	if (!state || typeof state !== "object" || !("planId" in state)) return null;
	const { planId } = state;
	return plans.some((plan) => plan.id === planId) ? String(planId) : null;
}
