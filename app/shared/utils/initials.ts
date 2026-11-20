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
