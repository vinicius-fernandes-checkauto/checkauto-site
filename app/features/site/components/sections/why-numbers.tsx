import { useRef } from "react";

import { gsap, MOTION_OK, useGSAP } from "~/shared/lib/gsap";

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
	const scope = useRef<HTMLDivElement>(null);

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
		<div ref={scope}>
			<ul
				data-stats
				className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
				aria-label="Checkauto em números"
			>
				{stats.map((stat, index) => (
					<li key={stat.highlight} className="flex gap-6">
						<div
							aria-hidden="true"
							className="relative ml-2 h-36 w-13 shrink-0"
						>
							<span className="absolute inset-0 rounded-2xl bg-brand-blue/6" />
							<span
								data-bar
								style={{ height: `${stat.fill}%` }}
								className="absolute inset-x-0 bottom-0 rounded-2xl bg-brand-green"
							/>
							<span className="absolute top-3 -left-2 h-36 w-13 rounded-2xl border-2 border-brand-blue" />
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
	);
}
