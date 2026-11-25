import type { CreditEntry } from "~/domains/account/types/account.types";

export const creditFilters = [
	{ id: "all", label: "Todos" },
	{ id: "credit", label: "Entradas" },
	{ id: "debit", label: "Saídas" },
] as const;

export type CreditFilter = (typeof creditFilters)[number]["id"];

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
