import { useState } from "react";
import { Link } from "react-router";

import logo from "~/assets/brand/checkauto-logo.png";
import { CircleCheckIcon } from "~/shared/components/icons";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/shared/components/ui/accordion";
import { Button } from "~/shared/components/ui/button";
import { plans } from "~/shared/config/plans";
import { cn } from "~/shared/lib/utils";

import { SectionEyebrow } from "./section-eyebrow";

const steps = [
	{
		id: "placa",
		title: "Informe a placa do veículo",
		description:
			"Digite a placa do veículo que você deseja consultar. Pode ser o seu veículo atual ou o que você está pensando em comprar.",
	},
	{
		id: "pacote",
		title: "Escolha o pacote ideal",
		description:
			"Selecione o pacote mais adequado para sua necessidade. Realize o pagamento de forma segura e conveniente.",
	},
	{
		id: "historico",
		title: "Veja o histórico completo na hora",
		description:
			"Receba o relatório completo imediatamente após a confirmação do pagamento e tome decisões com base em informações confiáveis e transparentes.",
	},
];

const reportItems = [
	"Restrições",
	"Oferta em leilão",
	"Indício de sinistro",
	"Roubo e furto",
	"Gravame",
];

function PhoneScreen({ step }: { step: string }) {
	if (step === "pacote") {
		return (
			<div className="flex flex-col gap-2.5">
				<p className="text-small font-semibold text-heading">
					Escolha o pacote
				</p>
				{plans.map(({ id, name }, index) => (
					<div
						key={id}
						className={cn(
							"flex items-center gap-2.5 rounded-xl border p-3 text-caption font-medium text-heading",
							index === 0 ? "border-highlight bg-accent" : "border-border",
						)}
					>
						<span
							className={cn(
								"flex size-4 shrink-0 items-center justify-center rounded-full border-2",
								index === 0 ? "border-highlight" : "border-border",
							)}
						>
							{index === 0 && (
								<span className="size-1.5 rounded-full bg-highlight" />
							)}
						</span>
						{name}
					</div>
				))}
				<span className="mt-1 flex h-9 items-center justify-center rounded-full bg-primary text-caption font-semibold text-primary-foreground">
					Pagar com segurança
				</span>
			</div>
		);
	}

	if (step === "historico") {
		return (
			<div className="flex flex-col gap-2.5">
				<p className="text-small font-semibold text-heading">
					Relatório pronto
				</p>
				<div className="rounded-xl bg-secondary p-3 text-secondary-foreground">
					<p className="text-caption opacity-80">Placa</p>
					<p className="font-semibold tracking-[0.12em]">ABC1D23</p>
				</div>
				<ul className="flex flex-col gap-1.5">
					{reportItems.map((item) => (
						<li
							key={item}
							className="flex items-center gap-2 rounded-lg bg-muted px-2.5 py-2 text-caption text-heading"
						>
							<CircleCheckIcon className="size-4 shrink-0 text-highlight" />
							{item}
						</li>
					))}
				</ul>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			<p className="text-small font-semibold text-heading">
				Consulte pela placa
			</p>
			<div className="flex h-11 items-center gap-2 rounded-full border border-border bg-card px-2">
				<span className="flex size-7 items-center justify-center rounded-full bg-navy-50 text-[0.5625rem] font-semibold text-heading">
					BR
				</span>
				<span className="text-small font-semibold tracking-[0.12em] text-heading">
					ABC1D23
				</span>
				<span className="ml-0.5 h-4 w-px animate-pulse bg-heading" />
			</div>
			<span className="flex h-9 items-center justify-center rounded-full bg-primary text-caption font-semibold text-primary-foreground">
				Consultar
			</span>
		</div>
	);
}

export function HowSection() {
	const [step, setStep] = useState(steps[0].id);

	return (
		<section
			id="como-funciona"
			aria-labelledby="como-funciona-titulo"
			className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 lg:py-24"
		>
			<div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
				<div className="flex flex-col gap-8">
					<div className="flex flex-col gap-3">
						<SectionEyebrow>Como funciona</SectionEyebrow>
						<h2 id="como-funciona-titulo" className="text-h2-sm lg:text-h2">
							Histórico veicular completo com apenas 3 passos simples
						</h2>
					</div>

					<Accordion
						type="single"
						value={step}
						onValueChange={(value) => value && setStep(value)}
						className="gap-3 overflow-visible rounded-none border-0"
					>
						{steps.map(({ id, title, description }, index) => (
							<AccordionItem
								key={id}
								value={id}
								className="rounded-2xl border border-border bg-card not-last:border-b data-open:border-highlight/40 data-open:bg-card"
							>
								<AccordionTrigger className="items-center gap-4 rounded-2xl p-5 text-h5 font-semibold text-heading hover:no-underline">
									<span className="flex items-center gap-4">
										<span
											aria-hidden="true"
											className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-small font-semibold text-highlight transition-colors group-aria-expanded/accordion-trigger:bg-primary group-aria-expanded/accordion-trigger:text-primary-foreground"
										>
											{index + 1}
										</span>
										{title}
									</span>
								</AccordionTrigger>
								<AccordionContent className="pl-14 text-body text-muted-foreground">
									{description}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>

					<Button asChild size="lg" className="w-full sm:w-fit">
						<Link to="/#pacotes">Consultar agora</Link>
					</Button>
				</div>

				<div
					aria-hidden="true"
					className="relative isolate hidden justify-center overflow-hidden rounded-[2rem] bg-navy-100 px-6 pt-12 lg:flex lg:rounded-[2.5rem] lg:pt-16"
				>
					<span className="absolute -top-24 -right-24 -z-10 size-80 rounded-full border-48 border-brand-blue/5" />
					<span className="absolute -bottom-32 -left-20 -z-10 size-72 rounded-full border-40 border-primary/10" />
					<div className="w-64 rounded-t-[2.75rem] border-8 border-b-0 border-brand-blue bg-brand-blue p-1.5 pb-0 sm:w-72">
						<div className="flex h-104 flex-col gap-5 rounded-t-[2.1rem] bg-card px-4 pt-3">
							<div className="mx-auto h-5 w-20 rounded-full bg-brand-blue" />
							<img
								src={logo}
								alt=""
								width={800}
								height={109}
								className="h-4 w-auto self-start"
							/>
							<div
								key={step}
								className="animate-in duration-300 fade-in slide-in-from-bottom-2 motion-reduce:animate-none"
							>
								<PhoneScreen step={step} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
