const productIds: Record<string, string | undefined> = {
	"checkauto-standard": import.meta.env.VITE_STRIPE_PRODUCT_STANDARD,
	"checkauto-master": import.meta.env.VITE_STRIPE_PRODUCT_MASTER,
	"checkauto-plus": import.meta.env.VITE_STRIPE_PRODUCT_PLUS,
};

export function stripeProductId(planId: string) {
	return productIds[planId] || null;
}
