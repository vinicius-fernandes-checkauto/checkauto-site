import type { StatusTone } from "~/domains/account/components/status-badge";
import type { TransactionStatus } from "~/domains/account/types/account.types";

export const transactionStatus: Record<
	TransactionStatus,
	{ label: string; tone: StatusTone }
> = {
	paid: { label: "Pago", tone: "success" },
	pending: { label: "Aguardando pagamento", tone: "warning" },
	refunded: { label: "Estornado", tone: "neutral" },
};
