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
