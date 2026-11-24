import aboutDriver from "~/@assets/about-driver.webp";
import aboutInformation from "~/@assets/about-information.webp";
import aboutNumbers from "~/@assets/about-numbers.webp";
import aboutReference from "~/@assets/about-reference.webp";
import ring from "~/@assets/brand/symbol-ring-blue.webp";
import ticks from "~/@assets/brand/symbol-ticks.webp";
import { HistorySection } from "~/features/site/components/history-section";
import { seo } from "~/shared/lib/seo";

import type { Route } from "./+types/_site.sobre-nos";

export const meta: Route.MetaFunction = () =>
	seo({
		title: "Sobre nós | Checkauto",
		description:
			"Há mais de duas décadas, a Checkauto é referência nacional em consultas de histórico veicular. Conheça nossa história e nossos números.",
		path: "/sobre-nos",
		image: aboutDriver,
	});

const stats = [
	{ value: "13", label: "milhões de consultas realizadas" },
	{ value: "80", label: "milhões de registros processados" },
	{ value: "70", label: "mil usuários cadastrados" },
];

const headingClassName =
	"text-3xl/tight font-medium tracking-tight text-heading lg:text-5xl/tight";
const bodyClassName = "flex flex-col gap-4 text-base/7 text-muted-foreground";

function Arc({
	shape,
	className,
}: {
	shape: "ring" | "ticks";
	className: string;
}) {
	const isRing = shape === "ring";

	return (
		<span
			aria-hidden="true"
			style={{ maskImage: `url(${isRing ? ring : ticks})` }}
			className={`pointer-events-none absolute -z-10 mask-contain mask-no-repeat max-lg:hidden ${isRing ? "aspect-896/900" : "aspect-878/389"} ${className}`}
		/>
	);
}

export default function About() {
	return (
		<div className="relative isolate overflow-hidden bg-background">
			<section
				aria-labelledby="sobre-titulo"
				className="relative isolate overflow-hidden bg-navy-100"
			>
				<Arc
					shape="ring"
					className="-bottom-56 -left-40 w-136 bg-brand-blue/6"
				/>
				<div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-8 px-4 pt-8 pb-4 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:py-16">
					<div className="flex flex-col gap-4">
						<p className="text-sm font-semibold tracking-widest text-highlight uppercase">
							Sobre nós
						</p>
						<h1
							id="sobre-titulo"
							className="max-w-[16ch] text-4xl/[1.1] tracking-tight text-heading lg:text-6xl/[1.1]"
						>
							<strong className="font-semibold text-highlight">
								Transparência e confiança
							</strong>{" "}
							<span className="font-normal">
								para quem lida com carros todos os dias
							</span>
						</h1>
						<p className="max-w-[46ch] text-base/7 text-heading/80 lg:text-lg">
							Unimos tecnologia, experiência e dados confiáveis para te ajudar a
							fazer sempre o melhor negócio.
						</p>
					</div>
					<img
						src={aboutDriver}
						alt="Mulher sorrindo enquanto dirige ao pôr do sol"
						width={548}
						height={520}
						fetchPriority="high"
						className="aspect-548/520 w-full rounded-[2rem] object-cover"
					/>
				</div>
			</section>

			<HistorySection />

			<div className="mx-auto flex w-full max-w-7xl flex-col gap-18 px-4 pt-18 pb-18 sm:px-8 lg:gap-28 lg:pt-28 lg:pb-28">
				<section
					aria-labelledby="referencia-titulo"
					className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16"
				>
					<div className="flex flex-col gap-6">
						<Arc
							shape="ring"
							className="top-1/2 -right-80 w-120 -translate-y-1/2 rotate-150 bg-brand-green/12"
						/>
						<h2
							id="referencia-titulo"
							className={`${headingClassName} max-w-[16ch]`}
						>
							Referência nacional em consultas de histórico veicular
						</h2>
						<div className={bodyClassName}>
							<p>
								Há mais de duas décadas, a Checkauto é referência nacional em
								consultas de histórico veicular, oferecendo segurança e
								transparência para quem compra ou vende veículos usados.
							</p>
							<p>
								Como parte do Grupo DEKRA — multinacional alemã líder global em
								serviços automotivos, presente em mais de 50 países —, a
								Checkauto combina tecnologia e credibilidade para entregar
								relatórios completos e confiáveis.
							</p>
						</div>
					</div>
					<div className="@container relative">
						<img
							src={aboutReference}
							alt=""
							width={802}
							height={335}
							loading="lazy"
							decoding="async"
							className="w-full"
						/>
						<span
							aria-hidden="true"
							className="absolute top-[19%] left-[22.4%] flex h-[10%] w-[19.4%] items-center text-[1.75cqw] font-medium whitespace-nowrap text-slate-700"
						>
							Indício de ocorrência
						</span>
					</div>
				</section>

				<section
					aria-labelledby="numeros-titulo"
					className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16"
				>
					<Arc
						shape="ticks"
						className="-bottom-16 -left-72 w-120 rotate-180 bg-brand-blue/7"
					/>
					<img
						src={aboutNumbers}
						alt=""
						width={738}
						height={399}
						loading="lazy"
						decoding="async"
						className="order-2 w-full lg:order-1"
					/>
					<div className="order-1 flex flex-col gap-6 lg:order-2">
						<h2
							id="numeros-titulo"
							className={`${headingClassName} max-w-[12ch]`}
						>
							Nossos números falam por si
						</h2>
						<dl className="flex flex-col border-t border-border">
							{stats.map(({ value, label }) => (
								<div
									key={label}
									className="flex items-center gap-5 border-b border-border py-5"
								>
									<dt className="sr-only">{label}</dt>
									<dd className="text-6xl/none lg:text-7xl/none flex w-28 shrink-0 items-start gap-1 font-light tracking-tight text-heading tabular-nums lg:w-32">
										<span className="text-2xl/none pt-1 font-medium text-highlight">
											+
										</span>
										{value}
									</dd>
									<span
										aria-hidden="true"
										className="max-w-[16ch] text-base/6 text-heading"
									>
										{label}
									</span>
								</div>
							))}
						</dl>
					</div>
				</section>

				<section
					aria-labelledby="informacao-titulo"
					className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16"
				>
					<div className="flex flex-col gap-6">
						<Arc
							shape="ticks"
							className="-right-80 -bottom-10 w-136 bg-brand-green/14"
						/>
						<h2
							id="informacao-titulo"
							className={`${headingClassName} max-w-[16ch]`}
						>
							Informação de verdade para decisões mais seguras
						</h2>
						<div className={bodyClassName}>
							<p>
								Com apenas a placa do veículo, você acessa informações
								essenciais como pendências financeiras, histórico de sinistros,
								registros de leilão, entre outros dados cruciais para uma
								negociação segura.
							</p>
							<p>
								Investir em uma consulta Checkauto é investir em tranquilidade:
								cada real aplicado pode representar uma economia média de R$
								900, evitando surpresas desagradáveis no futuro.
							</p>
							<p>
								Fomos pioneiros ao lançar o primeiro site de consultas
								veiculares aberto ao público no Brasil e continuamos inovando
								para que você tenha sempre as informações mais completas e
								atualizadas na hora de tomar decisões importantes.
							</p>
						</div>
					</div>
					<img
						src={aboutInformation}
						alt=""
						width={1443}
						height={682}
						loading="lazy"
						decoding="async"
						className="w-full"
					/>
				</section>
			</div>
		</div>
	);
}
