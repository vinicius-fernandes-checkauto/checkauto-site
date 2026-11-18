import { Link } from "react-router";

import ring from "~/assets/brand/symbol-ring-blue.webp";
import heroCar640 from "~/assets/home/hero-car-640.webp";
import heroCar1000 from "~/assets/home/hero-car-1000.webp";
import socialPeople from "~/assets/home/social-people.webp";
import { ChevronDownIcon } from "~/shared/components/icons";

import { HERO_PLATE_INPUT_ID, PlateForm } from "./plate-form";

export function HeroSection() {
	return (
		<section
			aria-labelledby="hero-titulo"
			className="mx-auto w-full max-w-7xl px-4 pt-2 sm:px-8"
		>
			<div className="relative isolate overflow-hidden rounded-[2rem] bg-navy-100 lg:rounded-[2.5rem]">
				<img
					src={ring}
					alt=""
					aria-hidden="true"
					width={896}
					height={900}
					className="pointer-events-none absolute -top-24 -right-40 -z-10 w-104 opacity-[0.07] lg:-top-40 lg:-right-48 lg:w-180"
				/>

				<div className="grid grid-cols-1 gap-4 px-5 pt-10 sm:px-10 sm:pt-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-6 lg:py-0 lg:pr-0 lg:pl-16 xl:pl-18">
					<div className="flex min-w-0 flex-col gap-5 lg:gap-6 lg:py-18">
						<h1
							id="hero-titulo"
							className="text-display-sm font-normal xl:text-display"
						>
							<span className="block font-semibold">Antes de comprar,</span>{" "}
							confira o histórico completo do carro
						</h1>
						<p className="max-w-[46ch] text-lead text-muted-foreground">
							Evite surpresas. Consulte informações completas do veículo de
							forma fácil, rápida e segura.
						</p>
						<div className="flex flex-col">
							<PlateForm inputId={HERO_PLATE_INPUT_ID} />
							<Link
								to="/ainda-nao-tenho-placa"
								className="-mt-1 inline-flex min-h-11 w-fit items-center self-center px-5 text-small font-medium text-heading underline decoration-1 underline-offset-4 hover:decoration-2 sm:self-start"
							>
								Ainda não tenho a placa
							</Link>
						</div>
						<p className="flex items-center gap-3">
							<img
								src={socialPeople}
								alt=""
								aria-hidden="true"
								width={314}
								height={86}
								className="h-11 w-auto"
							/>
							<span className="flex flex-col">
								<strong className="text-h4 leading-tight font-semibold text-heading">
									+250.000
								</strong>{" "}
								<span className="text-small text-muted-foreground">
									consultas já realizadas
								</span>
							</span>
						</p>
					</div>
					<img
						src={heroCar1000}
						srcSet={`${heroCar640} 640w, ${heroCar1000} 1000w`}
						sizes="(min-width: 1024px) 50vw, 100vw"
						alt="SUV azul com destaques do relatório: restrições, indício de sinistro, oferta em leilão e mais de 40 informações"
						width={1000}
						height={851}
						fetchPriority="high"
						className="-mr-5 ml-auto w-[calc(100%+1.25rem)] max-w-lg self-end sm:-mr-10 sm:w-[calc(100%+2.5rem)] lg:mr-0 lg:w-full lg:max-w-none"
					/>
				</div>
			</div>

			<div className="flex justify-center pt-5">
				<Link
					to="/#por-que-checkauto"
					aria-label="Ir para Por que Checkauto"
					className="flex size-13 items-center justify-center rounded-full border border-border bg-card text-heading transition-colors hover:border-slate-300"
				>
					<ChevronDownIcon aria-hidden="true" className="size-5" />
				</Link>
			</div>
		</section>
	);
}
