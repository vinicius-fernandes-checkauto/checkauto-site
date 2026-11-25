import { useRef } from "react";

import ring from "~/assets/brand/symbol-ring-blue.webp";
import { SectionEyebrow } from "~/domains/site/components/section-eyebrow";
import { gsap, MOTION_OK, useGSAP } from "~/shared/lib/gsap";
import { cn } from "~/shared/lib/utils";

type Milestone = {
	year: string;
	tag: string;
	title: string;
	body: string;
	consultas: number;
	stat?: string;
	featured?: boolean;
	compactYear?: boolean;
};

const milestones: Milestone[] = [
	{
		year: "2000",
		tag: "O começo",
		title: "Nasce a primeira consulta veicular do Brasil",
		body: "A Checkauto lança o primeiro site de consulta veicular aberto ao público. No início, era preciso explicar ao mercado que essa informação existia.",
		consultas: 0,
	},
	{
		year: "Anos 2000",
		tag: "Referência",
		title: "Vira sinônimo de consulta",
		body: "Em várias regiões do país, comprar um veículo passa a ter dois passos: o laudo de vistoria e a Checkauto.",
		consultas: 0,
		compactYear: true,
	},
	{
		year: "2012",
		tag: "Escala",
		title: "8 milhões de consultas",
		body: "A base passa de 80 milhões de registros e 70 mil usuários cadastrados.",
		consultas: 8,
		stat: "+8 mi",
	},
	{
		year: "2016",
		tag: "Lojistas",
		title: "Pacotes para quem vende veículos",
		body: "Revendas e multimarcas ganham pacotes próprios. Mais de 2 mil empresas na carteira de clientes.",
		consultas: 11,
		stat: "+11 mi",
	},
	{
		year: "2026",
		tag: "Grupo ForRisk",
		title: "Um novo grupo, mais fôlego",
		body: "A Checkauto passa a fazer parte do Grupo ForRisk, com investimentos para expansão.",
		consultas: 11,
	},
	{
		year: "Hoje",
		tag: "Nova Checkauto",
		title: "Nova marca, nova plataforma",
		body: "Mais de 25 anos depois, a pioneira ganha cara nova e vira uma plataforma de inteligência veicular.",
		consultas: 13,
		stat: "+13 mi",
		featured: true,
	},
];

const formatConsultas = (value: number) =>
	value < 0.5 ? "a primeira" : `+${Math.round(value)} mi`;

const lineX = "left-7 -translate-x-1/2 lg:left-1/2";

