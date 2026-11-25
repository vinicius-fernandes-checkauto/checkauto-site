import type { CSSProperties } from "react";
import { useNavigate } from "react-router";

import { AccountPageHeader } from "~/domains/account/components/account-page-header";
import { PlansComparison } from "~/shared/components/plans-comparison";

import type { Route } from "./+types/conta.pacotes";

export const meta: Route.MetaFunction = () => [
	{ title: "Pacotes | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export default function AccountPlans() {
	const navigate = useNavigate();

	return (
		<div
			className="flex flex-col gap-8"
			style={{ "--plans-sticky-top": "calc(4.75rem + 1px)" } as CSSProperties}
		>
			<AccountPageHeader
				title="Pacotes"
				description="Veja o que vem em cada pacote e escolha o ideal para a sua próxima consulta."
			/>
			<PlansComparison
				onSelect={(planId) =>
					navigate("/conta/nova-consulta", { state: { planId } })
				}
			/>
		</div>
	);
}
