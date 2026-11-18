import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/shared/components/ui/accordion";
import { faq } from "~/shared/config/faq";

import { SectionEyebrow } from "./section-eyebrow";

export function FaqSection() {
	return (
		<section
			id="faq"
			aria-labelledby="faq-titulo"
			className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 lg:py-24"
		>
			<div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
				<div className="flex flex-col gap-3 lg:sticky lg:top-8 lg:self-start">
					<SectionEyebrow>FAQ</SectionEyebrow>
					<h2 id="faq-titulo" className="text-h2-sm lg:text-h2">
						Perguntas frequentes
					</h2>
					<p className="max-w-[44ch] text-muted-foreground">
						Tire suas dúvidas sobre a consulta veicular CheckAuto. Se ainda
						precisar de ajuda, fale com a gente pelos nossos canais de
						atendimento.
					</p>
				</div>

				<Accordion
					type="single"
					collapsible
					defaultValue="faq-0"
					className="gap-3 overflow-visible rounded-none border-0"
				>
					{faq.map(({ question, answer }, index) => (
						<AccordionItem
							key={question}
							value={`faq-${index}`}
							className="rounded-2xl border border-border bg-card not-last:border-b data-open:bg-card"
						>
							<AccordionTrigger className="items-center rounded-2xl p-5 text-body font-semibold text-heading hover:no-underline lg:px-6">
								{question}
							</AccordionTrigger>
							<AccordionContent className="px-1 text-body text-muted-foreground lg:px-2">
								{answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
