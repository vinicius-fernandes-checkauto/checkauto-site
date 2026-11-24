import { useRef } from "react";

import { SectionEyebrow } from "~/features/site/components/section-eyebrow";
import { Arc } from "~/shared/components/arc";
import { Button } from "~/shared/components/ui/button";
import { gsap, MOTION_OK, useGSAP } from "~/shared/lib/gsap";
import { cn } from "~/shared/lib/utils";

import { StatementPreview } from "./statement-preview";
import { PlansPickingPreview, PlateTypingPreview } from "./step-previews";

type Step = {
	number: string;
	title: string;
	description: string;
	preview: "plate" | "plans" | "statement";
	className: string;
};

const steps: Step[] = [
	{
		number: "1",
		title: "Informe a placa",
		description: "Do veículo que você tem ou do que pretende comprar.",
		preview: "plate",
		className: "lg:col-start-1 lg:row-start-1",
	},
	{
		number: "2",
		title: "Escolha o pacote",
		description: "Selecione a consulta ideal e pague com segurança.",
		preview: "plans",
		className: "lg:col-start-1 lg:row-start-2",
	},
	{
		number: "3",
		title: "Receba o histórico",
		description: "O relatório completo aparece na hora.",
		preview: "statement",
		className: "lg:col-start-2 lg:row-start-2",
	},
];

function Connector({
	className,
	path,
	from,
	to,
	viewBox,
}: {
	className: string;
	path: string;
	from: [number, number];
	to: [number, number];
	viewBox: string;
}) {
	return (
		<svg
			aria-hidden="true"
			viewBox={viewBox}
			fill="none"
			className={cn(
				"pointer-events-none absolute z-10 hidden overflow-visible lg:block",
				className,
			)}
		>
			<path
				d={path}
				className="stroke-white/40"
				strokeWidth="1.5"
				strokeDasharray="4 5"
				strokeLinecap="round"
			/>
			<circle cx={from[0]} cy={from[1]} r="4" className="fill-brand-green" />
			<circle cx={to[0]} cy={to[1]} r="5" className="fill-white" />
		</svg>
	);
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
			className="relative isolate w-full overflow-hidden bg-brand-blue-dark text-white lg:flex lg:min-h-svh lg:items-center"
		>
			<Arc className="top-72 -right-76 -z-10 w-160 -rotate-40 bg-brand-green/6 max-lg:hidden" />
			<Arc className="-bottom-64 -left-56 -z-10 w-140 rotate-160 bg-white/4 max-lg:hidden" />

			<div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-16 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:py-10">
				<div className="mb-6 flex flex-col items-start gap-6 lg:col-start-2 lg:row-start-1 lg:mb-0 lg:justify-center lg:pl-6">
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
					<Button asChild>
						<a href="#pacotes">Consultar agora</a>
					</Button>
				</div>

				<ol className="contents">
					{steps.map((step, index) => (
						<li
							key={step.number}
							className={cn(
								"relative flex flex-col gap-6 rounded-4xl border border-white/10 bg-white/6 p-4 sm:p-6 lg:flex-row lg:items-center lg:gap-6 xl:gap-8",
								step.className,
							)}
						>
							{index === 0 && (
								<Connector
									className="-bottom-13 left-14 h-16 w-20"
									path="M 4 4 C 4 40, 40 60, 76 60"
									from={[4, 4]}
									to={[76, 60]}
									viewBox="0 0 80 64"
								/>
							)}
							{index === 1 && (
								<Connector
									className="top-1/2 -right-13 h-12 w-14 -translate-y-1/2"
									path="M 4 40 C 28 40, 28 8, 52 8"
									from={[4, 40]}
									to={[52, 8]}
									viewBox="0 0 56 48"
								/>
							)}

							<div className="flex flex-col gap-4 lg:w-36 lg:shrink-0 xl:w-44">
								<span
									aria-hidden="true"
									className="text-6xl/none relative isolate w-fit pt-2 pl-3 font-semibold text-brand-green tabular-nums"
								>
									<span className="absolute top-0 left-0 -z-10 size-12 rounded-xl bg-brand-green/20" />
									{step.number}
								</span>
								<div className="flex flex-col gap-1.5">
									<h3 className="text-xl/tight font-medium tracking-tight text-white">
										<span className="sr-only">Passo {step.number}: </span>
										{step.title}
									</h3>
									<p className="text-sm/5.5 text-mist">{step.description}</p>
								</div>
							</div>

							<div
								data-float
								className="w-full max-w-100 min-w-0 rounded-[1.75rem] bg-white/8 p-2.5 max-sm:[zoom:0.88] lg:max-w-none lg:flex-1 lg:max-xl:[zoom:0.74]"
							>
								{step.preview === "plate" && <PlateTypingPreview />}
								{step.preview === "plans" && <PlansPickingPreview />}
								{step.preview === "statement" && (
									<StatementPreview className="h-44 rounded-3xl" />
								)}
							</div>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
