import { Link } from "react-router";

import ticks from "~/assets/brand/symbol-ticks.webp";
import sellCarSilver from "~/assets/sell-car-silver.webp";
import sellCarTop from "~/assets/sell-car-top.webp";
import sellCarWheel from "~/assets/sell-car-wheel.webp";
import { SectionEyebrow } from "~/domains/site/components/section-eyebrow";
import {
	CircleCheckIcon,
	EyeIcon,
	FileTextIcon,
	LandmarkIcon,
	type LucideIcon,
	MegaphoneIcon,
	ScaleIcon,
	ShieldCheckIcon,
	ZapIcon,
} from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { cn } from "~/shared/lib/utils";

const benefits: { icon: LucideIcon; title: string }[] = [
	{ icon: ZapIcon, title: "Agilize a venda do seu veículo" },
	{ icon: EyeIcon, title: "Transparência gera confiança" },
	{ icon: ScaleIcon, title: "Garanta uma negociação justa" },
	{ icon: MegaphoneIcon, title: "Torne seu anúncio mais atrativo" },
];

const mileage = [
	{ year: "2021", label: "12,3 mil", height: "19%" },
	{ year: "2022", label: "25,8 mil", height: "41%" },
	{ year: "2023", label: "38,1 mil", height: "60%" },
	{ year: "2024", label: "50,9 mil", height: "80%" },
	{ year: "2025", label: "63,4 mil", height: "100%" },
];

const sources: { icon: LucideIcon; className: string }[] = [
	{ icon: LandmarkIcon, className: "bg-secondary text-secondary-foreground" },
	{ icon: ShieldCheckIcon, className: "bg-highlight text-card-foreground" },
	{ icon: FileTextIcon, className: "bg-muted text-card-foreground" },
];

function AdCard({ className }: { className?: string }) {
	return (
		<div
			data-tile
			className={cn(
				"flex flex-col gap-3 rounded-3xl bg-card p-3 pb-4 text-card-foreground",
				className,
			)}
		>
			<img
				src={sellCarWheel}
				alt="Detalhe da roda de um SUV prata"
				width={315}
				height={258}
				loading="lazy"
				decoding="async"
				className="h-40 w-full rounded-2xl object-cover object-[45%_45%] lg:h-44"
			/>
			<div className="flex flex-col gap-0.5 px-1">
				<span className="text-xs font-medium text-card-foreground/70">
					Seu anúncio · exemplo
				</span>
				<span className="font-medium">Jeep Compass Longitude 2.0</span>
				<span className="flex items-center justify-between gap-2 text-sm text-card-foreground/70">
					2021 · Flex
					<span className="inline-flex items-center gap-1.5 font-medium text-success">
						<CircleCheckIcon aria-hidden="true" className="size-4" />
						Histórico anexado
					</span>
				</span>
			</div>
		</div>
	);
}

