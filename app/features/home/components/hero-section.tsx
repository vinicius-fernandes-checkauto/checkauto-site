import { useRef } from "react";
import { Link } from "react-router";

import ring from "~/assets/brand/symbol-ring-blue.webp";
import heroCar640 from "~/assets/home/hero-car-640.webp";
import heroCar1000 from "~/assets/home/hero-car-1000.webp";
import socialPeople from "~/assets/home/social-people.webp";
import {
	ChevronDownIcon,
	CircleCheckIcon,
	TriangleAlertIcon,
} from "~/shared/components/icons";
import { gsap, MOTION_OK, useGSAP } from "~/shared/lib/gsap";
import { cn } from "~/shared/lib/utils";

import { HERO_PLATE_INPUT_ID, PlateForm } from "./plate-form";

const trust = [
	"Resultado na hora",
	"Bases oficiais e privadas",
	"Extrato em PDF",
];

/** Prévia do extrato: o mesmo resumo que o cliente recebe (dados fictícios). */
const preview = [
	{ label: "Oferta em leilão", status: "1 registro", warn: true },
	{ label: "Indício de sinistro", status: "Nada consta" },
	{ label: "Roubo e furto", status: "Nada consta" },
	{ label: "Gravame", status: "Baixado" },
];

/** Entrada escalonada só com CSS: pinta certo desde o primeiro quadro. */
const enter =
	"animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both motion-reduce:animate-none";

