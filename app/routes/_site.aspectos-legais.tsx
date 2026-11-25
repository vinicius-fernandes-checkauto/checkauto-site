import { LegalDocument } from "~/domains/site/components/legal-document";
import { legalNotice } from "~/domains/site/content/legal-notice";

import type { Route } from "./+types/_site.aspectos-legais";

export const meta: Route.MetaFunction = () => [
	{ title: "Aspectos legais | Checkauto" },
	{
		name: "description",
		content:
			"Condições de uso das informações publicadas no site da Checkauto, responsabilidades e links para sites de terceiros.",
	},
];

export default function LegalNotice() {
	return (
		<LegalDocument
			label="Aspectos legais"
			description="Condições de uso das informações publicadas neste site e responsabilidades de cada parte."
			content={legalNotice}
		/>
	);
}
