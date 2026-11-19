import { LegalDocument } from "~/features/legal/components/legal-document";
import { purchaseTerms } from "~/features/legal/content/purchase-terms";

import type { Route } from "./+types/_site.contrato";

export const meta: Route.MetaFunction = () => [
	{ title: "Termos de compra | Checkauto" },
	{
		name: "description",
		content:
			"Contrato de fornecimento de informações veiculares Checkauto: condições de cadastro, compra de consultas, responsabilidades e privacidade.",
	},
];

export default function PurchaseTerms() {
	return (
		<LegalDocument
			label="Termos de compra"
			description="Condições de cadastro, compra de consultas e responsabilidades entre você e a Checkauto."
			content={purchaseTerms}
		/>
	);
}