export function HeroSection() {
	const scope = useRef<HTMLElement>(null);

	// Parallax leve: o carro e o extrato andam em velocidades diferentes.
	useGSAP(
		() => {
			const mm = gsap.matchMedia();

			mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
				const scrollTrigger = {
					trigger: scope.current,
					start: "top top",
					end: "bottom top",
					scrub: true,
				};

				gsap.to("[data-hero-car]", {
					yPercent: 10,
					ease: "none",
					scrollTrigger,
				});
				gsap.to("[data-hero-statement]", {
					yPercent: -35,
					ease: "none",
					scrollTrigger,
				});
				gsap.to("[data-hero-ring]", {
					rotate: 25,
					ease: "none",
					scrollTrigger,
				});
			});
		},
		{ scope },
	);

	return (
		<section
			ref={scope}
			aria-labelledby="hero-titulo"
			className="relative isolate overflow-hidden surface-inverse"
		>
			{/* Fundo: brilho verde atrás do carro + arco da marca. */}
			<span
				aria-hidden="true"
				className="absolute -right-40 bottom-0 -z-10 size-160 rounded-full bg-brand-green/15 blur-[120px] lg:right-0"
			/>
			<img
				data-hero-ring
				src={ring}
				alt=""
				aria-hidden="true"
				width={896}
				height={900}
				className="pointer-events-none absolute -top-56 -left-64 -z-10 w-180 opacity-[0.08] invert"
			/>

			<div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 pt-12 pb-6 sm:px-8 lg:min-h-[calc(100svh-4.75rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8 lg:py-16">
				<div className="flex min-w-0 flex-col gap-6 lg:gap-7">
					<p
						className={cn(
							enter,
							"flex w-fit items-center gap-3 rounded-full border border-border bg-accent py-1.5 pr-4 pl-1.5 text-sm/5.5 text-muted-foreground",
						)}
					>
						<img
							src={socialPeople}
							alt=""
							aria-hidden="true"
							width={314}
							height={86}
							className="h-8 w-auto"
						/>
						<span>
							<strong className="font-semibold text-heading">+250.000</strong>{" "}
							consultas já realizadas
						</span>
					</p>

					<h1
						id="hero-titulo"
						style={{ animationDelay: "120ms" }}
						className={cn(
							enter,
							"text-4xl/tight font-semibold tracking-tight text-balance text-heading xl:text-5xl/tight",
						)}
					>
						Antes de comprar, confira o{" "}
						<span className="text-highlight">histórico completo</span> do carro
					</h1>

					<p
						style={{ animationDelay: "240ms" }}
						className={cn(enter, "max-w-[46ch] text-lg text-muted-foreground")}
					>
						Leilão, sinistro, roubo e furto, gravame e mais de 40 informações em
						um extrato só. Digite a placa e veja na hora.
					</p>

					<div
						style={{ animationDelay: "360ms" }}
						className={cn(enter, "flex flex-col")}
					>
						<PlateForm inputId={HERO_PLATE_INPUT_ID} />
						<Link
							to="/ainda-nao-tenho-placa"
							className="-mt-1 inline-flex min-h-11 w-fit items-center self-center px-5 text-sm/5.5 font-medium text-muted-foreground underline decoration-1 underline-offset-4 hover:text-heading hover:decoration-2 sm:self-start"
						>
							Ainda não tenho a placa
						</Link>
					</div>

					<ul
						style={{ animationDelay: "480ms" }}
						className={cn(
							enter,
							"flex flex-wrap gap-x-6 gap-y-2 text-sm/5.5 text-muted-foreground",
						)}
					>
						{trust.map((item) => (
							<li key={item} className="flex items-center gap-2">
								<CircleCheckIcon
									aria-hidden="true"
									className="size-4.5 text-highlight"
								/>
								{item}
							</li>
						))}
					</ul>
				</div>

				<div className="relative">
					<div
						style={{ animationDelay: "200ms" }}
						className="animate-in duration-1000 fill-mode-both fade-in slide-in-from-right-16 motion-reduce:animate-none"
					>
						<img
							data-hero-car
							src={heroCar1000}
							srcSet={`${heroCar640} 640w, ${heroCar1000} 1000w`}
							sizes="(min-width: 1024px) 55vw, 100vw"
							alt="SUV azul com destaques do relatório: restrições, indício de sinistro, oferta em leilão e mais de 40 informações"
							width={1000}
							height={851}
							fetchPriority="high"
							className="relative -mr-4 ml-auto w-[calc(100%+1rem)] max-w-xl mask-r-from-90% mask-r-to-100% sm:-mr-8 lg:-mr-20 lg:w-[calc(100%+5rem)] lg:max-w-none"
						/>
					</div>

					{/* Mini extrato: liga a hero ao que o cliente recebe. */}
					<div
						data-hero-statement
						aria-hidden="true"
						style={{ animationDelay: "700ms" }}
						className="absolute right-0 -bottom-2 hidden w-64 animate-in flex-col gap-2.5 rounded-2xl bg-white p-4 text-slate-900 shadow-[0_32px_64px_-24px_rgb(0_0_0/0.55)] duration-700 fill-mode-both zoom-in-90 fade-in motion-reduce:animate-none sm:flex lg:-right-4 lg:-bottom-8 xl:w-72"
					>
						<div className="flex items-center justify-between">
							<p className="text-xs/4.5 font-semibold text-brand-blue">
								Extrato do veículo
							</p>
							<span className="rounded-md bg-brand-blue px-2 py-0.5 text-[0.6875rem] font-semibold tracking-[0.12em] text-white">
								ABC1D23
							</span>
						</div>
						<ul className="flex flex-col divide-y divide-slate-200">
							{preview.map(({ label, status, warn }, index) => (
								<li
									key={label}
									style={{ animationDelay: `${1000 + index * 180}ms` }}
									className="flex animate-in items-center gap-2 py-1.5 text-xs/4.5 duration-500 fill-mode-both fade-in slide-in-from-left-2 motion-reduce:animate-none"
								>
									{warn ? (
										<TriangleAlertIcon className="size-4 shrink-0 text-amber-700" />
									) : (
										<CircleCheckIcon className="size-4 shrink-0 text-brand-green-dark" />
									)}
									<span className="text-slate-700">{label}</span>
									<span
										className={cn(
											"ml-auto rounded-full px-2 py-0.5 text-[0.625rem] font-semibold whitespace-nowrap",
											warn
												? "bg-amber-50 text-amber-700"
												: "bg-green-50 text-brand-green-dark",
										)}
									>
										{status}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			<div className="flex justify-center pb-6">
				<Link
					to="/#por-que-checkauto"
					aria-label="Ir para Por que Checkauto"
					className="flex size-12 items-center justify-center rounded-full border border-border text-heading transition-colors hover:bg-accent"
				>
					<ChevronDownIcon
						aria-hidden="true"
						className="size-5 animate-bounce motion-reduce:animate-none"
					/>
				</Link>
			</div>
		</section>
	);
}
