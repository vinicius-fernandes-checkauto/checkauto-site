import { useRevalidator } from "react-router";

import { AccountPageHeader } from "~/domains/account/components/account-page-header";
import { BalanceCard } from "~/domains/account/components/balance-card";
import { WalletHistory } from "~/domains/account/components/wallet-history";
import { getWallet } from "~/domains/account/services/account.service";
import { loadWalletSearchParams } from "~/domains/account/utils/wallet";
import { Button } from "~/shared/components/ui/button";
import { toApiError } from "~/shared/lib/api";

import type { Route } from "./+types/conta.transacoes";

export const meta: Route.MetaFunction = () => [
	{ title: "Histórico de transações | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
	try {
		const page = await getWallet(loadWalletSearchParams(request));
		return { ...page, error: null };
	} catch (error) {
		return {
			movements: [],
			total: 0,
			balance: null,
			error: toApiError(error).message,
		};
	}
}

export function HydrateFallback() {
	return (
		<p role="status" className="text-sm text-muted-foreground">
			Carregando seu saldo…
		</p>
	);
}

export default function AccountTransactions({
	loaderData,
}: Route.ComponentProps) {
	const { movements, total, balance, error } = loaderData;
	const revalidator = useRevalidator();

	return (
		<div className="flex flex-col gap-8">
			<AccountPageHeader
				title="Histórico de transações"
				description="Saldo da sua conta e cada movimentação: créditos, consultas e estornos."
			/>
			{error ? (
				<div
					role="alert"
					className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-5 sm:p-7"
				>
					<p className="text-sm/6 text-heading">
						Não foi possível carregar seu saldo. {error}
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
				<>
					<BalanceCard balance={balance} />
					<WalletHistory movements={movements} total={total} />
				</>
			)}
		</div>
	);
}
