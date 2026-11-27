import { Link, useRevalidator } from "react-router";

import { AccountPageHeader } from "~/domains/account/components/account-page-header";
import { OrderDetail } from "~/domains/account/components/order-detail";
import { getOrder } from "~/domains/account/services/account.service";
import { Button } from "~/shared/components/ui/button";
import { toApiError } from "~/shared/lib/api";

import type { Route } from "./+types/conta.consultas_.$orderId";

export const meta: Route.MetaFunction = () => [
	{ title: "Pedido | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	try {
		return { order: await getOrder(params.orderId), error: null };
	} catch (error) {
		const { message, status } = toApiError(error);
		return {
			order: null,
			error: message,
			retryable: status !== 403 && status !== 404,
		};
	}
}

export function HydrateFallback() {
	return (
		<p role="status" className="text-sm text-muted-foreground">
			Carregando o pedido…
		</p>
	);
}

export default function AccountOrder({ loaderData }: Route.ComponentProps) {
	const revalidator = useRevalidator();
	const { order } = loaderData;

	return (
		<div className="flex flex-col gap-8">
			<AccountPageHeader
				title={
					order?.number ? (
						<>
							Pedido{" "}
							<span className="font-normal text-muted-foreground tabular-nums">
								{order.number}
							</span>
						</>
					) : (
						"Pedido"
					)
				}
				description={
					order ? (
						<>
							Placa{" "}
							<strong className="font-semibold tracking-wider text-heading">
								{order.plate || "—"}
							</strong>{" "}
							· {order.plan || "Pacote"}
						</>
					) : (
						"Acompanhe o pagamento e o resultado da sua consulta."
					)
				}
				action={
					<Button asChild variant="outline" size="sm">
						<Link to="/conta/consultas">Voltar ao histórico</Link>
					</Button>
				}
			/>
			{order ? (
				<OrderDetail order={order} />
			) : (
				<div
					role="alert"
					className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-5 sm:p-7"
				>
					<p className="text-sm/6 text-heading">
						Não foi possível carregar o pedido. {loaderData.error}
					</p>
					{"retryable" in loaderData && loaderData.retryable && (
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={revalidator.state === "loading"}
							onClick={() => void revalidator.revalidate()}
						>
							Tentar novamente
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
