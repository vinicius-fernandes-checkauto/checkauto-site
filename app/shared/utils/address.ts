export const brazilianStates = [
	"AC",
	"AL",
	"AP",
	"AM",
	"BA",
	"CE",
	"DF",
	"ES",
	"GO",
	"MA",
	"MT",
	"MS",
	"MG",
	"PA",
	"PB",
	"PR",
	"PE",
	"PI",
	"RJ",
	"RN",
	"RS",
	"RO",
	"RR",
	"SC",
	"SP",
	"SE",
	"TO",
] as const;

export function formatZip(value: string) {
	const digits = value.replace(/\D/g, "").slice(0, 8);
	return digits.length > 5
		? `${digits.slice(0, 5)}-${digits.slice(5)}`
		: digits;
}

export type AddressValues = {
	zip: string;
	street: string;
	number: string;
	complement: string;
	district: string;
	city: string;
	state: string;
};
