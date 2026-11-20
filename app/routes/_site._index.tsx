import { type ReactNode, useRef } from "react";

import { ClientsSection } from "~/features/site/components/clients-section";
import { CtaSection } from "~/features/site/components/cta-section";
import { DataSection } from "~/features/site/components/data-section";
import { FaqSection } from "~/features/site/components/faq-section";
import { HeroSection } from "~/features/site/components/hero-section";
import { HistorySection } from "~/features/site/components/history-section";
import { HowSection } from "~/features/site/components/how-section";
import { MarqueeSection } from "~/features/site/components/marquee-section";
import { PlansSection } from "~/features/site/components/plans-section";
import { WhySection } from "~/features/site/components/why-section";
import { homeFaq } from "~/shared/config/faq";
import { gsap, MOTION_OK, useGSAP } from "~/shared/lib/gsap";

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
			mainEntity: homeFaq.map(({ question, answer }) => ({
				"@type": "Question",
				name: question,
				acceptedAnswer: { "@type": "Answer", text: answer },
			})),
		},
	},
];

const bandTone = {
	white: "bg-background",
	tint: "bg-navy-100/70",
} as const;

function Band({
	tone,
	children,
}: {
	tone: keyof typeof bandTone;
	children: ReactNode;
}) {
	return <div className={bandTone[tone]}>{children}</div>;
}

const REVEAL_GROUPS = [
	"#por-que-checkauto [data-tile]",
	"#pacotes [data-plan]",
	"#faq [data-slot=accordion-item]",
	"#hora-de-vender [data-tile]",
];

export default function Home() {
	const scope = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();

			mm.add(MOTION_OK, () => {
				// Títulos e eyebrows sobem suavemente ao entrar na tela.
				for (const el of gsap.utils.toArray<HTMLElement>(
					"section h2, section [data-slot=eyebrow], section h2 + p",
				)) {
					gsap.from(el, {
						autoAlpha: 0,
						y: 28,
						duration: 0.8,
						ease: "power3.out",
						scrollTrigger: { trigger: el, start: "top 88%" },
					});
				}

				// Cartões entram em cascata.
				for (const selector of REVEAL_GROUPS) {
					const items = gsap.utils.toArray<HTMLElement>(selector);
					if (!items.length) continue;

					gsap.from(items, {
						autoAlpha: 0,
						y: 40,
						duration: 0.7,
						stagger: 0.1,
						ease: "power3.out",
						scrollTrigger: { trigger: items[0], start: "top 85%" },
					});
				}
			});
		},
		{ scope },
	);

	return (
		<div ref={scope}>
			<HeroSection />
			<Band tone="white">
				<MarqueeSection />
			</Band>
			<WhySection />
			<HowSection />
			<Band tone="white">
				<DataSection />
			</Band>
			<Band tone="white">
				<PlansSection />
			</Band>
			{/* <SellSection /> */}
			<HistorySection />
			<ClientsSection />
			<Band tone="white">
				<FaqSection />
			</Band>
			<CtaSection />
		</div>
	);
}
