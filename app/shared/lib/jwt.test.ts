import { describe, expect, it } from "vitest";

import { isJwtExpired, readJwtPayload } from "./jwt";

function token(payload: object) {
	const encode = (value: object) =>
		Buffer.from(JSON.stringify(value)).toString("base64url");
	return `${encode({ alg: "HS256" })}.${encode(payload)}.assinatura`;
}

describe("jwt", () => {
	it("lê o user_id e a expiração do payload", () => {
		const payload = readJwtPayload(
			token({ exp: 2_000_000_000, user_id: "abc-123", token_type: "access" }),
		);
		expect(payload).toEqual({
			exp: 2_000_000_000,
			user_id: "abc-123",
			token_type: "access",
		});
	});

	it("devolve null para token malformado", () => {
		expect(readJwtPayload("isso-nao-e-um-jwt")).toBeNull();
		expect(readJwtPayload("a.b.c")).toBeNull();
	});

	it("considera expirado com 30 segundos de folga", () => {
		const now = 1_000_000 * 1000;
		expect(isJwtExpired(token({ exp: 1_000_020 }), 30, now)).toBe(true);
		expect(isJwtExpired(token({ exp: 1_000_060 }), 30, now)).toBe(false);
		expect(isJwtExpired("invalido", 30, now)).toBe(true);
	});
});
