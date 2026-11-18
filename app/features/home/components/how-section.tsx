import { useRef, useState } from "react";
import { Link } from "react-router";

import logo from "~/assets/brand/checkauto-logo.png";
import logoWhite from "~/assets/brand/checkauto-logo-white.png";
import {
	CarFrontIcon,
	CircleCheckIcon,
	GaugeIcon,
	GavelIcon,
	type LucideIcon,
	TriangleAlertIcon,
	WrenchIcon,
} from "~/shared/components/icons";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/shared/components/ui/accordion";
import { Button } from "~/shared/components/ui/button";
import { plans } from "~/shared/config/plans";
import { MOTION_OK, ScrollTrigger, useGSAP } from "~/shared/lib/gsap";
import { cn } from "~/shared/lib/utils";

import { SectionEyebrow } from "./section-eyebrow";

const steps = [
	{
		id: "placa",
		title: "Informe a placa do veículo",
		description:
			"Digite a placa do veículo que você deseja consultar. Pode ser o seu veículo atual ou o que você está pensando em comprar.",
	},
	{
		id: "pacote",
		title: "Escolha o pacote ideal",
		description:
			"Selecione o pacote mais adequado para sua necessidade. Realize o pagamento de forma segura e conveniente.",
	},
	{
		id: "historico",
		title: "Veja o histórico completo na hora",
		description:
			"Receba o relatório completo imediatamente após a confirmação do pagamento e tome decisões com base em informações confiáveis e transparentes.",
	},
];

type Status = "ok" | "warn";

/**
 * Espelha o extrato em PDF que o sistema gera (cabeçalho do veículo, resumo
 * com status, dados e histórico). Dados fictícios: nada de placa real no site.
 */
const vehicle = [
	["Placa", "ABC1D23"],
	["Marca/Modelo", "JEEP/COMPASS LONGITUDE"],
	["Chassi", "9BD•••••••••04821"],
	["Ano/Fabricação", "2020"],
	["Cor", "PRATA"],
	["Ano/Modelo", "2021"],
];

const summary: { title: string; icon: LucideIcon; status: Status }[] = [
	{ title: "Oferta em leilão", icon: GavelIcon, status: "warn" },
	{ title: "Indício de ocorrência", icon: CarFrontIcon, status: "ok" },
	{ title: "Informação de recall", icon: WrenchIcon, status: "ok" },
	{ title: "Histórico de KM", icon: GaugeIcon, status: "ok" },
];

const vehicleData = [
	["Combustível", "Álcool / Gasolina", "Potência", "166"],
	["Tipo de Veículo", "AUTOMÓVEL", "Cilindradas", "2000"],
	["Espécie", "PASSAGEIRO", "Município", "SÃO PAULO"],
	["Nacionalidade", "NACIONAL", "Situação do Chassi", "NORMAL"],
];

const history: { title: string; status: Status; text: string }[] = [
	{
		title: "Oferta em leilão",
		status: "warn",
		text: "1 registro encontrado: lote 214, 03/2024, pequena monta.",
	},
	{
		title: "Indício de ocorrência",
		status: "ok",
		text: "Não há registro nas bases consultadas.",
	},
	{
		title: "Informação de recall",
		status: "ok",
		text: "Não há registro nas bases consultadas.",
	},
];

function StatusIcon({
	status,
	className,
}: {
	status: Status;
	className?: string;
}) {
	return status === "ok" ? (
		<CircleCheckIcon className={cn("text-brand-green", className)} />
	) : (
		<TriangleAlertIcon className={cn("text-[#f5a524]", className)} />
	);
}

function SectionBar({ children }: { children: string }) {
	return (
		<p className="bg-brand-green-dark py-0.5 text-center text-[0.5rem] font-semibold tracking-wide text-white uppercase">
			{children}
		</p>
	);
}

