import { type Plan, plans } from "~/shared/content/plans";

export type CartItem = {
	plate: string;
	planId: Plan["id"];
};

export type AppliedCoupon = {
	code: string;
	percent: number;
};

export const demoCoupons: Record<string, number> = {
	BEMVINDO10: 10,
};

export function readCartItem(state: unknown): CartItem | null {
	if (!state || typeof state !== "object" || !("cartItem" in state)) {
		return null;
	}
	const item = state.cartItem as Partial<CartItem> | undefined;
	if (typeof item?.plate !== "string" || typeof item.planId !== "string") {
		return null;
	}
	return { plate: item.plate, planId: item.planId };
}

export function findPlan(planId: Plan["id"]) {
	return plans.find((plan) => plan.id === planId) ?? plans[plans.length - 1];
}

export function priceToCents(price: string) {
	return Math.round(Number(price.replace(",", ".")) * 100);
}

export function formatCents(cents: number) {
	return (cents / 100).toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}
