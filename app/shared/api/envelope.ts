import { z } from "zod";

export function envelope<T extends z.ZodType>(content: T) {
	return z
		.object({ user: z.unknown().optional(), content })
		.transform((data) => (data as { content: z.output<T> }).content);
}