function StatementPdf() {
	return (
		<div className="h-full overflow-hidden bg-slate-200 px-6 pt-3">
			{/* A página "rola" sozinha, como quem lê o PDF. */}
			<div className="flex animate-pdf-scroll flex-col gap-2 rounded-sm bg-white p-3 shadow-[0_8px_24px_-12px_rgb(0_46_85/0.35)] motion-reduce:animate-none">
				<div className="flex overflow-hidden rounded-md border border-border">
					<div className="flex w-24 shrink-0 items-center justify-center bg-brand-blue px-2">
						<img
							src={logoWhite}
							alt=""
							width={800}
							height={109}
							className="h-3 w-auto"
						/>
					</div>
					<div className="flex-1">
						<p className="bg-brand-green-dark px-2 py-0.5 text-[0.5625rem] font-semibold text-white">
							JEEP/COMPASS LONGITUDE 2.0
						</p>
						<dl className="grid grid-cols-2 gap-x-3 px-2 py-1 text-[0.4375rem] leading-relaxed">
							{vehicle.map(([label, value]) => (
								<div key={label} className="flex gap-1.5">
									<dt className="w-14 shrink-0 font-semibold text-heading">
										{label}
									</dt>
									<dd className="truncate text-slate-600">{value}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>

				<SectionBar>Resumo da consulta</SectionBar>
				<ul className="grid grid-cols-4 gap-1.5">
					{summary.map(({ title, icon: Icon, status }, index) => (
						<li
							key={title}
							style={{ animationDelay: `${200 + index * 140}ms` }}
							className="flex animate-in flex-col overflow-hidden rounded-md border border-border duration-500 fill-mode-both zoom-in-90 fade-in motion-reduce:animate-none"
						>
							<span className="flex items-center gap-1 bg-brand-blue px-1.5 py-1 text-[0.4375rem] leading-tight font-semibold text-white uppercase">
								<Icon aria-hidden="true" className="size-2.5 shrink-0" />
								{title}
							</span>
							<span className="flex justify-center py-1.5">
								<StatusIcon status={status} className="size-4" />
							</span>
						</li>
					))}
				</ul>
				<p className="mx-auto flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-[0.4375rem] text-slate-600">
					Legenda:
					<span className="flex items-center gap-0.5">
						<StatusIcon status="ok" className="size-2" /> Nada consta
					</span>
					<span className="flex items-center gap-0.5">
						<StatusIcon status="warn" className="size-2" /> Atenção
					</span>
				</p>

				<SectionBar>Dados do veículo</SectionBar>
				<div className="overflow-hidden rounded-md border border-border">
					<p className="bg-brand-blue px-2 py-0.5 text-[0.5rem] font-medium text-white">
						DADOS DO VEÍCULO
					</p>
					<table className="w-full text-[0.4375rem] leading-relaxed">
						<tbody>
							{vehicleData.map(([l1, v1, l2, v2]) => (
								<tr key={l1}>
									<td className="px-2 text-slate-600">{l1}</td>
									<td className="text-heading">{v1}</td>
									<td className="text-slate-600">{l2}</td>
									<td className="pr-2 text-heading">{v2}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<SectionBar>Histórico do veículo</SectionBar>
				{history.map(({ title, status, text }) => (
					<div
						key={title}
						className="relative overflow-hidden rounded-md border border-border"
					>
						<p className="flex items-center gap-1.5 bg-brand-blue px-2 py-0.5 text-[0.5rem] font-medium text-white uppercase">
							<StatusIcon status={status} className="size-2.5" />
							{title}
						</p>
						<p className="px-2 py-1 text-[0.4375rem] text-slate-600">{text}</p>
					</div>
				))}
			</div>
		</div>
	);
}

const screenUrl: Record<string, string> = {
	placa: "checkauto.com.br",
	pacote: "checkauto.com.br/pacotes",
	historico: "checkauto.com.br/extrato-ABC1D23.pdf",
};

function Screen({ step }: { step: string }) {
	if (step === "pacote") {
		return (
			<div className="flex flex-col gap-4">
				<p className="text-sm/5.5 font-semibold text-heading">
					Escolha o pacote para a placa ABC1D23
				</p>
				<div className="grid grid-cols-3 gap-2.5">
					{plans.map(({ id, name, price, recommended }, index) => (
						<div
							key={id}
							style={{ animationDelay: `${index * 90}ms` }}
							className={cn(
								"flex animate-in flex-col gap-2 rounded-xl border p-3 duration-500 fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none",
								recommended ? "border-highlight bg-accent" : "border-border",
							)}
						>
							<span className="text-xs leading-tight font-semibold text-heading">
								{name}
							</span>
							<span className="text-sm/5.5 font-semibold text-heading">
								R$ {price}
							</span>
							<span
								className={cn(
									"mt-auto flex h-7 items-center justify-center rounded-full text-[0.625rem] font-semibold",
									recommended
										? "bg-primary text-primary-foreground"
										: "bg-muted text-heading",
								)}
							>
								{recommended ? "Selecionado" : "Escolher"}
							</span>
						</div>
					))}
				</div>
				<span className="flex h-9 w-44 items-center justify-center self-end rounded-full bg-primary text-xs/4.5 font-semibold text-primary-foreground">
					Pagar com segurança
				</span>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-4 py-8 text-center">
			<p className="text-lg/6 font-semibold text-heading">
				Antes de comprar, confira o histórico
			</p>
			<div className="flex h-12 w-full max-w-xs items-center gap-2 rounded-full border border-border bg-card pr-1.5 pl-2">
				<span className="flex size-8 items-center justify-center rounded-full bg-navy-50 text-[0.5625rem] font-semibold text-heading">
					BR
				</span>
				<span className="text-sm/5.5 font-semibold tracking-[0.12em] text-heading">
					ABC1D23
				</span>
				<span className="ml-0.5 h-4 w-px animate-pulse bg-heading" />
				<span className="ml-auto flex h-9 items-center rounded-full bg-primary px-4 text-xs/4.5 font-semibold text-primary-foreground">
					Consultar
				</span>
			</div>
			<p className="text-xs/4.5 text-muted-foreground">
				Mais de 250.000 consultas já realizadas
			</p>
		</div>
	);
}

export function HowSection() {
	const [step, setStep] = useState(steps[0].id);
	const gridRef = useRef<HTMLDivElement>(null);

	// Desktop: a seção fica fixa e cada trecho de scroll avança um passo.
	useGSAP(
		() => {
			const media = window.matchMedia(`(min-width: 1024px) and ${MOTION_OK}`);
			if (!media.matches) return;

			ScrollTrigger.create({
				trigger: gridRef.current,
				start: "center 52%",
				end: "+=1500",
				pin: true,
				onUpdate: ({ progress }) => {
					const index = Math.min(
						steps.length - 1,
						Math.floor(progress * steps.length),
					);
					setStep(steps[index].id);
				},
			});
		},
		{ scope: gridRef },
	);

	return (
		<section
			id="como-funciona"
			aria-labelledby="como-funciona-titulo"
			className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 lg:py-24"
		>
			<div
				ref={gridRef}
				className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14"
			>
				<div className="flex flex-col gap-8">
					<div className="flex flex-col gap-3">
						<SectionEyebrow>Como funciona</SectionEyebrow>
						<h2
							id="como-funciona-titulo"
							className="text-3xl/tight font-semibold tracking-tight lg:text-4xl/tight"
						>
							Histórico veicular completo com apenas 3 passos simples
						</h2>
					</div>

					<Accordion
						type="single"
						value={step}
						onValueChange={(value) => value && setStep(value)}
						className="gap-3 overflow-visible rounded-none border-0"
					>
						{steps.map(({ id, title, description }, index) => (
							<AccordionItem
								key={id}
								value={id}
								className="rounded-2xl border border-border bg-card not-last:border-b data-open:border-highlight/40 data-open:bg-card"
							>
								<AccordionTrigger className="items-center gap-4 rounded-2xl p-5 text-lg/6 font-semibold text-heading hover:no-underline">
									<span className="flex items-center gap-4">
										<span
											aria-hidden="true"
											className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm/5.5 font-semibold text-highlight transition-colors group-aria-expanded/accordion-trigger:bg-primary group-aria-expanded/accordion-trigger:text-primary-foreground"
										>
											{index + 1}
										</span>
										{title}
									</span>
								</AccordionTrigger>
								<AccordionContent className="pl-14 text-base/relaxed text-muted-foreground">
									{description}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>

					<Button asChild size="lg" className="w-full sm:w-fit">
						<Link to="/#pacotes">Consultar agora</Link>
					</Button>
				</div>

				<div
					aria-hidden="true"
					className="relative isolate hidden flex-col items-center overflow-hidden rounded-[2rem] bg-navy-100 px-8 pt-12 pb-10 lg:flex lg:rounded-[2.5rem]"
				>
					<span className="absolute -top-24 -right-24 -z-10 size-80 rounded-full border-48 border-brand-blue/5" />
					<span className="absolute -bottom-44 -left-36 -z-10 size-72 rounded-full border-40 border-primary/10" />

					{/* Monitor: a consulta acontece no site, não num app. */}
					<div className="w-full max-w-xl rounded-2xl border-10 border-brand-blue bg-brand-blue">
						<div className="flex items-center gap-1.5 rounded-t-md bg-navy-50 px-3 py-2">
							<span className="size-2 rounded-full bg-red-300" />
							<span className="size-2 rounded-full bg-amber-300" />
							<span className="size-2 rounded-full bg-green-300" />
							<span className="ml-3 flex h-5 flex-1 items-center rounded-full bg-card px-3 text-[0.625rem] text-muted-foreground">
								{screenUrl[step]}
							</span>
						</div>
						<div className="h-108 overflow-hidden rounded-b-md bg-card">
							{step === "historico" ? (
								<div
									key={step}
									className="h-full animate-in duration-300 fade-in motion-reduce:animate-none"
								>
									<StatementPdf />
								</div>
							) : (
								<div className="flex flex-col gap-3 px-5 pt-4">
									<img
										src={logo}
										alt=""
										width={800}
										height={109}
										className="h-4 w-auto self-start"
									/>
									<div
										key={step}
										className="animate-in duration-300 fade-in slide-in-from-bottom-2 motion-reduce:animate-none"
									>
										<Screen step={step} />
									</div>
								</div>
							)}
						</div>
					</div>
					<span className="h-8 w-20 bg-linear-to-b from-navy-700 to-navy-500 [clip-path:polygon(12%_0,88%_0,100%_100%,0_100%)]" />
					<span className="h-2 w-44 rounded-full bg-navy-700" />
				</div>
			</div>
		</section>
	);
}
