import { z } from "zod";

const jwtPayloadSchema = z.object({
	exp: z.number(),
	user_id: z.string().optional(),
	token_type: z.string().optional(),
});

export type JwtPayload = z.output<typeof jwtPayloadSchema>;

function decodeBase64Url(value: string) {
	const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
	const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
	const binary = atob(padded);
	const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
	return new TextDecoder().decode(bytes);
}

export function readJwtPayload(token: string): JwtPayload | null {
	const [, payload] = token.split(".");
	if (!payload) return null;

	try {
		const result = jwtPayloadSchema.safeParse(
			JSON.parse(decodeBase64Url(payload)),
		);
		return result.success ? result.data : null;
	} catch {
		return null;
	}
}

export function isJwtExpired(
	token: string,
	skewSeconds = 30,
	now = Date.now(),
) {
	const payload = readJwtPayload(token);
	if (!payload) return true;
	return payload.exp * 1000 <= now + skewSeconds * 1000;
}
