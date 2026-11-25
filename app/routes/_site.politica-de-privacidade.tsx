import { LegalDocument } from "~/domains/site/components/legal-document";
import { privacyPolicy } from "~/domains/site/content/privacy-policy";

import type { Route } from "./+types/_site.politica-de-privacidade";

export const meta: Route.MetaFunction = () => [
	{ title: "Política de privacidade | Checkauto" },
	{
		name: "description",
		content:
			"Como a Checkauto coleta, usa, protege e exclui seus dados pessoais, e como exercer seus direitos pela LGPD.",
	},
];

export default function PrivacyPolicy() {
	return (
		<LegalDocument
			label="Política de privacidade"
			description="Como coletamos, usamos e protegemos seus dados pessoais, e como exercer seus direitos."
			content={privacyPolicy}
		/>
	);
}
