import type { MetaDescriptor } from "react-router";

import { checkauto, contact, site, socialLinks } from "~/content/checkauto";

export type SeoInput = {
	title: string;
	description?: string;
	path?: string;
	image?: string;
	noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
	return new URL(path, site.url).toString();
}

export function seo({
	title,
	description = site.description,
	path,
	image,
	noIndex = false,
}: SeoInput): MetaDescriptor[] {
	const tags: MetaDescriptor[] = [
		{ title },
		{ name: "description", content: description },
		{ property: "og:type", content: "website" },
		{ property: "og:site_name", content: site.name },
		{ property: "og:locale", content: site.locale },
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
		{
			name: "twitter:card",
			content: image ? "summary_large_image" : "summary",
		},
		{ name: "twitter:title", content: title },
		{ name: "twitter:description", content: description },
	];

	if (path) {
		const url = absoluteUrl(path);
		tags.push(
			{ tagName: "link", rel: "canonical", href: url },
			{ property: "og:url", content: url },
		);
	}

	if (image) {
		const url = absoluteUrl(image);
		tags.push(
			{ property: "og:image", content: url },
			{ name: "twitter:image", content: url },
		);
	}

	if (noIndex) {
		tags.push({ name: "robots", content: "noindex" });
	}

	return tags;
}

export function organizationJsonLd(logoPath: string) {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: checkauto.tradeName,
		legalName: checkauto.legalName,
		taxID: checkauto.cnpj,
		url: site.url,
		logo: absoluteUrl(logoPath),
		email: contact.email,
		address: checkauto.address,
		sameAs: socialLinks.map(({ href }) => href),
		contactPoint: contact.phones.map(({ href }) => ({
			"@type": "ContactPoint",
			telephone: href.replace("tel:", ""),
			contactType: "customer service",
			areaServed: "BR",
			availableLanguage: "Portuguese",
		})),
	};
}

export function jsonLdScript(data: unknown) {
	return JSON.stringify(data).replace(/</g, "\\u003c");
}