export function HistorySection() {
	const scope = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();

			mm.add(MOTION_OK, () => {
				const track = {
					trigger: "[data-timeline]",
					start: "top 55%",
					end: "bottom 55%",
					scrub: 0.6,
				};

				gsap.fromTo(
					"[data-timeline-fill]",
					{ scaleY: 0 },
					{
						scaleY: 1,
						transformOrigin: "50% 0%",
						ease: "none",
						scrollTrigger: track,
					},
				);
				gsap.fromTo(
					"[data-timeline-tip]",
					{ top: "0%" },
					{ top: "100%", ease: "none", scrollTrigger: track },
				);
				gsap.fromTo(
					"[data-timeline-spin]",
					{ rotate: 0 },
					{ rotate: 540, ease: "none", scrollTrigger: track },
				);

				const odometer =
					scope.current?.querySelector<HTMLElement>("[data-odometer]");
				const counter = { value: 0 };
				if (odometer) odometer.textContent = formatConsultas(0);

				const countTo = (value: number) =>
					gsap.to(counter, {
						value,
						duration: 0.9,
						ease: "power3.out",
						overwrite: true,
						onUpdate: () => {
							if (odometer) {
								odometer.textContent = formatConsultas(counter.value);
							}
						},
					});

				gsap.utils
					.toArray<HTMLElement>("[data-milestone]")
					.forEach((item, index) => {
						const previous = milestones[index - 1]?.consultas ?? 0;

						gsap
							.timeline({
								scrollTrigger: {
									trigger: item,
									start: "center 55%",
									toggleActions: "play none none reverse",
									onEnter: () => countTo(milestones[index].consultas),
									onLeaveBack: () => countTo(previous),
								},
							})
							.from(
								item.querySelector("[data-milestone-card]"),
								{
									autoAlpha: 0.25,
									x: index % 2 === 0 ? -32 : 32,
									duration: 0.7,
									ease: "power3.out",
								},
								0,
							)
							.from(
								item.querySelector("[data-milestone-year]"),
								{ autoAlpha: 0, duration: 0.6 },
								0,
							)
							.from(
								item.querySelector("[data-milestone-dot]"),
								{ scale: 0, duration: 0.4, ease: "back.out(2)" },
								0,
							);
					});
			});
		},
		{ scope },
	);

	return (
		<section
			ref={scope}
			id="nossa-historia"
			aria-labelledby="nossa-historia-titulo"
			className="relative isolate overflow-clip bg-background"
		>
			<span
				aria-hidden="true"
				style={{ maskImage: `url(${ring})` }}
				className="pointer-events-none absolute -top-56 -left-64 -z-10 aspect-896/900 w-152 -rotate-20 bg-brand-blue/5 mask-contain mask-no-repeat max-lg:hidden"
			/>
			<span
				aria-hidden="true"
				style={{ maskImage: `url(${ring})` }}
				className="pointer-events-none absolute -right-60 -bottom-64 -z-10 aspect-896/900 w-160 rotate-160 bg-brand-blue/6 mask-contain mask-no-repeat max-lg:hidden"
			/>

			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:px-8 lg:gap-16 lg:py-24">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
					<div className="flex flex-col gap-3">
						<SectionEyebrow>Nossa história</SectionEyebrow>
						<h2
							id="nossa-historia-titulo"
							className="text-3xl/tight font-normal tracking-tight text-heading lg:text-[2.75rem]/[1.1]"
						>
							<span className="block">Mais de 25 anos abrindo</span>
							<span className="block">
								o <span className="text-highlight">histórico</span> dos veículos
								do Brasil.
							</span>
						</h2>
					</div>
					<p className="max-w-sm text-[0.9375rem]/6 text-muted-foreground">
						Role a página e acompanhe como a primeira consulta veicular do país
						chegou a mais de 13 milhões.
					</p>
				</div>

				<div data-timeline className="relative flex flex-col">
					<span
						aria-hidden="true"
						className={cn(
							lineX,
							"absolute inset-y-0 w-1 rounded-full bg-brand-blue/8",
						)}
					/>
					<span
						aria-hidden="true"
						data-timeline-fill
						className={cn(
							lineX,
							"absolute inset-y-0 w-1 rounded-full bg-brand-green",
						)}
					/>
					<span
						aria-hidden="true"
						data-timeline-tip
						className={cn(
							lineX,
							"absolute top-full z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-blue shadow-[0_0_0_6px_--alpha(var(--color-brand-green)/25%)]",
						)}
					>
						<span
							data-timeline-spin
							style={{ maskImage: `url(${ring})` }}
							className="aspect-896/900 w-6.5 bg-brand-green mask-contain mask-no-repeat"
						/>
					</span>

					<p className="sticky top-24 z-20 mb-4 inline-flex items-baseline gap-2.5 self-end rounded-full bg-brand-blue px-5 py-2.5 shadow-[0_16px_32px_-16px_--alpha(var(--color-brand-blue)/45%)] lg:top-6 lg:self-center">
						<span className="text-[0.8125rem] font-medium text-mist">
							Consultas realizadas
						</span>
						<span
							data-odometer
							className="text-xl/none font-semibold tracking-tight text-brand-green tabular-nums"
						>
							{formatConsultas(13)}
						</span>
					</p>

					<ol className="flex flex-col">
						{milestones.map((milestone, index) => {
							const onLeft = index % 2 === 0;
							const featured = milestone.featured;

							return (
								<li
									key={milestone.year}
									data-milestone
									className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-y-2 py-6 lg:min-h-60 lg:grid-cols-[minmax(0,1fr)_6rem_minmax(0,1fr)] lg:py-0"
								>
									<div
										className={cn(
											"relative col-start-2 row-start-1 font-medium tracking-tighter",
											milestone.compactYear
												? "text-4xl/none lg:text-7xl/none"
												: "text-5xl/none lg:text-[5.5rem]/none",
											onLeft
												? "lg:col-start-3 lg:pl-4"
												: "lg:col-start-1 lg:pr-4 lg:text-right",
										)}
									>
										<span
											aria-hidden="true"
											className="text-transparent [-webkit-text-stroke:1.5px_--alpha(var(--color-brand-blue)/22%)]"
										>
											{milestone.year}
										</span>
										<span
											data-milestone-year
											className={cn(
												"absolute inset-0 lg:px-4",
												featured ? "text-highlight" : "text-heading",
												onLeft ? "lg:pr-0" : "lg:pl-0",
											)}
										>
											{milestone.year}
										</span>
									</div>

									<span
										aria-hidden="true"
										className="relative z-10 col-start-1 row-span-2 row-start-1 mt-2 size-5.5 self-start justify-self-center rounded-full border-4 border-brand-blue/18 bg-background lg:col-start-2 lg:row-span-1 lg:mt-0 lg:self-center"
									>
										<span
											data-milestone-dot
											className="absolute -inset-1 rounded-full border-4 border-brand-green bg-brand-blue"
										/>
									</span>

									<article
										data-milestone-card
										className={cn(
											"col-start-2 row-start-2 flex flex-col gap-3 rounded-4xl p-6 lg:row-start-1 lg:p-7",
											onLeft ? "lg:col-start-1" : "lg:col-start-3",
											featured
												? "bg-brand-blue text-white"
												: "border border-border bg-card text-heading shadow-[0_12px_32px_-20px_--alpha(var(--color-brand-blue)/18%)]",
										)}
									>
										<div className="flex flex-wrap items-center gap-2">
											<span
												className={cn(
													"rounded-full px-3 py-1 text-xs/5 font-semibold tracking-wide uppercase",
													featured
														? "bg-white/12 text-brand-green"
														: "bg-brand-green/14 text-highlight",
												)}
											>
												{milestone.tag}
											</span>
										</div>
										<h3
											className={cn(
												"text-xl/snug font-semibold tracking-tight lg:text-2xl/snug",
												featured && "text-white",
											)}
										>
											{milestone.title}
										</h3>
										<p
											className={cn(
												"text-[0.9375rem]/6",
												featured ? "text-mist" : "text-muted-foreground",
											)}
										>
											{milestone.body}
										</p>
										{milestone.stat && (
											<p className="flex items-baseline gap-2 pt-1">
												<strong
													className={cn(
														"text-3xl/none font-medium tracking-tighter",
														featured ? "text-brand-green" : "text-heading",
													)}
												>
													{milestone.stat}
												</strong>
												<span
													className={cn(
														"text-sm font-medium",
														featured ? "text-mist" : "text-muted-foreground",
													)}
												>
													consultas
												</span>
											</p>
										)}
									</article>
								</li>
							);
						})}
					</ol>
				</div>
			</div>
		</section>
	);
}
