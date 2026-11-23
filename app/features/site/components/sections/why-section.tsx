import forriskBee from "~/assets/brand/forrisk-bee.webp";
import { SectionEyebrow } from "~/features/site/components/section-eyebrow";
import { Arc } from "~/shared/components/arc";
import { IconBadge } from "~/shared/components/icon-badge";
import {
	FileTextIcon,
	FlagIcon,
	LandmarkIcon,
	ShieldCheckIcon,
} from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

const sources = ["SENATRAN", "DETRANs", "Seguradoras", "Leiloeiros"];

const topics = ["Leilão", "Roubo e furto", "Gravame", "Recall"];

const card =
	"relative flex flex-col justify-end gap-4 rounded-3xl p-5 sm:rounded-4xl";

const cornerIcon = "absolute top-4 right-4 sm:top-5 sm:right-5";

const whiteCard = cn(card, "border border-border bg-card");

const chip = "rounded-full px-3 py-1.5 text-[0.8125rem]/4 font-medium";

export function WhySection() {
	return (
		<div className="relative isolate overflow-hidden bg-background">
			<Arc className="-top-64 -right-72 w-152 rotate-200 bg-brand-green/15 max-lg:w-96" />

			<section
				id="por-que-checkauto"
				aria-labelledby="por-que-checkauto-titulo"
				className="relative lg:flex lg:min-h-svh lg:items-center"
			>
				<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-16 sm:px-8 lg:gap-8 lg:py-12">
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

					<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:auto-rows-[minmax(12rem,auto)] lg:grid-cols-3">
						<li
							data-tile
							className={cn(
								card,
								"min-h-52 justify-between overflow-hidden bg-brand-blue text-white sm:col-span-2 sm:min-h-64 lg:col-span-1 lg:row-span-2 lg:min-h-0",
							)}
						>
							<Arc className="-right-32 -bottom-40 z-0 w-72 bg-brand-green/20" />
							<IconBadge className="relative bg-brand-green text-brand-blue">
								<FlagIcon aria-hidden="true" />
							</IconBadge>
							<div className="relative flex flex-col gap-2">
								<strong className="text-7xl/[0.9] font-medium tracking-tighter text-brand-green xl:text-[5.25rem]/[0.9]">
									2000
								</strong>
								<h3 className="text-xl/snug font-medium tracking-tight text-white">
									A primeira em histórico veicular
								</h3>
								<p className="text-sm/5 text-mist">
									Lançamos o primeiro site de consulta veicular aberto ao
									público no Brasil.
								</p>
							</div>
						</li>

						<li data-tile className={whiteCard}>
							<IconBadge
								className={cn(cornerIcon, "bg-brand-blue/6 text-heading")}
							>
								<ShieldCheckIcon aria-hidden="true" />
							</IconBadge>
							<div className="flex flex-col gap-3 pr-12">
								<h3 className="font-semibold text-heading">
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
							<IconBadge
								className={cn(cornerIcon, "bg-brand-blue text-brand-green")}
							>
								<LandmarkIcon aria-hidden="true" />
							</IconBadge>
							<div className="flex flex-col gap-1.5 pr-12">
								<h3 className="text-lg/6 font-semibold tracking-tight">
									Confiança de grandes empresas
								</h3>
								<p className="text-sm/5">Bancos, financeiras e seguradoras</p>
							</div>
						</li>

						<li
							data-tile
							className={cn(
								card,
								"bg-[color-mix(in_oklab,var(--color-brand-green)_12%,var(--card))]",
							)}
						>
							<IconBadge className={cn(cornerIcon, "bg-card text-highlight")}>
								<FileTextIcon aria-hidden="true" />
							</IconBadge>
							<div className="flex flex-col gap-3">
								<div className="flex flex-col gap-1 pr-12">
									<strong className="text-4xl/none font-medium tracking-tighter text-heading">
										+40
									</strong>
									<h3 className="text-sm/5 font-semibold text-heading">
										informações em um extrato só
									</h3>
								</div>
								<ul className="flex flex-wrap gap-1.5">
									{topics.map((topic) => (
										<li
											key={topic}
											className={cn(chip, "bg-card text-highlight")}
										>
											{topic}
										</li>
									))}
								</ul>
							</div>
						</li>

						<li
							data-tile
							className={cn(
								card,
								"bg-[color-mix(in_oklab,var(--color-brand-blue)_7%,var(--card))]",
							)}
						>
							<IconBadge className={cn(cornerIcon, "bg-card")}>
								<span
									style={{ maskImage: `url(${forriskBee})` }}
									className="aspect-65/62 w-6 bg-heading mask-contain mask-center mask-no-repeat"
								/>
							</IconBadge>
							<div className="flex flex-col gap-1 pr-12">
								<h3 className="font-semibold text-heading">Grupo ForRisk</h3>
								<p className="text-sm/5 text-muted-foreground">
									Soluções inteligentes para reduzir riscos
								</p>
							</div>
						</li>
					</ul>
				</div>
			</section>
		</div>
	);
}
