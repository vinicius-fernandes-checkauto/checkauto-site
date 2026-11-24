import { PLAN_STORAGE_KEY } from "~/@content/plans";

export const PLAN_PLATE_INPUT_ID = "placa-pacote";

export function savePlan(planId: string) {
	try {
		sessionStorage.setItem(PLAN_STORAGE_KEY, planId);
	} catch {}
}
