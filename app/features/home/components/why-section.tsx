import type { MouseEvent } from "react";

import whyInspection from "~/assets/home/why-inspection.webp";
import whySearch from "~/assets/home/why-search.webp";
import whyVehicleBreakdown from "~/assets/home/why-vehicle-breakdown.webp";
import { CarIcon, CheckIcon, ShieldCheckIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { cn } from "~/shared/lib/utils";

import { focusHeroPlateInput, HERO_PLATE_INPUT_ID } from "./plate-form";
import { SectionEyebrow } from "./section-eyebrow";

const cars = [
	{ id: "car-1", alert: false },
	{ id: "car-2", alert: false },
	{ id: "car-3", alert: true },
	{ id: "car-4", alert: false },
];

const tile =
	"relative w-64 shrink-0 snap-start overflow-hidden rounded-3xl lg:w-auto [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out hover:[&_img]:scale-107 motion-reduce:[&_img]:transition-none";

function handleCtaClick(event: MouseEvent<HTMLAnchorElement>) {
	if (focusHeroPlateInput()) event.preventDefault();
}

export function WhySection() {
	return (
		<section
			id="por-que-checkauto"
			aria-labelledby="por-que-checkauto-titulo"
			className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.45fr)] lg:gap-14 lg:py-28"
		>
			<div className="flex flex-col gap-4.5">
				<SectionEyebrow>Por que Checkauto</SectionEyebrow>
				<h2
					id="por-que-checkauto-titulo"
					className="text-3xl/tight font-normal tracking-tight text-balance lg:text-5xl/tight"
				>
					Consulte o histórico e compre com tranquilidade
				</h2>
				<p className="max-w-[42ch] text-muted-foreground">
					Com a Checkauto, você tem todos os dados do veículo na palma da mão,
					garantindo mais transparência e segurança na sua compra.
				</p>
				<Button asChild className="self-start">
					<a href={`#${HERO_PLATE_INPUT_ID}`} onClick={handleCtaClick}>
						Consultar agora
					</a>
				</Button>
			</div>

			<div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 scrollbar-none gap-2.5 overflow-x-auto px-4 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-6 lg:grid-rows-[repeat(9,4rem)] lg:gap-3.5 lg:overflow-visible lg:p-0">
				<div
					data-tile
					className={cn(
						tile,
						"col-span-2 flex flex-col justify-end gap-1.5 bg-brand-blue p-5.5 text-white lg:col-span-3 lg:row-span-3",
					)}
				>
					<strong className="text-6xl/none mb-1.5 font-medium tracking-tighter text-brand-green">
						18%
					</strong>
					<h3 className="font-semibold text-white">Negociação mais justa</h3>
					<p className="text-sm/5 text-mist">
						Em quase 1 a cada 5 consultas aparece algo que muda o preço do
						carro.
					</p>
				</div>

				<div
					data-tile
					className={cn(tile, "hidden lg:col-span-3 lg:row-span-4 lg:block")}
				>
					<img
						src={whyInspection}
						alt="Homem inspecionando o motor de um carro prata"
						width={800}
						height={450}
						loading="lazy"
						decoding="async"
						className="size-full object-cover"
					/>
				</div>

				<div
					data-tile
					className={cn(
						tile,
						"hidden lg:col-span-2 lg:row-span-5 lg:row-start-4 lg:block",
					)}
				>
					<img
						src={whySearch}
						alt="Homem pesquisando no celular ao lado de um carro prata"
						width={750}
						height={1000}
						loading="lazy"
						decoding="async"
						className="size-full object-cover"
					/>
				</div>

				<div
					data-tile
					className={cn(
						tile,
						"col-span-2 flex flex-col gap-4.5 bg-card p-5.5 lg:col-span-4 lg:col-start-3 lg:row-span-2 lg:row-start-5 lg:flex-row lg:items-center",
					)}
				>
					<div
						role="img"
						aria-label="Quatro carros: três sem problemas e um com alerta de restrição"
						className="grid shrink-0 grid-cols-[repeat(4,2.75rem)] gap-1.5 pt-1.5"
					>
						{cars.map(({ id, alert }) => (
							<span
								key={id}
								className={cn(
									"relative flex h-11 items-center justify-center rounded-xl",
									alert
										? "bg-destructive/10 text-destructive outline-2 -outline-offset-2 outline-destructive/50"
										: "bg-accent text-highlight",
								)}
							>
								<CarIcon aria-hidden="true" className="size-5.5" />
								<span
									className={cn(
										"absolute -top-1.5 -right-1.5 flex size-4.5 items-center justify-center rounded-full border-2 border-card text-[0.625rem] font-bold",
										alert
											? "bg-destructive text-white"
											: "bg-brand-green text-foreground",
									)}
								>
									{alert ? (
										"!"
									) : (
										<CheckIcon strokeWidth={4} className="size-2.5" />
									)}
								</span>
							</span>
						))}
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="font-semibold">Segurança antes de comprar</h3>
						<p className="text-sm/5 text-muted-foreground">
							A cada 4 veículos consultados,{" "}
							<strong className="font-semibold text-foreground">
								1 retorna
							</strong>{" "}
							com algum tipo de restrição.
						</p>
					</div>
				</div>

				<div
					data-tile
					className={cn(
						tile,
						"hidden lg:col-span-2 lg:col-start-3 lg:row-span-3 lg:row-start-7 lg:block",
					)}
				>
					<img
						src={whyVehicleBreakdown}
						alt="Homem olhando o motor de um carro quebrado soltando fumaça"
						width={612}
						height={344}
						loading="lazy"
						decoding="async"
						className="size-full object-cover"
					/>
					<div className="absolute inset-x-2.5 bottom-2.5 flex flex-col rounded-2xl bg-secondary/75 px-3 py-2.5 text-secondary-foreground backdrop-blur-md">
						<b className="text-[0.8125rem] font-semibold">Conheça o veículo</b>
						<span className="text-[0.6875rem]/4 opacity-80">
							Evite surpresas desagradáveis.
						</span>
					</div>
				</div>

				<div
					data-tile
					className={cn(
						tile,
						"flex min-h-42 flex-col justify-end gap-1 bg-brand-green p-5.5 text-foreground lg:col-span-2 lg:col-start-5 lg:row-span-3 lg:row-start-7 lg:min-h-0",
					)}
				>
					<strong className="text-[2.75rem]/none font-medium tracking-tight">
						100%
					</strong>
					<h3 className="font-semibold">Fácil e rápido</h3>
					<p className="text-sm/5">
						online: a consulta é rápida e sai na hora.
					</p>
				</div>

				<div
					data-tile
					className={cn(
						tile,
						"flex flex-col items-start gap-2.5 bg-card p-4 lg:col-span-2 lg:row-span-1 lg:row-start-9 lg:flex-row lg:items-center lg:p-3",
					)}
				>
					<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-brand-green">
						<ShieldCheckIcon aria-hidden="true" className="size-4.5" />
					</span>
					<span className="text-xs/4 font-medium">
						Informações seguras, de bases públicas e privadas
					</span>
				</div>
			</div>
		</section>
	);
}
