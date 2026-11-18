import { z } from "zod";

const PLATE_LENGTH = 7;
const PLATE_PATTERN = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

export function normalizePlate(value: string) {
	return value
		.toUpperCase()
		.replace(/[^A-Z0-9]/g, "")
		.slice(0, PLATE_LENGTH);
}

export const plateSchema = z
	.string()
	.transform(normalizePlate)
	.pipe(
		z
			.string()
			.min(1, { error: "Informe a placa do veículo.", abort: true })
			.length(PLATE_LENGTH, {
				error: "A placa precisa ter 7 caracteres, como ABC1234 ou ABC1D23.",
				abort: true,
			})
			.regex(PLATE_PATTERN, {
				error: "Use 3 letras e 4 caracteres, como ABC1234 ou ABC1D23.",
			}),
	);
