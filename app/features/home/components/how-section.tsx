import { Link } from "react-router";

import { ArrowRightIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { cn } from "~/shared/lib/utils";

import { SectionEyebrow } from "./section-eyebrow";
import { StatementPreview } from "./statement-preview";
import { PlansPickingPreview, PlateTypingPreview } from "./step-previews";

type Step = {
	number: string;
	title: string;
	description: string;
	cta?: { label: string; to: string };
	preview: "plate" | "plans" | "statement";
};

const steps: Step[] = [
	{
		number: "01",
		title: "Informe a placa do veículo",
		description:
			"Digite a placa do veículo que você deseja consultar. Pode ser o seu veículo atual ou o que você está pensando em comprar.",
		preview: "plate",
	},
	{
		number: "02",
		title: "Escolha o pacote ideal",
		description:
			"Selecione o pacote mais adequado para sua necessidade. Realize o pagamento de forma segura e conveniente.",
		preview: "plans",
	},
	{
		number: "03",
		title: "Veja o histórico completo na hora",
		description:
			"Receba o relatório completo imediatamente após a confirmação do pagamento e tome decisões com base em informações confiáveis e transparentes.",
		cta: { label: "Consultar agora", to: "/#topo" },
		preview: "statement",
	},
];

export function HowSection() {
	return (
		<section
			id="como-funciona"
			aria-labelledby="como-funciona-titulo"
			className="w-full surface-inverse bg-background text-foreground [--background:var(--color-brand-blue-dark)]"
		>
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
				<div className="flex flex-col gap-4 pt-18 pb-8 lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-8 lg:pt-28 lg:pb-12">
					<div className="flex flex-col gap-3">
						<SectionEyebrow>Como funciona</SectionEyebrow>
						<h2
							id="como-funciona-titulo"
							className="text-3xl/tight font-medium tracking-tight text-balance lg:text-4xl/tight"
						>
							Histórico veicular completo com apenas 3 passos simples
						</h2>
					</div>
					<p className="text-sm/5.5 text-muted-foreground lg:text-right lg:text-base">
						Confiança e experiência da pioneira em informações veiculares no
						Brasil.
					</p>
				</div>

				<ol className="pb-16 lg:pb-28">
					{steps.map((step, index) => (
						<li
							key={step.number}
							className="sticky top-19 grid min-h-72 grid-cols-1 bg-background pt-6 pb-12 lg:min-h-100 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-12 lg:pb-16"
						>
							<span
								aria-hidden="true"
								className="hidden self-center justify-self-center text-[10rem]/[0.8] font-medium tracking-tighter text-highlight lg:block"
							>
								{step.number}
							</span>

							<div
								className={cn(
									"relative flex flex-col gap-3",
									index > 0 &&
										"border-t border-foreground/20 pt-6 before:absolute before:-top-px before:left-0 before:h-0.5 before:w-8 before:bg-foreground",
								)}
							>
								<h3 className="flex items-baseline gap-3 text-2xl font-medium tracking-tight lg:text-[2rem]/tight">
									<span className="text-highlight tabular-nums lg:hidden">
										{step.number}
									</span>
									{step.title}
								</h3>
								<p className="max-w-[52ch] text-muted-foreground">
									{step.description}
								</p>
								{step.cta && (
									<Button asChild size="sm" className="mt-3 self-start">
										<Link to={step.cta.to}>
											{step.cta.label}
											<ArrowRightIcon aria-hidden="true" />
										</Link>
									</Button>
								)}
								<div className="mt-5 max-w-sm rounded-[2rem] bg-foreground/8 p-2.5 sm:p-3">
									{step.preview === "plate" && <PlateTypingPreview />}
									{step.preview === "plans" && <PlansPickingPreview />}
									{step.preview === "statement" && (
										<StatementPreview className="rounded-3xl" />
									)}
								</div>
							</div>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
