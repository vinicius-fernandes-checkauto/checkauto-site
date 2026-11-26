import { Arc } from "~/domains/site/components/arc";
import { SectionEyebrow } from "~/domains/site/components/section-eyebrow";
import { WhyNumbers } from "~/domains/site/components/sections/why-numbers";
import { IconBadge } from "~/shared/components/icon-badge";
import {
	FileTextIcon,
	FlagIcon,
	LandmarkIcon,
	ShieldCheckIcon,
} from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

const sources = ["SENATRAN", "DETRANs", "PRODESP", "Leiloeiros"];

const topics = ["Leilão", "Roubo e furto", "Gravame", "Recall"];

const card =
	"relative flex min-h-56 flex-col justify-between gap-6 overflow-hidden rounded-3xl p-6 transition-transform duration-200 hover:scale-102 sm:rounded-4xl lg:min-h-0 lg:gap-4 lg:p-5";

const chip = "rounded-full px-3 py-1.5 text-sm/4 font-medium";

export function WhySection() {
	return (
		<div className="relative isolate overflow-hidden bg-background">
			<Arc className="-top-64 -right-72 w-152 rotate-200 bg-brand-green/15 max-lg:w-96" />

			<section
				id="por-que-checkauto"
				aria-labelledby="por-que-checkauto-titulo"
				className="relative lg:flex lg:min-h-svh lg:items-center"
			>
				<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-16 sm:px-8 lg:gap-6 lg:py-8">
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

					<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[repeat(2,minmax(10rem,auto))]">
						<li
							data-tile
							className={cn(
								card,
								"bg-brand-blue text-white sm:col-span-2 lg:col-span-1 lg:row-span-2",
							)}
						>
							<Arc className="-right-32 -bottom-40 z-0 w-72 bg-brand-green/20" />
							<IconBadge className="relative bg-brand-green text-brand-blue">
								<FlagIcon aria-hidden="true" />
							</IconBadge>
							<div className="relative flex flex-col gap-2.5">
								<strong className="flex flex-col gap-1.5 text-7xl/[0.9] font-medium tracking-tighter text-brand-green">
									<span className="text-base/none font-medium tracking-normal text-white">
										Desde
									</span>
									2000
								</strong>
								<h3 className="text-xl/snug font-semibold tracking-tight text-white">
									A primeira em histórico veicular
								</h3>
								<p className="text-[0.9375rem]/6 text-mist">
									Lançamos o primeiro site de consulta veicular aberto ao
									público no Brasil.
								</p>
							</div>
						</li>

						<li
							data-tile
							className={cn(
								card,
								"bg-[color-mix(in_oklab,var(--color-brand-green)_12%,var(--card))] sm:col-span-2",
							)}
						>
							<IconBadge className="bg-card text-highlight">
								<FileTextIcon aria-hidden="true" />
							</IconBadge>
							<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
								<div className="flex flex-col gap-1.5">
									<strong className="text-6xl/[0.9] font-medium tracking-tighter text-heading">
										+40
									</strong>
									<h3 className="text-xl/snug font-semibold tracking-tight text-heading">
										informações em um extrato só
									</h3>
								</div>
								<ul className="flex flex-wrap gap-2 lg:max-w-64 lg:justify-end">
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

						<li data-tile className={cn(card, "border border-border bg-card")}>
							<IconBadge className="bg-brand-blue/6 text-heading">
								<ShieldCheckIcon aria-hidden="true" />
							</IconBadge>
							<div className="flex flex-col gap-4">
								<h3 className="text-xl/snug font-semibold tracking-tight text-heading">
									Fontes oficiais, em tempo real
								</h3>
								<ul className="flex flex-wrap gap-2">
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
							className={cn(card, "bg-brand-green text-brand-blue")}
						>
							<IconBadge className="bg-brand-blue text-brand-green">
								<LandmarkIcon aria-hidden="true" />
							</IconBadge>
							<div className="flex flex-col gap-2">
								<h3 className="text-2xl/tight font-semibold tracking-tight">
									Confiança de grandes empresas
								</h3>
								<p className="text-[0.9375rem]/6">
									Bancos, financeiras e seguradoras usam a Checkauto para
									decidir.
								</p>
							</div>
						</li>
					</ul>

					<div className="pt-8 lg:pt-10">
						<WhyNumbers />
					</div>
				</div>
			</section>
		</div>
	);
}
