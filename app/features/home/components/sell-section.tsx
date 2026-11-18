import sellCars640 from "~/assets/home/sell-cars-640.webp";
import sellCars1000 from "~/assets/home/sell-cars-1000.webp";
import sellCarsMobile from "~/assets/home/sell-cars-mobile.webp";
import { CircleCheckIcon } from "~/shared/components/icons";

import { SectionEyebrow } from "./section-eyebrow";

const benefits = [
	"Agilize a venda do seu carro",
	"Transparência gera confiança",
	"Garanta uma negociação justa",
	"Torne seu anúncio mais atrativo",
];

export function SellSection() {
	return (
		<section
			aria-labelledby="hora-de-vender-titulo"
			className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 lg:py-24"
		>
			<div className="relative isolate grid grid-cols-1 items-center gap-10 overflow-hidden rounded-[2rem] surface-inverse px-6 pt-12 sm:px-10 lg:grid-cols-2 lg:gap-12 lg:rounded-[2.5rem] lg:py-0 lg:pr-0 lg:pl-16">
				<span
					aria-hidden="true"
					className="absolute -top-24 -left-24 -z-10 size-80 rounded-full border-48 border-primary/10"
				/>
				<div className="flex flex-col gap-6 lg:py-20">
					<div className="flex flex-col gap-3">
						<SectionEyebrow>Hora de vender?</SectionEyebrow>
						<h2 id="hora-de-vender-titulo" className="text-h2-sm lg:text-h2">
							Valorize seu carro com a CheckAuto
						</h2>
					</div>
					<p className="max-w-[44ch] text-lead text-muted-foreground">
						Ofereça o histórico completo e feche negócio mais rápido.
					</p>
					<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{benefits.map((benefit) => (
							<li
								key={benefit}
								className="flex items-center gap-3 rounded-2xl bg-accent px-4 py-3 text-small font-medium"
							>
								<CircleCheckIcon
									aria-hidden="true"
									className="size-5 shrink-0 text-highlight"
								/>
								{benefit}
							</li>
						))}
					</ul>
				</div>
				<picture className="-mx-6 block self-end sm:-mx-10 lg:mx-0 lg:self-center lg:py-12">
					<source
						media="(min-width: 1024px)"
						srcSet={`${sellCars640} 640w, ${sellCars1000} 1000w`}
						sizes="40vw"
						width={1000}
						height={1094}
					/>
					<img
						src={sellCarsMobile}
						alt="Carros com selos de consulta aprovada, como quilometragem, recall e valor do veículo"
						width={750}
						height={642}
						loading="lazy"
						decoding="async"
						className="mx-auto w-full max-w-2xl lg:max-w-lg"
					/>
				</picture>
			</div>
		</section>
	);
}
