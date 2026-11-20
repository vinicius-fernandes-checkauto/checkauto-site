import { z } from "zod";

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

export const addressSchema = z.object({
	label: z.string().trim().min(2, { error: "Dê um nome para o endereço." }),
	zip: z
		.string()
		.transform((value) => value.replace(/\D/g, ""))
		.pipe(z.string().length(8, { error: "Informe um CEP válido." })),
	street: z.string().trim().min(3, { error: "Informe a rua." }),
	number: z.string().trim().min(1, { error: "Informe o número." }),
	complement: z.string().trim(),
	district: z.string().trim().min(2, { error: "Informe o bairro." }),
	city: z.string().trim().min(2, { error: "Informe a cidade." }),
	state: z.enum(brazilianStates, { error: "Escolha a UF." }),
	isDefault: z.boolean(),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type AddressField = keyof AddressInput;
export type Address = AddressInput & { id: string };

export const demoAddresses: Address[] = [
	{
		id: "sede",
		label: "Sede",
		zip: "04543011",
		street: "Avenida Brigadeiro Faria Lima",
		number: "3477",
		complement: "Conjunto 92",
		district: "Itaim Bibi",
		city: "São Paulo",
		state: "SP",
		isDefault: true,
	},
	{
		id: "filial-campinas",
		label: "Filial Campinas",
		zip: "13025320",
		street: "Rua Coronel Quirino",
		number: "1150",
		complement: "",
		district: "Cambuí",
		city: "Campinas",
		state: "SP",
		isDefault: false,
	},
];
