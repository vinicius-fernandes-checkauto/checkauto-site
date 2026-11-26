import type {
	AccountUser,
	CreditEntry,
	Transaction,
} from "~/domains/account/types/account.types";

export const demoAccount: AccountUser = {
	name: "Teste Veículos Ltda",
	email: "contato@testeveiculos.com.br",
};

export const demoCreditEntries: CreditEntry[] = [
	{
		id: "l5",
		date: "2026-11-18",
		description: "Consulta da placa ABC1D23",
		detail: "Checkauto Master",
		category: "Consulta",
		kind: "debit",
		amount: 59.9,
	},
	{
		id: "l4",
		date: "2026-11-10",
		description: "Estorno do pedido #48213",
		category: "Estorno",
		kind: "credit",
		amount: 69.9,
		expiresAt: "2027-05-10",
	},
	{
		id: "l3",
		date: "2026-10-28",
		description: "Crédito promocional",
		detail: "Campanha de indicação",
		category: "Bônus",
		kind: "credit",
		amount: 20,
		expiresAt: "2026-12-15",
	},
	{
		id: "l2",
		date: "2026-10-02",
		description: "Consulta da placa QRS4T56",
		detail: "Checkauto Standard",
		category: "Consulta",
		kind: "debit",
		amount: 54.9,
	},
	{
		id: "l1",
		date: "2026-09-20",
		description: "Compra de créditos",
		detail: "Pedido #47790",
		category: "Compra",
		kind: "credit",
		amount: 150,
		expiresAt: "2027-09-20",
	},
];

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
