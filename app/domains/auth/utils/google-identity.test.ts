import { describe, expect, it } from "vitest";

import { readGooglePicture } from "./google-identity";

function idToken(payload: Record<string, unknown>) {
	const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
	return `header.${body}.signature`;
}

describe("readGooglePicture", () => {
	it("lê a foto do token do Google", () => {
		const token = idToken({
			name: "João Conceição",
			picture: "https://lh3.googleusercontent.com/a/foto=s96-c",
		});

		expect(readGooglePicture(token)).toBe(
			"https://lh3.googleusercontent.com/a/foto=s96-c",
		);
	});

	it("ignora token sem foto, foto que não é https e token inválido", () => {
		expect(readGooglePicture(idToken({ name: "Sem Foto" }))).toBeUndefined();
		expect(
			readGooglePicture(idToken({ picture: "http://exemplo.com/foto.png" })),
		).toBeUndefined();
		expect(readGooglePicture("nao-e-um-token")).toBeUndefined();
	});
});
