import { Link } from "react-router";

import { homeFaq } from "~/@content/faq";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/shared/components/ui/accordion";
import { Button } from "~/shared/components/ui/button";

export function FaqSection() {
	return (
		<section
			id="faq"
			aria-labelledby="faq-titulo"
			className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-7 px-4 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-18 lg:py-28"
		>
			<div className="contents lg:sticky lg:top-28 lg:flex lg:flex-col lg:gap-10 lg:self-start">
				<h2
					id="faq-titulo"
					className="order-1 max-w-[15ch] text-3xl/tight font-medium tracking-tight text-balance text-foreground lg:text-5xl/tight"
				>
					Dúvidas frequentes sobre a consulta.
				</h2>

				<div className="order-3 flex flex-col items-start gap-5">
					<p className="max-w-[38ch] text-muted-foreground">
						Não encontrou o que procurava? Nossa equipe atende por telefone e
						e-mail e responde rápido.
					</p>
					<Button asChild size="lg">
						<Link to="/faq">Ver todas as dúvidas</Link>
					</Button>
				</div>
			</div>

			<Accordion
				type="single"
				collapsible
				defaultValue="faq-0"
				className="order-2 gap-2.5 overflow-visible rounded-none border-0"
			>
				{homeFaq.map(({ question, answer }, index) => (
					<AccordionItem
						key={question}
						value={`faq-${index}`}
						className="rounded-2xl bg-card not-last:border-b-0 data-open:bg-card"
					>
						<AccordionTrigger className="items-center gap-6 rounded-2xl p-5 text-base/6 font-medium text-foreground hover:no-underline **:data-[slot=accordion-trigger-icon]:size-5 lg:px-6 lg:py-5.5 lg:text-lg/7">
							{question}
						</AccordionTrigger>
						<AccordionContent className="px-1 pr-10 text-base/relaxed text-muted-foreground lg:px-2 lg:pr-16">
							{answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
}
