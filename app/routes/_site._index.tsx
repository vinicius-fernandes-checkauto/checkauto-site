import { homeFaq } from "~/content/faq";
import { ClientsSection } from "~/features/site/components/clients-section";
import { CtaSection } from "~/features/site/components/cta-section";
import { DataSection } from "~/features/site/components/data-section";
import { FaqSection } from "~/features/site/components/faq-section";
import { HowSection } from "~/features/site/components/how-section";
import { PlansSection } from "~/features/site/components/plans-section";
import { HeroSection } from "~/features/site/components/sections/hero-section";
import { MarqueeSection } from "~/features/site/components/sections/marquee-section";
import { WhySection } from "~/features/site/components/sections/why-section";

import type { Route } from "./+types/_site._index";

export const meta: Route.MetaFunction = () => [
	{ title: "Checkauto | Consulta de histórico veicular" },
	{
		name: "description",
		content:
			"Consulte o histórico completo do veículo pela placa: leilão, ocorrências, roubo e furto, restrições, recall e gravame.",
	},
	{
		"script:ld+json": {
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: homeFaq.map(({ question, answer }) => ({
				"@type": "Question",
				name: question,
				acceptedAnswer: { "@type": "Answer", text: answer },
			})),
		},
	},
];

export default function Home() {
	return (
		<div>
			<HeroSection />
			<MarqueeSection />
			<WhySection />
			<ClientsSection />
			<HowSection />
			<DataSection />
			<PlansSection />
			<FaqSection />
			<CtaSection />
		</div>
	);
}
