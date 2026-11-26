import { useRevalidator } from "react-router";

import { AccountPageHeader } from "~/domains/account/components/account-page-header";
import { QueryHistory } from "~/domains/account/components/query-history";
import { getQueries } from "~/domains/account/services/account.service";
import { loadQuerySearchParams } from "~/domains/account/utils/queries";
import { Button } from "~/shared/components/ui/button";
import { toApiError } from "~/shared/lib/api";

import type { Route } from "./+types/conta.consultas";

export const meta: Route.MetaFunction = () => [
	{ title: "Histórico de consultas | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
	try {
		const page = await getQueries(loadQuerySearchParams(request));
		return { ...page, error: null };
	} catch (error) {
		return { queries: [], total: 0, error: toApiError(error).message };
	}
}

export function HydrateFallback() {
	return (
		<p role="status" className="text-sm text-muted-foreground">
			Carregando suas consultas…
		</p>
	);
}

export default function AccountQueries({ loaderData }: Route.ComponentProps) {
	const { queries, total, error } = loaderData;
	const revalidator = useRevalidator();

	return (
		<div className="flex flex-col gap-8">
			<AccountPageHeader
				title="Histórico de consultas"
				description="Todas as consultas feitas na sua conta."
			/>
			{error ? (
				<div
					role="alert"
					className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-5 sm:p-7"
				>
					<p className="text-sm/6 text-heading">
						Não foi possível carregar suas consultas. {error}
					</p>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={revalidator.state === "loading"}
						onClick={() => void revalidator.revalidate()}
					>
						Tentar novamente
					</Button>
				</div>
			) : (
				<QueryHistory queries={queries} total={total} />
			)}
		</div>
	);
}
