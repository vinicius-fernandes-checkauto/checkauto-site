import type { MouseEvent } from "react";

import ring from "~/assets/brand/symbol-ring-blue.webp";
import {
	Building2Icon,
	FileTextIcon,
	FlagIcon,
	LandmarkIcon,
	ShieldCheckIcon,
	ZapIcon,
} from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { cn } from "~/shared/lib/utils";

import { focusHeroPlateInput, HERO_PLATE_INPUT_ID } from "./plate-form";
import { SectionEyebrow } from "./section-eyebrow";

const sources = ["SENATRAN", "DETRANs", "Seguradoras", "Leiloeiros"];

const topics = [
	"Leilão",
	"Indício de batida",
	"Roubo e furto",
	"Financiamento",
	"Recall",
	"Débitos e multas",
];

const card = "relative flex flex-col justify-end gap-4 rounded-4xl p-5";

const cornerIcon = "absolute top-5 right-5";

const whiteCard = cn(
	card,
	"border border-border bg-card shadow-[0_12px_32px_-20px_--alpha(var(--color-brand-blue)/18%)]",
);

const iconBadge =
	"flex size-11 shrink-0 items-center justify-center rounded-full";

const chip = "rounded-full px-3 py-1.5 text-[0.8125rem]/4 font-medium";

function handleCtaClick(event: MouseEvent<HTMLAnchorElement>) {
	if (focusHeroPlateInput()) event.preventDefault();
}

