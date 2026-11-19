import { useRef } from "react";

import { gsap, MOTION_OK, useGSAP } from "~/shared/lib/gsap";

import { SectionEyebrow } from "./section-eyebrow";

type Stat = {
	value: number;
	prefix?: string;
	suffix?: string;
	fill: number;
	before: string;
	highlight: string;
	after?: string;
};

const stats: Stat[] = [
	{
		value: 13,
		prefix: "+",
		suffix: " mi",
		fill: 100,
		before: "de ",
		highlight: "consultas realizadas",
		after: " desde 2000",
	},
	{
		value: 80,
		prefix: "+",
		suffix: " mi",
		fill: 100,
		before: "de ",
		highlight: "registros",
		after: " na nossa base de dados",
	},
	{
		value: 70,
		prefix: "+",
		suffix: " mil",
		fill: 90,
		before: "",
		highlight: "usuários cadastrados",
		after: " consultando com a Checkauto",
	},
	{
		value: 2_000,
		prefix: "+",
		fill: 80,
		before: "",
		highlight: "empresas",
		after: " atendidas, de lojistas a bancos e seguradoras",
	},
];

const format = ({ prefix = "", suffix = "" }: Stat, value: number) =>
	`${prefix}${Math.round(value).toLocaleString("pt-BR")}${suffix}`;

export function WhyNumbers() {
	const scope = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();

			mm.add(MOTION_OK, () => {
				const trigger = { trigger: "[data-stats]", start: "top 80%" };

				gsap.from("[data-bar]", {
					height: 0,
					duration: 1.6,
					ease: "power3.out",
					stagger: 0.12,
					scrollTrigger: trigger,
				});

				for (const el of gsap.utils.toArray<HTMLElement>("[data-count]")) {
					const stat = stats[Number(el.dataset.count)];
					const counter = { value: 0 };

					gsap.to(counter, {
						value: stat.value,
						duration: 1.6,
						ease: "power3.out",
						scrollTrigger: trigger,
						onUpdate: () => {
							el.textContent = format(stat, counter.value);
						},
					});
				}
			});
		},
		{ scope },
	);

	return (
		<section
			ref={scope}
			id="nossos-numeros"
			aria-labelledby="nossos-numeros-titulo"
			className="relative lg:flex lg:min-h-[min(100svh,40rem)] lg:items-center"
		>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-16 sm:px-8 lg:gap-10 lg:py-12">
				<div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-end lg:justify-between lg:gap-12">
					<div className="flex flex-col gap-3 lg:items-end lg:text-right">
						<SectionEyebrow>Nossos números</SectionEyebrow>
						<h2
							id="nossos-numeros-titulo"
							className="text-3xl/tight font-normal tracking-tight text-heading lg:text-[2.75rem]/[1.1]"
						>
							<span className="block">Mais de 25 anos de confiança,</span>
							<span className="block text-highlight">em números.</span>
						</h2>
					</div>
					<p className="max-w-md text-[0.9375rem]/6 text-muted-foreground">
						Cada consulta ajuda a construir a base que protege quem compra,
						vende e financia veículos no Brasil.
					</p>
				</div>

				<ul
					data-stats
					className="grid grid-cols-1 gap-x-8 gap-y-10 rounded-4xl border border-border bg-card p-6 shadow-[0_12px_32px_-20px_--alpha(var(--color-brand-blue)/18%)] sm:grid-cols-2 lg:grid-cols-4 lg:p-10"
				>
					{stats.map((stat, index) => (
						<li key={stat.highlight} className="flex gap-6">
							<div
								aria-hidden="true"
								className="relative ml-2 h-46 w-13 shrink-0"
							>
								<span className="absolute inset-0 rounded-2xl bg-brand-blue/6" />
								<span
									data-bar
									style={{ height: `${stat.fill}%` }}
									className="absolute inset-x-0 bottom-0 rounded-2xl bg-brand-green"
								/>
								<span className="absolute top-3 -left-2 h-46 w-13 rounded-2xl border-2 border-brand-blue" />
							</div>
							<div className="flex flex-col gap-3 pt-1">
								<strong
									data-count={index}
									className="text-5xl/none font-medium tracking-tighter text-heading tabular-nums"
								>
									{format(stat, stat.value)}
								</strong>
								<p className="text-sm/[1.375rem] font-medium text-heading">
									{stat.before}
									<span className="rounded-md bg-brand-green/18 px-1.5 py-px">
										{stat.highlight}
									</span>
									{stat.after}
								</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
