import { describe, expect, it } from "vitest";

import { absoluteUrl, jsonLdScript, organizationJsonLd, seo } from "./seo";

describe("seo", () => {
	it("gera título, descrição e Open Graph", () => {
		const tags = seo({ title: "Pacotes | Checkauto", description: "Compare." });
		expect(tags).toContainEqual({ title: "Pacotes | Checkauto" });
		expect(tags).toContainEqual({ name: "description", content: "Compare." });
		expect(tags).toContainEqual({
			property: "og:title",
			content: "Pacotes | Checkauto",
		});
		expect(tags).toContainEqual({ name: "twitter:card", content: "summary" });
	});

	it("usa a URL absoluta no canonical e na imagem", () => {
		const tags = seo({
			title: "Plus",
			path: "/pacotes/checkauto-plus",
			image: "/og/plus.png",
		});
		expect(tags).toContainEqual({
			tagName: "link",
			rel: "canonical",
			href: "https://www.checkauto.com.br/pacotes/checkauto-plus",
		});
		expect(tags).toContainEqual({
			property: "og:image",
			content: "https://www.checkauto.com.br/og/plus.png",
		});
		expect(tags).toContainEqual({
			name: "twitter:card",
			content: "summary_large_image",
		});
	});

	it("marca noindex quando pedido", () => {
		expect(seo({ title: "Conta", noIndex: true })).toContainEqual({
			name: "robots",
			content: "noindex",
		});
		expect(seo({ title: "Home" })).not.toContainEqual({
			name: "robots",
			content: "noindex",
		});
	});
});

describe("organizationJsonLd", () => {
	it("monta a Organization com logo absoluto e telefones", () => {
		const data = organizationJsonLd("/assets/logo.png");
		expect(data["@type"]).toBe("Organization");
		expect(data.logo).toBe(absoluteUrl("/assets/logo.png"));
		expect(data.contactPoint[0].telephone).toBe("+558004187077");
	});

	it("escapa < para não fechar a tag script", () => {
		expect(jsonLdScript({ a: "</script>" })).toBe('{"a":"\\u003c/script>"}');
	});
});
