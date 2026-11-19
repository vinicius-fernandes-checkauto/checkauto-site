import { type MouseEvent, useRef } from "react";

import ring from "~/assets/brand/symbol-ring-blue.webp";
import { ArrowRightIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { gsap, MOTION_OK, useGSAP } from "~/shared/lib/gsap";
import { cn } from "~/shared/lib/utils";

import { focusHeroPlateInput, HERO_PLATE_INPUT_ID } from "./plate-form";
import { SectionEyebrow } from "./section-eyebrow";
import { StatementPreview } from "./statement-preview";
import { PlansPickingPreview, PlateTypingPreview } from "./step-previews";

type Step = {
	number: string;
	title: string;
	description: string;
	preview: "plate" | "plans" | "statement";
	tilt: number;
};

const steps: Step[] = [
	{
		number: "01",
		title: "Informe a placa",
		description: "Do carro que você tem ou do que pretende comprar.",
		preview: "plate",
		tilt: 2,
	},
	{
		number: "02",
		title: "Escolha o pacote",
		description: "Selecione a consulta ideal e pague com segurança.",
		preview: "plans",
		tilt: -2.5,
	},
	{
		number: "03",
		title: "Receba o histórico",
		description: "O relatório completo aparece na hora.",
		preview: "statement",
		tilt: 1.5,
	},
];

function handleCtaClick(event: MouseEvent<HTMLAnchorElement>) {
	if (focusHeroPlateInput()) event.preventDefault();
}

export function HowSection() {
	const scope = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();

			mm.add(MOTION_OK, () => {
				gsap.utils
					.toArray<HTMLElement>("[data-float]")
					.forEach((card, index) => {
						gsap.to(card, {
							y: -8,
							duration: 3.5,
							ease: "sine.inOut",
							yoyo: true,
							repeat: -1,
							delay: index * 1.1,
						});
					});
			});
		},
		{ scope },
	);

	return (
		<section
			ref={scope}
			id="como-funciona"
			aria-labelledby="como-funciona-titulo"
			className="relative isolate w-full overflow-hidden bg-brand-blue-dark text-white"
		>
			<span
				aria-hidden="true"
				style={{ maskImage: `url(${ring})` }}
				className="pointer-events-none absolute top-72 -right-76 -z-10 aspect-896/900 w-160 -rotate-40 bg-brand-green/6 mask-contain mask-no-repeat max-lg:hidden"
			/>
			<span
				aria-hidden="true"
				style={{ maskImage: `url(${ring})` }}
				className="pointer-events-none absolute -bottom-64 -left-56 -z-10 aspect-896/900 w-140 rotate-160 bg-white/4 mask-contain mask-no-repeat max-lg:hidden"
			/>

			<div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 py-16 sm:px-8 lg:gap-18 lg:py-24">
				<div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
					<div className="flex flex-col gap-3">
						<SectionEyebrow className="text-brand-green">
							Como funciona
						</SectionEyebrow>
						<h2
							id="como-funciona-titulo"
							className="text-3xl/tight font-medium tracking-tight text-white lg:text-[2.75rem]/[1.1]"
						>
							Histórico completo em{" "}
							<span className="text-brand-green">3 passos</span>
						</h2>
					</div>
					<Button asChild className="self-start md:self-auto">
						<a href={`#${HERO_PLATE_INPUT_ID}`} onClick={handleCtaClick}>
							Consultar agora
							<ArrowRightIcon aria-hidden="true" />
						</a>
					</Button>
				</div>

				<div className="relative">
					<svg
						aria-hidden="true"
						viewBox="0 0 1152 860"
						preserveAspectRatio="none"
						className="pointer-events-none absolute inset-0 hidden size-full overflow-visible lg:block"
					>
						<path
							d="M 252 120 C 92 300, 892 220, 852 430 C 812 640, 172 560, 292 760"
							fill="none"
							className="stroke-white/18"
							strokeWidth="2"
							strokeDasharray="2 12"
							strokeLinecap="round"
						/>
					</svg>

					<ol className="relative flex flex-col gap-16 lg:gap-12">
						{steps.map((step, index) => {
							const onLeft = index % 2 === 0;

							return (
								<li
									key={step.number}
									className={cn(
										"relative flex flex-col items-start gap-6 lg:w-full lg:max-w-180 lg:flex-row lg:items-center lg:gap-10",
										onLeft ? "lg:mr-auto lg:flex-row-reverse" : "lg:ml-auto",
										index > 0 && "lg:-mt-2",
									)}
								>
									<span
										aria-hidden="true"
										className={cn(
											"text-[7.5rem]/none lg:text-[11rem]/none pointer-events-none absolute -top-10 -left-2 font-semibold tracking-tighter text-transparent [-webkit-text-stroke:1.5px_--alpha(var(--color-brand-green)/28%)] lg:-top-14",
											onLeft ? "lg:-right-6 lg:left-auto" : "lg:-left-6",
										)}
									>
										{step.number}
									</span>

									<div className="relative flex max-w-80 flex-col gap-2">
										<h3 className="text-2xl/tight font-medium tracking-tight text-white lg:text-3xl/tight">
											<span className="sr-only">Passo {step.number}: </span>
											{step.title}
										</h3>
										<p className="text-[0.9375rem]/6 text-mist">
											{step.description}
										</p>
									</div>

									<div
										data-float
										style={{ rotate: `${step.tilt}deg` }}
										className="w-full max-w-100 shrink-0 rounded-[2rem] bg-white/8 p-2.5 sm:p-3 lg:w-90"
									>
										{step.preview === "plate" && <PlateTypingPreview />}
										{step.preview === "plans" && <PlansPickingPreview />}
										{step.preview === "statement" && (
											<StatementPreview className="h-72 rounded-3xl" />
										)}
									</div>
								</li>
							);
						})}
					</ol>
				</div>
			</div>
		</section>
	);
}
