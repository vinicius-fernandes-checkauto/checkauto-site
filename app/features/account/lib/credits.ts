export type CreditEntryKind = "credit" | "debit";

export type CreditEntry = {
	id: string;
	date: string;
	description: string;
	detail?: string;
	category: string;
	kind: CreditEntryKind;
	amount: number;
	expiresAt?: string;
};

export const creditFilters = [
	{ id: "all", label: "Todos" },
	{ id: "credit", label: "Entradas" },
	{ id: "debit", label: "Saídas" },
] as const;

export type CreditFilter = (typeof creditFilters)[number]["id"];

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

const currency = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

const shortDate = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	timeZone: "UTC",
});

export const formatCurrency = (value: number) => currency.format(value);

export const formatDate = (iso: string) => shortDate.format(new Date(iso));

export function summarizeCredits(entries: CreditEntry[]) {
	const credits = entries.filter((entry) => entry.kind === "credit");
	const debits = entries.filter((entry) => entry.kind === "debit");
	const sum = (list: CreditEntry[]) =>
		list.reduce((total, entry) => total + entry.amount, 0);
	const nextExpiring = credits
		.filter((entry) => entry.expiresAt)
		.sort((a, b) => (a.expiresAt ?? "").localeCompare(b.expiresAt ?? ""))[0];

	return {
		balance: sum(credits) - sum(debits),
		received: sum(credits),
		used: sum(debits),
		nextExpiring,
	};
}
