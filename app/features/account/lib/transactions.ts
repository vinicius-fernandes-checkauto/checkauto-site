import type { StatusTone } from "~/features/account/components/status-badge";

export type TransactionStatus = "paid" | "pending" | "refunded";

export type Transaction = {
	id: string;
	date: string;
	queryCode: string;
	plate: string;
	plan: string;
	amount: number;
	status: TransactionStatus;
};

export const transactionStatus: Record<
	TransactionStatus,
	{ label: string; tone: StatusTone }
> = {
	paid: { label: "Pago", tone: "success" },
	pending: { label: "Aguardando pagamento", tone: "warning" },
	refunded: { label: "Estornado", tone: "neutral" },
};

export const demoTransactions: Transaction[] = [
	{
		id: "t6",
		date: "2026-11-23",
		queryCode: "12320812",
		plate: "XYZ4E56",
		plan: "Checkauto Master",
		amount: 59.9,
		status: "pending",
	},
	{
		id: "t5",
		date: "2026-11-18",
		queryCode: "12320791",
		plate: "ABC1D23",
		plan: "Checkauto Plus",
		amount: 69.9,
		status: "paid",
	},
	{
		id: "t4",
		date: "2026-11-10",
		queryCode: "12318840",
		plate: "ABC1D23",
		plan: "Checkauto Plus",
		amount: 69.9,
		status: "refunded",
	},
	{
		id: "t3",
		date: "2026-10-28",
		queryCode: "12301177",
		plate: "QRS4T56",
		plan: "Checkauto Standard",
		amount: 54.9,
		status: "paid",
	},
	{
		id: "t2",
		date: "2026-10-02",
		queryCode: "12287305",
		plate: "FHE8B03",
		plan: "Checkauto Master",
		amount: 59.9,
		status: "paid",
	},
];
