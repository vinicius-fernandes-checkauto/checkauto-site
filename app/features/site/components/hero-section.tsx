import { type CSSProperties, useRef, useState } from "react";
import { Link } from "react-router";

import ring from "~/assets/brand/symbol-ring-blue.webp";
import ticks from "~/assets/brand/symbol-ticks.webp";
import avatar1 from "~/assets/home/avatars/avatar-1.webp";
import avatar2 from "~/assets/home/avatars/avatar-2.webp";
import avatar3 from "~/assets/home/avatars/avatar-3.webp";
import avatar4 from "~/assets/home/avatars/avatar-4.webp";
import heroCarFront from "~/assets/home/hero-car-front.webp";
import heroCarFront640 from "~/assets/home/hero-car-front-640.webp";
import {
	HERO_PLATE_INPUT_ID,
	PlateForm,
} from "~/features/site/components/plate-form";
import {
	BanIcon,
	FileTextIcon,
	GavelIcon,
	LockIcon,
	type LucideIcon,
	ReceiptTextIcon,
	ShieldAlertIcon,
	TriangleAlertIcon,
	WrenchIcon,
} from "~/shared/components/icons";
import { gsap, MOTION_OK, useGSAP } from "~/shared/lib/gsap";
import { cn } from "~/shared/lib/utils";

type Feature = {
	title: string;
	description: string;
	icon: LucideIcon;
	x: number;
	y: number;
};

const features: Feature[] = [
	{
		title: "Dados cadastrais e documentação",
		description:
			"Marca, modelo, ano, chassi e situação do documento conferidos com a base oficial.",
		icon: FileTextIcon,
		x: 0.27,
		y: 0.5,
	},
	{
		title: "Oferta em leilão",
		description:
			"Mostra se o veículo já foi ofertado em leilão, com comitente, lote, data e status de avaria.",
		icon: GavelIcon,
		x: 0.42,
		y: 0.42,
	},
	{
		title: "Indício de ocorrência",
		description:
			"Aponta registros de batida, enchente ou perda total informados por seguradoras.",
		icon: TriangleAlertIcon,
		x: 0.17,
		y: 0.13,
	},
	{
		title: "Débitos e multas",
		description:
			"IPVA, licenciamento e multas em aberto antes de você assumir a conta.",
		icon: ReceiptTextIcon,
		x: 0.09,
		y: 0.34,
	},
	{
		title: "Restrições e impedimentos",
		description:
			"Bloqueios judiciais, administrativos e de furto que podem travar a transferência.",
		icon: BanIcon,
		x: 0.35,
		y: 0.08,
	},
	{
		title: "Gravame",
		description:
			"Indica se o veículo ainda está alienado a um banco ou financeira.",
		icon: LockIcon,
		x: 0.44,
		y: 0.88,
	},
	{
		title: "Roubo e furto",
		description:
			"Histórico de ocorrências de roubo e furto, inclusive as já recuperadas.",
		icon: ShieldAlertIcon,
		x: 0.35,
		y: 0.93,
	},
	{
		title: "Recall",
		description:
			"Chamados de recall do fabricante e se ainda existe reparo pendente.",
		icon: WrenchIcon,
		x: 0.05,
		y: 0.72,
	},
];

const points = features.map(({ x, y }) => ({
	left: x * 200,
	top: y * 100,
	delay: 1100 + x * 2400,
}));

const stats = [
	{
		value: "+25",
		label: "anos de pioneirismo em histórico veicular",
		className: "bg-brand-blue text-white [&_strong]:text-brand-green",
	},
	{
		value: "18%",
		label: "das consultas mudam o preço",
		className: "bg-brand-green text-foreground",
	},
	{
		value: "1 em 4",
		label: "veículos consultados têm restrição",
		className: "border border-border bg-card text-heading",
	},
];

/** Entrada escalonada só com CSS: pinta certo desde o primeiro quadro. */
const enter =
	"animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both motion-reduce:animate-none";

