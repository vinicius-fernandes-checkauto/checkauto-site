import type { MouseEvent, ReactNode } from "react";

import whyInspection from "~/assets/home/why-inspection.webp";
import whyNegotiation from "~/assets/home/why-negotiation.webp";
import whyPhone from "~/assets/home/why-phone.webp";
import whyVehicleBreakdown from "~/assets/home/why-vehicle-breakdown.webp";
import { ArrowRightIcon, ZapIcon } from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

import { focusHeroPlateInput, HERO_PLATE_INPUT_ID } from "./plate-form";
import { SectionEyebrow } from "./section-eyebrow";

type Reason = {
	title: string;
	description: ReactNode;
	image: string;
	cardClassName: string;
	imageClassName: string;
	contentClassName: string;
};

const reasons: Reason[] = [
	{
		title: "Segurança antes de comprar",
		description: (
			<>
				A cada 4 veículos consultados na Checkauto,{" "}
				<strong className="font-semibold text-heading">1 retorna</strong> com
				algum tipo de restrição.
			</>
		),
		image: whyInspection,
		cardClassName: "lg:col-start-3 lg:min-h-84",
		imageClassName: "aspect-video lg:h-36 lg:shrink-0",
		contentClassName: "gap-1 p-4 lg:flex-1",
	},
	{
		title: "Informações seguras",
		description:
			"Informações em tempo real obtidas oficialmente de banco de dados públicos e privados.",
		image: whyPhone,
		cardClassName: "lg:col-start-4 lg:min-h-84",
		imageClassName: "aspect-video lg:h-36 lg:shrink-0",
		contentClassName: "gap-1 p-4 lg:flex-1",
	},
	{
		title: "Conheça o veículo",
		description:
			"A consulta do histórico permite que você tenha informações sobre o veículo, evitando surpresas desagradáveis.",
		image: whyVehicleBreakdown,
		cardClassName: "lg:col-span-2 lg:row-start-2 lg:flex-row lg:min-h-40",
		imageClassName: "aspect-video lg:h-full lg:w-[42%] lg:shrink-0",
		contentClassName: "p-5 lg:flex-1 lg:justify-center lg:p-4",
	},
];

function handleCtaClick(event: MouseEvent<HTMLAnchorElement>) {
	if (focusHeroPlateInput()) event.preventDefault();
}

export function WhySection() {
	return (
		<section
			id="por-que-checkauto"
			aria-labelledby="por-que-checkauto-titulo"
			className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:px-8 lg:py-24"
		>
			<div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:items-end lg:gap-x-4">
				<div className="flex flex-col gap-3 lg:col-span-2 lg:pr-10">
					<SectionEyebrow>Por que Checkauto</SectionEyebrow>
					<h2
						id="por-que-checkauto-titulo"
						className="text-3xl/tight font-semibold tracking-tight lg:text-4xl/tight"
					>
						Consulte o histórico e compre com tranquilidade
					</h2>
				</div>

				<p className="max-w-[46ch] text-muted-foreground">
					Com a Checkauto, você tem todos os dados do veículo na palma da mão,
					garantindo mais transparência e segurança na sua compra.
				</p>
			</div>

			<ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 scrollbar-none gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:auto-rows-auto lg:grid-cols-4 lg:gap-4">
				<li className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card max-sm:w-[82%] max-sm:shrink-0 max-sm:snap-start sm:col-span-2 lg:row-start-1 lg:min-h-84 lg:flex-row">
					<div className="aspect-video overflow-hidden lg:aspect-auto lg:w-[50%]">
						<img
							src={whyNegotiation}
							alt=""
							width={800}
							height={800}
							loading="lazy"
							decoding="async"
							className="size-full object-cover transition-transform duration-500 group-hover:scale-104 motion-reduce:transition-none"
						/>
					</div>

					<div className="flex flex-col justify-center gap-2 p-6 lg:flex-1 lg:p-8">
						<h3 className="text-xl font-semibold">Negociação mais justa</h3>

						<p className="mt-1 flex items-baseline gap-2">
							<span className="text-5xl/none font-semibold tracking-tight text-heading">
								18%
							</span>{" "}
							<span className="text-sm/5.5 text-muted-foreground">
								das consultas
							</span>
						</p>

						<p className="text-muted-foreground">
							retornam com informações que interferem no valor do veículo.
						</p>
					</div>
				</li>

				{reasons.map(
					({
						title,
						description,
						image,
						cardClassName,
						imageClassName,
						contentClassName,
					}) => (
						<li
							key={title}
							className={cn(
								"group flex flex-col overflow-hidden rounded-2xl border border-border bg-card max-sm:w-[82%] max-sm:shrink-0 max-sm:snap-start",
								cardClassName,
							)}
						>
							<div className={cn("overflow-hidden", imageClassName)}>
								<img
									src={image}
									alt=""
									width={800}
									height={450}
									loading="lazy"
									decoding="async"
									className="size-full object-cover transition-transform duration-500 group-hover:scale-104 motion-reduce:transition-none"
								/>
							</div>

							<div className={cn("flex flex-col gap-2", contentClassName)}>
								<h3 className="text-lg/6 font-semibold">{title}</h3>
								<p className="text-muted-foreground">{description}</p>
							</div>
						</li>
					),
				)}

				<li className="group relative isolate flex flex-col gap-4 overflow-hidden rounded-2xl surface-inverse p-6 max-sm:w-[82%] max-sm:shrink-0 max-sm:snap-start sm:col-span-2 lg:col-span-2 lg:row-start-2 lg:min-h-40 lg:flex-row lg:items-center lg:gap-4 lg:p-4">
					<span
						aria-hidden="true"
						className="absolute -top-16 -right-16 -z-10 size-56 rounded-full border-28 border-primary/10 transition-transform duration-700 group-hover:scale-110"
					/>

					<span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-highlight">
						<ZapIcon aria-hidden="true" className="size-6" />
					</span>

					<div className="flex flex-col gap-1 lg:flex-1">
						<h3 className="text-lg/6 font-semibold">Fácil e rápido</h3>

						<p className="text-muted-foreground">
							100% online, a consulta do histórico é rápida e fácil, oferecendo
							mais conveniência e agilidade para você.
						</p>

						<a
							href={`#${HERO_PLATE_INPUT_ID}`}
							onClick={handleCtaClick}
							className="group/cta mt-1 inline-flex min-h-11 w-fit items-center gap-2 font-semibold transition-colors hover:text-highlight"
						>
							Consultar agora
							<ArrowRightIcon
								aria-hidden="true"
								className="size-5 transition-transform group-hover/cta:translate-x-1 motion-reduce:transition-none"
							/>
						</a>
					</div>
				</li>
			</ul>
		</section>
	);
}
