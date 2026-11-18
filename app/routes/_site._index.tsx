import { CtaSection } from "~/features/home/components/cta-section";
import { DataSection } from "~/features/home/components/data-section";
import { FaqSection } from "~/features/home/components/faq-section";
import { HeroSection } from "~/features/home/components/hero-section";
import { HowSection } from "~/features/home/components/how-section";
import { MarqueeSection } from "~/features/home/components/marquee-section";
import { PlansSection } from "~/features/home/components/plans-section";
import { SellSection } from "~/features/home/components/sell-section";
import { WhySection } from "~/features/home/components/why-section";
import { faq } from "~/shared/config/faq";

import type { Route } from "./+types/_site._index";

export const meta: Route.MetaFunction = () => [
	{ title: "Checkauto | Consulta de histórico veicular" },
	{
		name: "description",
		content:
			"Consulte o histórico completo do veículo pela placa: leilão, sinistro, roubo e furto, restrições, recall e gravame.",
	},
	{
		"script:ld+json": {
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: faq.map(({ question, answer }) => ({
				"@type": "Question",
				name: question,
				acceptedAnswer: { "@type": "Answer", text: answer },
			})),
		},
	},
];

export default function Home() {
	return (
		<>
			<HeroSection />
			<MarqueeSection />
			<WhySection />
			<DataSection />
			<HowSection />
			<PlansSection />
			<SellSection />
			<FaqSection />
			<CtaSection />
		</>
	);
}