export function HeroSection() {
	const scope = useRef<HTMLElement>(null);
	const [active, setActive] = useState<number | null>(null);
	const feature = active === null ? null : features[active];
	const point = active === null ? null : points[active];

	useGSAP(
		() => {
			const mm = gsap.matchMedia();

			mm.add(MOTION_OK, () => {
				gsap.fromTo(
					"[data-hero-scan]",
					{ left: "0%", autoAlpha: 0 },
					{
						keyframes: [
							{ autoAlpha: 1, duration: 0.15 },
							{ left: "100%", duration: 1.1, ease: "power2.inOut" },
							{ autoAlpha: 0, duration: 0.2 },
						],
						delay: 1,
					},
				);
			});
		},
		{ scope },
	);

	return (
		<section
			ref={scope}
			aria-labelledby="hero-titulo"
			className="relative isolate overflow-hidden bg-background [--mh:calc(var(--mw)/1.0946)] [--mw:min(38vw,40rem,calc((100svh-9rem)*1.0946))] lg:flex lg:min-h-[calc(100svh-4.75rem-1px)] lg:flex-col"
		>
			<span
				aria-hidden="true"
				style={{ maskImage: `url(${ring})` }}
				className="pointer-events-none absolute -top-48 -left-56 -z-10 aspect-896/900 w-136 bg-brand-blue/6 mask-contain mask-no-repeat max-lg:hidden lg:-top-72 lg:-left-72 lg:w-200"
			/>
			<span
				aria-hidden="true"
				style={{ maskImage: `url(${ring})` }}
				className="pointer-events-none absolute -right-40 -bottom-56 -z-10 hidden aspect-896/900 w-176 rotate-150 bg-brand-blue/5 mask-contain mask-no-repeat lg:block"
			/>
			<span
				aria-hidden="true"
				style={{ maskImage: `url(${ticks})` }}
				className="pointer-events-none absolute bottom-6 -left-24 -z-10 aspect-878/389 w-96 rotate-180 bg-brand-blue/7 mask-contain mask-no-repeat max-lg:hidden lg:bottom-10 lg:left-[8%] lg:w-120"
			/>

			<div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 pt-10 pb-6 sm:px-8 lg:flex-1 lg:grid-cols-2 lg:pt-8 lg:pb-18 lg:[@media(max-height:620px)]:pb-6 lg:[@media(max-height:660px)]:pt-2 lg:[@media(min-height:621px)_and_(max-height:820px)]:pb-16 lg:[@media(min-height:661px)_and_(max-height:820px)]:pt-4">
				<div className="relative z-10 flex min-w-0 flex-col gap-6 lg:gap-7 lg:[@media(max-height:660px)]:gap-2.5 lg:[@media(min-height:661px)_and_(max-height:760px)]:gap-3 lg:[@media(min-height:761px)_and_(max-height:820px)]:gap-4">
					<p
						className={cn(
							enter,
							"flex w-fit items-center gap-3 rounded-full border border-border py-1.5 pr-4 pl-1.5 text-sm/5.5 text-muted-foreground",
						)}
					>
						<span aria-hidden="true" className="flex shrink-0 -space-x-2">
							{[avatar1, avatar2, avatar3, avatar4].map((src) => (
								<img
									key={src}
									src={src}
									alt=""
									width={96}
									height={96}
									className="size-8 rounded-full object-cover ring-2 ring-background"
								/>
							))}
						</span>
						<span>
							Quem compra veículo{" "}
							<strong className="font-semibold text-heading">
								confia na Checkauto
							</strong>
						</span>
					</p>

					<h1
						id="hero-titulo"
						style={{ animationDelay: "120ms" }}
						className={cn(
							enter,
							"text-4xl/[1.12] font-normal tracking-tighter text-balance text-heading sm:text-5xl/[1.08] xl:text-6xl/[1.07] lg:[@media(max-height:660px)]:text-[2.25rem]/[1.1] lg:[@media(min-height:661px)_and_(max-height:760px)]:text-[2.5rem]/[1.1] lg:[@media(min-height:761px)_and_(max-height:820px)]:text-5xl/[1.08]",
						)}
					>
						Antes de comprar, confira o{" "}
						<span className="text-highlight">histórico completo</span> do
						veículo.
					</h1>

					<p
						style={{ animationDelay: "240ms" }}
						className={cn(
							enter,
							"max-w-[42ch] text-lg text-muted-foreground lg:[@media(max-height:660px)]:text-sm lg:[@media(min-height:661px)_and_(max-height:820px)]:text-base",
						)}
					>
						Leilão, indício de ocorrência, roubo e furto, gravame e mais de 40
						informações em um extrato só. Digite a placa e veja na hora.
					</p>

					<div
						style={{ animationDelay: "360ms" }}
						className={cn(enter, "flex flex-col")}
					>
						<PlateForm inputId={HERO_PLATE_INPUT_ID} />
						<Link
							to="/ainda-nao-tenho-placa"
							className="-mt-1 inline-flex min-h-11 w-fit items-center self-center px-5 text-sm/5.5 font-medium text-heading underline decoration-1 underline-offset-4 hover:text-highlight hover:decoration-2 sm:self-start"
						>
							Ainda não tenho a placa
						</Link>
					</div>

					<ul
						style={{ animationDelay: "480ms" }}
						className={cn(
							enter,
							"grid max-w-md auto-rows-fr grid-cols-3 gap-2.5",
						)}
					>
						{stats.map(({ value, label, className }) => (
							<li
								key={value}
								className={cn(
									"flex min-h-32 flex-col justify-between gap-3 rounded-2xl p-3.5 sm:min-h-36 sm:p-4 lg:[@media(max-height:660px)]:min-h-20 lg:[@media(min-height:661px)_and_(max-height:760px)]:min-h-24 lg:[@media(min-height:761px)_and_(max-height:820px)]:min-h-28",
									className,
								)}
							>
								<strong className="text-2xl/none sm:text-3xl/none font-medium tracking-tighter">
									{value}
								</strong>
								<span className="text-xs/4 font-medium sm:text-[0.8125rem]/4.5">
									{label}
								</span>
							</li>
						))}
					</ul>
				</div>

				<div className="flex min-w-0 flex-col gap-3 lg:static">
					<p className="flex items-center gap-2 text-sm font-medium text-heading lg:absolute lg:top-[calc(50%+var(--mh)/2+0.75rem)] lg:right-[calc(var(--mw)/2)] lg:translate-x-1/2 lg:whitespace-nowrap">
						<span
							aria-hidden="true"
							className="size-2 shrink-0 rounded-full bg-brand-green shadow-[0_0_0_4px_--alpha(var(--color-brand-green)/20%)]"
						/>
						<span className="pointer-coarse:hidden">
							Passe o mouse nos pontos e veja o que a consulta revela
						</span>
						<span className="hidden pointer-coarse:inline">
							Toque nos pontos e veja o que a consulta revela
						</span>
					</p>

					<div
						onPointerDown={(event) => {
							if (!(event.target as HTMLElement).closest("button")) {
								setActive(null);
							}
						}}
						className="relative -mr-4 ml-auto aspect-949/867 w-[88%] touch-manipulation sm:-mr-8 sm:w-[64%] lg:absolute lg:top-[calc(50%-var(--mh)/2)] lg:right-0 lg:mr-0 lg:w-(--mw)"
					>
						<span
							aria-hidden="true"
							className="absolute inset-y-[4%] right-0 left-[-12%] bg-[radial-gradient(circle,--alpha(var(--color-brand-blue)/12%)_1.2px,transparent_1.6px)] mask-radial-[60%_50%] mask-radial-from-30% mask-radial-to-75% mask-radial-at-[60%_50%] bg-size-[22px_22px]"
						/>
						<img
							src={heroCarFront}
							srcSet={`${heroCarFront640} 640w, ${heroCarFront} 949w`}
							sizes="(min-width: 1024px) 38vw, 88vw"
							alt="Frente de um veículo prata visto de cima, com pontos de informação em cada parte"
							width={949}
							height={867}
							fetchPriority="high"
							className="relative size-full animate-in drop-shadow-[0_30px_34px_--alpha(var(--color-brand-blue-dark)/30%)] duration-1200 ease-out fill-mode-both fade-in slide-in-from-right-[60%] motion-reduce:animate-none"
						/>
						<span
							aria-hidden="true"
							data-hero-scan
							className="invisible absolute inset-y-[-4%] left-0 w-0.75 rounded-full bg-brand-blue shadow-[0_0_18px_4px_--alpha(var(--color-brand-blue)/45%)] before:absolute before:inset-y-0 before:right-0.75 before:w-35 before:bg-linear-to-r before:from-transparent before:to-brand-blue/16"
						/>

						{features.map(({ title }, index) => {
							const isActive = index === active;

							return (
								<button
									key={title}
									type="button"
									aria-label={title}
									aria-pressed={isActive}
									onPointerEnter={(event) => {
										if (event.pointerType === "mouse") setActive(index);
									}}
									onPointerLeave={(event) => {
										if (event.pointerType === "mouse") setActive(null);
									}}
									onClick={() => setActive(index)}
									onFocus={() => setActive(index)}
									onBlur={() => setActive(null)}
									style={{
										left: `${points[index].left}%`,
										top: `${points[index].top}%`,
										animationDelay: `${points[index].delay}ms`,
									}}
									className="group absolute z-20 flex size-11 -translate-1/2 animate-in items-center justify-center rounded-full duration-500 fill-mode-both zoom-in-25 fade-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight motion-reduce:animate-none"
								>
									<span
										aria-hidden="true"
										className="absolute inset-1.5 animate-ping rounded-full border-2 border-brand-blue motion-reduce:animate-none"
									/>
									<span
										aria-hidden="true"
										className={cn(
											"relative size-3 rounded-full transition-all duration-300",
											isActive
												? "scale-135 bg-white shadow-[0_0_0_4px_var(--color-brand-blue),0_0_22px_6px_--alpha(var(--color-brand-blue)/45%)]"
												: "bg-brand-blue shadow-[0_0_0_3px_white,0_2px_8px_--alpha(var(--color-brand-blue-dark)/35%)]",
										)}
									/>
								</button>
							);
						})}
						<div aria-live="polite" className="contents">
							{feature && point && (
								<div
									key={feature.title}
									style={
										{
											"--px": point.left / 100,
											"--py": point.top / 100,
										} as CSSProperties
									}
									className={cn(
										"pointer-events-none absolute z-30 flex w-60 animate-in items-start gap-3 rounded-[1.25rem] border border-border bg-card px-4 py-3.5 shadow-[0_24px_48px_-20px_--alpha(var(--color-brand-blue-dark)/45%)] duration-200 ease-out zoom-in-95 fade-in motion-reduce:animate-none max-lg:left-[clamp(-2.5rem,calc(var(--px)*100%-7.5rem),calc(100%-16rem))] lg:top-[calc(var(--py)*100%)] lg:left-[calc(var(--px)*100%)] lg:w-72 lg:-translate-y-1/2",
										point.top > 55
											? "max-lg:bottom-[calc((1-var(--py))*100%+1.75rem)]"
											: "max-lg:top-[calc(var(--py)*100%+1.75rem)]",
										point.left > 46
											? "lg:-translate-x-[calc(100%+1.625rem)]"
											: "lg:translate-x-6.5",
									)}
								>
									<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-highlight">
										<feature.icon aria-hidden="true" className="size-5" />
									</span>
									<span className="flex min-w-0 flex-col gap-0.5">
										<b className="text-[0.9375rem]/5 font-semibold text-heading">
											{feature.title}
										</b>
										<span className="text-[0.8125rem]/4.5 text-muted-foreground">
											{feature.description}
										</span>
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