export function SellSection() {
	return (
		<section
			id="hora-de-vender"
			aria-labelledby="hora-de-vender-titulo"
			className="relative isolate w-full overflow-hidden border-highlight bg-background text-foreground [--background:var(--color-brand-blue)] [--card-foreground:var(--color-brand-blue)] [--card:#ffffff] [--foreground:#ffffff] [--heading:#ffffff] [--highlight:var(--color-brand-green)] [--muted-foreground:rgb(255_255_255/0.82)]"
		>
			<span
				aria-hidden="true"
				style={{ maskImage: `url(${ticks})` }}
				className="pointer-events-none absolute -top-16 -left-24 -z-10 aspect-878/389 w-80 rotate-180 bg-white/8 mask-contain mask-no-repeat max-lg:hidden lg:-top-24 lg:-left-28 lg:w-120"
			/>
			<div className="grid grid-cols-1 px-(--gut) pt-18 pb-12 [--gut:1rem] sm:[--gut:max(2rem,calc((100vw_-_80rem)/2_+_2rem))] lg:grid-cols-12 lg:items-end lg:gap-x-4 lg:pt-26 lg:pr-0 lg:pb-0">
				<div className="flex flex-col gap-5.5 pb-10 lg:col-span-5 lg:row-start-1 lg:self-start lg:pb-16">
					<SectionEyebrow>Hora de vender?</SectionEyebrow>
					<h2
						id="hora-de-vender-titulo"
						className="-mt-2 max-w-[12ch] text-4xl/tight font-medium tracking-tight lg:text-6xl/[1.06]"
					>
						Valorize seu veículo com a Checkauto
					</h2>
					<p className="max-w-[44ch] text-lg text-muted-foreground">
						Ofereça o histórico completo e feche negócio mais rápido.
					</p>
					<ul className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(2,max-content)] sm:gap-x-8 lg:gap-y-4">
						{benefits.map(({ icon: Icon, title }) => (
							<li
								key={title}
								className="flex items-center gap-2.5 text-[0.9375rem]"
							>
								<Icon aria-hidden="true" className="size-4.5 text-highlight" />
								{title}
							</li>
						))}
					</ul>
					<div className="pt-1.5">
						<Button asChild>
							<Link to="/#topo">Consultar meu veículo</Link>
						</Button>
					</div>
				</div>

				<div className="-mx-(--gut) grid grid-cols-[1fr_minmax(0,16rem)_1fr] items-center gap-3 lg:hidden">
					<div className="relative h-52 overflow-hidden rounded-r-3xl bg-white">
						<img
							src={sellCarTop}
							alt=""
							width={1330}
							height={680}
							loading="lazy"
							decoding="async"
							className="absolute inset-0 size-full object-cover object-[92%_50%]"
						/>
					</div>
					<AdCard />
					<div className="relative h-52 overflow-hidden rounded-l-3xl">
						<img
							src={sellCarSilver}
							alt=""
							width={223}
							height={487}
							loading="lazy"
							decoding="async"
							className="absolute inset-0 size-full object-cover object-[20%_60%]"
						/>
					</div>
				</div>

				<div className="relative hidden lg:col-span-4 lg:col-start-6 lg:row-start-1 lg:flex lg:flex-col lg:self-center lg:pb-16 lg:pl-6 xl:pl-10">
					<div className="relative w-full max-w-80">
						<AdCard className="-rotate-2" />
						<div
							data-tile
							className="absolute -top-6 -right-10 z-10 flex items-center gap-3 rounded-2xl bg-card py-2.5 pr-4 pl-2.5 text-card-foreground shadow-[0_18px_40px_-18px_rgb(0_0_0/0.5)]"
						>
							<span
								aria-hidden="true"
								className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-highlight"
							>
								<EyeIcon className="size-4.5" />
							</span>
							<span className="flex flex-col">
								<b className="text-sm font-semibold">
									3 interessados viram o histórico
								</b>
								<span className="text-xs text-card-foreground/70">
									Hoje · exemplo
								</span>
							</span>
						</div>
					</div>
				</div>

				<div className="hidden lg:col-span-3 lg:col-start-10 lg:row-span-2 lg:row-start-1 lg:flex lg:self-stretch">
					<div
						data-tile
						className="relative min-h-70 flex-1 overflow-hidden rounded-tl-3xl"
					>
						<img
							src={sellCarSilver}
							alt="Frente de um SUV prata"
							width={223}
							height={487}
							loading="lazy"
							decoding="async"
							className="absolute inset-0 size-full object-cover object-[40%_60%]"
						/>
					</div>
				</div>

				<div className="hidden items-end gap-4 lg:col-span-9 lg:row-start-2 lg:grid lg:grid-cols-9">
					<div
						data-tile
						className="relative -ml-(--gut) hidden h-58 overflow-hidden rounded-tr-3xl bg-white xl:col-span-2 xl:block"
					>
						<img
							src={sellCarTop}
							alt="Vista de cima de um SUV prata"
							width={1330}
							height={680}
							loading="lazy"
							decoding="async"
							className="absolute inset-0 size-full object-cover object-[88%_50%]"
						/>
					</div>

					<div
						data-tile
						role="img"
						aria-label="Exemplo de histórico de quilometragem: 63.400 km em 2025, cerca de 12.700 km por ano desde 2021"
						className="col-span-5 flex h-75 flex-col gap-1.5 rounded-t-3xl bg-card px-5.5 pt-5 text-card-foreground xl:col-span-4"
					>
						<div className="flex items-center justify-between text-sm font-medium">
							Histórico de KM
							<b className="rounded-md border-[1.5px] border-card-foreground px-2 py-0.5 text-[0.6875rem] tracking-[0.12em]">
								ABC1D23
							</b>
						</div>
						<p className="text-3xl font-semibold tracking-tight tabular-nums">
							63.400 km
						</p>
						<p className="text-xs text-card-foreground/70">
							Leituras registradas por ano · exemplo
						</p>
						<div className="flex flex-1 items-end gap-3 pt-3.5">
							{mileage.map(({ year, label, height }, index) => {
								const last = index === mileage.length - 1;

								return (
									<div
										key={year}
										className={cn(
											"flex h-full flex-1 flex-col items-center justify-end gap-1.5 text-[0.6875rem] text-card-foreground/70 tabular-nums",
											last && "font-medium text-card-foreground",
										)}
									>
										<span className="text-[0.625rem]">{label}</span>
										<i
											className={cn(
												"block w-full rounded-t-xl",
												last ? "bg-highlight" : "bg-muted",
											)}
											style={{ height }}
										/>
										{year}
									</div>
								);
							})}
						</div>
					</div>

					<div className="col-span-4 flex flex-col gap-3 xl:col-span-3">
						<div
							data-tile
							className="flex items-center gap-3 rounded-2xl bg-card py-2.5 pr-3.5 pl-2.5 text-xs font-medium text-card-foreground"
						>
							<span aria-hidden="true" className="flex">
								{sources.map(({ icon: Icon, className }) => (
									<span
										key={className}
										className={cn(
											"flex size-8.5 items-center justify-center rounded-full border-2 border-card not-first:-ml-2.5",
											className,
										)}
									>
										<Icon className="size-4" />
									</span>
								))}
							</span>
							Dados de bases oficiais e privadas
						</div>
						<div
							data-tile
							className="flex h-59 flex-col items-center justify-center gap-2 rounded-t-3xl bg-highlight text-center text-card-foreground"
						>
							<strong className="text-6xl/none font-medium tracking-tight">
								+250 mil
							</strong>
							<span className="text-[0.9375rem]">consultas realizadas</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
