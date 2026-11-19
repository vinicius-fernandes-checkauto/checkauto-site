import { useState } from "react";
import { Link } from "react-router";

import { MailIcon, SearchIcon, XIcon } from "~/shared/components/icons";
import { PageHeader } from "~/shared/components/layout/page-header";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/shared/components/ui/accordion";
import { Button } from "~/shared/components/ui/button";
import { faq, faqCategories } from "~/shared/config/faq";
import { cn } from "~/shared/lib/utils";

import type { Route } from "./+types/_site.faq";

export const meta: Route.MetaFunction = () => [
	{ title: "Perguntas frequentes | Checkauto" },
	{
		name: "description",
		content:
			"Tire suas dúvidas sobre a consulta de histórico veicular da Checkauto: como funciona, informações do relatório, pagamento e mais.",
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

const normalize = (value: string) =>
	value
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase();

export default function Faq() {
	const [query, setQuery] = useState("");
	const term = normalize(query.trim());

	const groups = faqCategories
		.map((category) => ({
			...category,
			items: faq.filter(
				(item) =>
					item.category === category.id &&
					(!term ||
						normalize(`${item.question} ${item.answer}`).includes(term)),
			),
		}))
		.filter((group) => group.items.length > 0);

	const total = groups.reduce((sum, group) => sum + group.items.length, 0);

	return (
		<div className="bg-background">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pt-2 pb-18 sm:px-8 lg:pb-24">
				<PageHeader
					label="Perguntas frequentes"
					title="Perguntas frequentes"
					description="Tudo o que você precisa saber sobre a consulta de histórico veicular, o relatório e o pagamento."
				/>

				<div className="grid grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
					<div className="flex flex-col gap-8">
						<div className="flex flex-col gap-4">
							<label htmlFor="faq-busca" className="sr-only">
								Buscar uma dúvida
							</label>
							<div className="relative">
								<SearchIcon
									aria-hidden="true"
									className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted-foreground"
								/>
								<input
									id="faq-busca"
									type="search"
									value={query}
									onChange={(event) => setQuery(event.target.value)}
									placeholder="Buscar uma dúvida, ex.: gravame, pagamento"
									className="h-14 w-full rounded-full border border-border bg-card pr-14 pl-13 text-base text-heading shadow-[0_12px_32px_-20px_--alpha(var(--color-brand-blue)/18%)] outline-none placeholder:text-muted-foreground focus-visible:border-brand-blue focus-visible:ring-3 focus-visible:ring-brand-blue/15 [&::-webkit-search-cancel-button]:hidden"
								/>
								{query && (
									<button
										type="button"
										onClick={() => setQuery("")}
										className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-brand-blue/6 hover:text-heading"
									>
										<XIcon aria-hidden="true" className="size-4.5" />
										<span className="sr-only">Limpar busca</span>
									</button>
								)}
							</div>

							<nav aria-label="Categorias">
								<ul className="flex flex-wrap gap-2">
									{faqCategories.map((category) => {
										const available = groups.some(
											(group) => group.id === category.id,
										);

										return (
											<li key={category.id}>
												<a
													href={`#${category.id}`}
													aria-disabled={!available || undefined}
													className={cn(
														"inline-flex min-h-10 items-center rounded-full px-4 text-sm font-medium transition-colors",
														available
															? "bg-brand-blue/6 text-heading hover:bg-brand-blue/10"
															: "pointer-events-none bg-brand-blue/3 text-muted-foreground/60",
													)}
												>
													{category.label}
												</a>
											</li>
										);
									})}
								</ul>
							</nav>

							<p aria-live="polite" className="sr-only">
								{term
									? `${total} ${total === 1 ? "resultado" : "resultados"} para ${query}`
									: ""}
							</p>
						</div>

						{groups.length === 0 ? (
							<div className="flex flex-col items-start gap-4 rounded-4xl border border-dashed border-brand-blue/20 p-8">
								<p className="text-lg font-semibold text-heading">
									Nenhuma dúvida encontrada para “{query}”.
								</p>
								<p className="text-muted-foreground">
									Tente outra palavra ou fale com o nosso atendimento.
								</p>
								<Button variant="outline" onClick={() => setQuery("")}>
									Limpar busca
								</Button>
							</div>
						) : (
							groups.map((group) => (
								<section
									key={group.id}
									id={group.id}
									aria-labelledby={`${group.id}-titulo`}
									className="flex scroll-mt-6 flex-col gap-4 max-lg:scroll-mt-28"
								>
									<h2
										id={`${group.id}-titulo`}
										className="px-1 text-xl/tight font-medium tracking-tight text-heading"
									>
										{group.label}
									</h2>
									<Accordion
										type="multiple"
										className="gap-2.5 overflow-visible rounded-none border-0"
									>
										{group.items.map(({ question, answer }) => (
											<AccordionItem
												key={question}
												value={question}
												className="rounded-2xl bg-card not-last:border-b-0 data-open:bg-card"
											>
												<AccordionTrigger className="items-center gap-6 rounded-2xl p-5 text-base/6 font-medium text-foreground hover:no-underline **:data-[slot=accordion-trigger-icon]:size-5 lg:px-6">
													{question}
												</AccordionTrigger>
												<AccordionContent className="px-1 pr-10 text-base/relaxed text-muted-foreground lg:px-2 lg:pr-16">
													{answer}
												</AccordionContent>
											</AccordionItem>
										))}
									</Accordion>
								</section>
							))
						)}
					</div>

					<aside
						aria-labelledby="faq-ajuda-titulo"
						className="flex flex-col gap-5 rounded-4xl bg-brand-blue p-7 text-white lg:sticky lg:top-8"
					>
						<span className="flex size-12 items-center justify-center rounded-full bg-brand-green text-brand-blue">
							<MailIcon aria-hidden="true" className="size-5.5" />
						</span>
						<div className="flex flex-col gap-2">
							<h2
								id="faq-ajuda-titulo"
								className="text-xl/tight font-semibold text-white"
							>
								Não encontrou sua dúvida?
							</h2>
							<p className="text-[0.9375rem]/6 text-mist">
								Nossa equipe atende por telefone e e-mail e responde rápido.
							</p>
						</div>
						<Button asChild className="self-start">
							<Link to="/contato">Falar com o atendimento</Link>
						</Button>
					</aside>
				</div>
			</div>
		</div>
	);
}