export function WhyReasons() {
	return (
		<section
			id="por-que-checkauto"
			aria-labelledby="por-que-checkauto-titulo"
			className="relative lg:flex lg:min-h-[min(100svh,40rem)] lg:items-center"
		>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-16 sm:px-8 lg:gap-7 lg:py-8">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
					<div className="flex flex-col gap-3">
						<SectionEyebrow>Por que Checkauto</SectionEyebrow>
						<h2
							id="por-que-checkauto-titulo"
							className="text-3xl/tight font-normal tracking-tight text-heading lg:text-[2.75rem]/[1.1]"
						>
							<span className="block">
								A <span className="text-highlight">primeira</span> do Brasil.
							</span>
							<span className="block">E a mais completa.</span>
						</h2>
					</div>
					<div className="flex max-w-md flex-col items-start gap-4">
						<p className="text-[0.9375rem]/6 text-muted-foreground">
							Há mais de 25 anos ajudamos quem compra, vende e financia veículos
							a decidir com segurança, com informação de verdade sobre cada
							carro.
						</p>
						<Button asChild>
							<a href={`#${HERO_PLATE_INPUT_ID}`} onClick={handleCtaClick}>
								Consultar agora
							</a>
						</Button>
					</div>
				</div>

				<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
					<li
						data-tile
						className={cn(
							card,
							"min-h-72 justify-between overflow-hidden bg-brand-blue text-white sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:min-h-0",
						)}
					>
						<span
							aria-hidden="true"
							style={{ maskImage: `url(${ring})` }}
							className="pointer-events-none absolute -right-32 -bottom-40 aspect-896/900 w-72 bg-brand-green/20 mask-contain mask-no-repeat"
						/>
						<div className="relative flex items-center gap-2.5">
							<span className={cn(iconBadge, "bg-brand-green text-brand-blue")}>
								<FlagIcon aria-hidden="true" className="size-5" />
							</span>
							<span className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm/4 font-medium text-mist">
								Pioneira
							</span>
						</div>
						<div className="relative flex flex-col gap-2">
							<strong className="text-7xl/[0.9] font-medium tracking-tighter text-brand-green lg:text-[5.25rem]/[0.9]">
								2000
							</strong>
							<h3 className="text-xl/snug font-medium tracking-tight text-white">
								A primeira em histórico veicular
							</h3>
							<p className="text-sm/5 text-mist">
								Lançamos o primeiro site de consulta veicular aberto ao público
								no Brasil.
							</p>
						</div>
					</li>

					<li
						data-tile
						className={cn(
							card,
							"bg-[color-mix(in_oklab,var(--color-brand-green)_12%,var(--card))]",
						)}
					>
						<span
							className={cn(iconBadge, cornerIcon, "bg-card text-highlight")}
						>
							<ZapIcon aria-hidden="true" className="size-5" />
						</span>
						<div className="flex flex-col gap-1">
							<strong className="text-4xl/none font-medium tracking-tighter text-heading">
								Na hora
							</strong>
							<h3 className="font-semibold text-heading">resultado na tela</h3>
							<p className="text-sm/5 text-muted-foreground">
								Digite a placa e receba o histórico completo em poucos
								instantes.
							</p>
						</div>
					</li>

					<li data-tile className={whiteCard}>
						<span
							className={cn(
								iconBadge,
								cornerIcon,
								"bg-brand-blue/6 text-heading",
							)}
						>
							<ShieldCheckIcon aria-hidden="true" className="size-5" />
						</span>
						<div className="flex flex-col gap-3">
							<h3 className="pr-12 font-semibold text-heading">
								Fontes oficiais, em tempo real
							</h3>
							<ul className="flex flex-wrap gap-1.5">
								{sources.map((source) => (
									<li
										key={source}
										className={cn(chip, "bg-brand-blue/6 text-heading")}
									>
										{source}
									</li>
								))}
							</ul>
						</div>
					</li>

					<li
						data-tile
						className={cn(
							card,
							"overflow-hidden bg-brand-green text-brand-blue",
						)}
					>
						<span
							className={cn(
								iconBadge,
								cornerIcon,
								"bg-brand-blue text-brand-green",
							)}
						>
							<LandmarkIcon aria-hidden="true" className="size-5" />
						</span>
						<div className="flex flex-col gap-1.5">
							<h3 className="pr-12 text-lg/6 font-semibold tracking-tight">
								Confiança de grandes empresas
							</h3>
							<p className="text-sm/5">
								Bancos, financeiras e seguradoras usam a Checkauto para decidir.
							</p>
						</div>
					</li>

					<li
						data-tile
						className={cn(
							whiteCard,
							"sm:col-span-2 lg:flex-row lg:items-center lg:gap-6",
						)}
					>
						<div className="flex shrink-0 items-center gap-4">
							<span className={cn(iconBadge, "bg-brand-blue/6 text-heading")}>
								<FileTextIcon aria-hidden="true" className="size-5" />
							</span>
							<div className="flex flex-col gap-0.5">
								<strong className="text-4xl/none font-medium tracking-tighter text-heading">
									+40
								</strong>
								<h3 className="text-sm/5 font-semibold text-heading">
									informações em um extrato só
								</h3>
							</div>
						</div>
						<ul className="flex flex-wrap gap-1.5">
							{topics.map((topic) => (
								<li
									key={topic}
									className={cn(chip, "bg-brand-green/10 text-highlight")}
								>
									{topic}
								</li>
							))}
						</ul>
					</li>

					<li
						data-tile
						className={cn(
							card,
							"bg-[color-mix(in_oklab,var(--color-brand-blue)_7%,var(--card))]",
						)}
					>
						<span className={cn(iconBadge, cornerIcon, "bg-card text-heading")}>
							<Building2Icon aria-hidden="true" className="size-5" />
						</span>
						<div className="flex flex-col gap-2">
							<h3 className="pr-12 font-semibold text-heading">
								Grupo ForRisk
							</h3>
							<p className="text-sm/5 text-muted-foreground">
								Do mesmo grupo da Autovist: vistoria e dados no mesmo lugar.
							</p>
							<ul className="flex flex-wrap gap-1.5">
								<li className={cn(chip, "bg-brand-blue text-white")}>
									Checkauto
								</li>
								<li className={cn(chip, "bg-card text-heading")}>Autovist</li>
							</ul>
						</div>
					</li>
				</ul>
			</div>
		</section>
	);
}
