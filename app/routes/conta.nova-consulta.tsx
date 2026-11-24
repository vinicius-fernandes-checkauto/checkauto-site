import { AccountPageHeader } from "~/features/account/components/account-page-header";
import { NewQueryForm } from "~/features/account/components/new-query-form";

import type { Route } from "./+types/conta.nova-consulta";

export const meta: Route.MetaFunction = () => [
	{ title: "Nova consulta | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export default function AccountNewQuery() {
	return (
		<div className="flex flex-col gap-8">
			<AccountPageHeader
				title="Nova consulta"
				description="Escolha o pacote e informe a placa. O histórico fica pronto logo depois do pagamento."
			/>
			<NewQueryForm />
		</div>
	);
}
