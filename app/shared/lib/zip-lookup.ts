import { z } from "zod";

import { brazilianStates } from "~/shared/utils/address";

const viaCepSchema = z.object({
	logradouro: z.string().default(""),
	bairro: z.string().default(""),
	localidade: z.string().default(""),
	uf: z.enum(brazilianStates),
});

export type ZipAddress = {
	street: string;
	district: string;
	city: string;
	state: (typeof brazilianStates)[number];
};

export async function lookupZip(zip: string): Promise<ZipAddress | null> {
	const digits = zip.replace(/\D/g, "");
	if (digits.length !== 8) return null;

	const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
	if (!response.ok) throw new Error("Busca de CEP indisponível");

	const parsed = viaCepSchema.safeParse(await response.json());
	if (!parsed.success) return null;

	return {
		street: parsed.data.logradouro,
		district: parsed.data.bairro,
		city: parsed.data.localidade,
		state: parsed.data.uf,
	};
}
