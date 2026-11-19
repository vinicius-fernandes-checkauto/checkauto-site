export type AccountUser = {
	name: string;
	email: string;
	personType: "Pessoa física" | "Pessoa jurídica";
	pendingOrders: number;
};

export const demoAccount: AccountUser = {
	name: "Teste Veículos Ltda",
	email: "contato@testeveiculos.com.br",
	personType: "Pessoa jurídica",
	pendingOrders: 1,
};

const ignoredNameParts = new Set([
	"da",
	"das",
	"de",
	"do",
	"dos",
	"e",
	"eireli",
	"epp",
	"ltda",
	"me",
	"s/a",
	"sa",
]);

export function getInitials(name: string) {
	return name
		.split(/\s+/)
		.filter((part) => part && !ignoredNameParts.has(part.toLowerCase()))
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");
}

const companySuffixes = new Set(["eireli", "epp", "ltda", "me", "s/a", "sa"]);

export function getDisplayName(name: string) {
	const parts = name.trim().split(/\s+/);
	while (
		parts.length > 1 &&
		companySuffixes.has(parts[parts.length - 1].toLowerCase().replace(".", ""))
	) {
		parts.pop();
	}
	return parts.join(" ");
}

export function formatToday(date: Date) {
	const text = new Intl.DateTimeFormat("pt-BR", {
		weekday: "long",
		day: "numeric",
		month: "long",
	}).format(date);
	return text.charAt(0).toUpperCase() + text.slice(1);
}
