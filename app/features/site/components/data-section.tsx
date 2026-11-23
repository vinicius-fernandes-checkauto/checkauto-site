import { useEffect, useId, useRef, useState } from "react";

import carDiagram960 from "~/assets/home/car-diagram-960.webp";
import carDiagram1600 from "~/assets/home/car-diagram-1600.webp";
import { SectionEyebrow } from "~/features/site/components/section-eyebrow";
import {
	BanIcon,
	FileTextIcon,
	GavelIcon,
	LandmarkIcon,
	type LucideIcon,
	ReceiptTextIcon,
	ShieldAlertIcon,
	TriangleAlertIcon,
	WrenchIcon,
	XIcon,
} from "~/shared/components/icons";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "~/shared/components/ui/dialog";
import { useMediaQuery } from "~/shared/hooks/use-media-query";
import { cn } from "~/shared/lib/utils";

type Topic = {
	id: string;
	position: string;
	reversed?: boolean;
	title: string;
	icon: LucideIcon;
	description: string;
};

const topics: Topic[] = [
	{
		id: "dados-cadastrais",
		position: "xl:top-[17%] xl:left-0",
		title: "Dados cadastrais e documentação",
		icon: FileTextIcon,
		description:
			"Aqui, você encontra informações detalhadas sobre o registro e as restrições do veículo, tanto na base de dados nacional (SENATRAN) quanto estadual (DETRAN). Isso inclui dados cadastrais, alterações e restrições que podem impactar a negociação e transferência do veículo, garantindo uma compra segura e transparente.",
	},
	{
		id: "restricoes",
		position: "xl:top-[69%] xl:left-0",
		title: "Restrições e impedimentos",
		icon: BanIcon,
		description:
			"Encontre informações restritivas da base do SENATRAN e da base do DETRAN, as quais podem afetar a negociação do veículo, como a possibilidade de transferência do veículo. Alguns exemplos de restrições: Alienação Fiduciária, Comunicação de Venda, Restrição Administrativa, RENAJUD, Restrição de Roubo e Furto em aberto, entre outras.",
	},
	{
		id: "leilao",
		position: "xl:top-[4%] xl:right-[70.5%]",
		title: "Oferta em leilão",
		icon: GavelIcon,
		description:
			"Verifique se o veículo já foi ofertado em leilão, com detalhes como comitente, lote, data de realização, ano do veículo e status de avaria. A Checkauto reproduz essa informação de fornecedores terceirizados, esclarecendo que a presença no leilão não indica necessariamente venda confirmada, devido a possíveis falhas na coleta de dados.",
	},
	{
		id: "ocorrências",
		position: "xl:top-[4%] xl:left-[60.5%]",
		reversed: true,
		title: "Indício de ocorrência",
		icon: TriangleAlertIcon,
		description:
			"Verifique a possibilidade de indícios de ocorrência no veículo, com informações provenientes de fontes públicas e privadas, como órgãos administrativos e seguradoras. Essas informações podem não ser divulgadas pelo informante e não garantem a ausência de sinistros. Recomendamos uma vistoria física para avaliação completa e conclusiva sobre alterações que possam afetar a integridade do veículo.",
	},
	{
		id: "gravame",
		position: "xl:top-[88%] xl:right-[70.5%]",
		title: "Informações de gravame",
		icon: LandmarkIcon,
		description:
			"Consulte a existência de gravames no veículo, como alienação fiduciária e reserva de domínio, que restringem a transferência sem autorização da instituição financeira. Registros no DETRAN indicam gravames ativos ou baixados, permitindo constatar a situação financeira do veículo para transferência de titularidade.",
	},
	{
		id: "roubo-e-furto",
		position: "xl:top-[88%] xl:left-[60.5%]",
		reversed: true,
		title: "Histórico de roubo e furto",
		icon: ShieldAlertIcon,
		description:
			"Verifique o histórico de roubo e furto do veículo, obtido através do SENATRAN (Secretária Nacional de Trânsito). As informações no histórico veicular incluem registros de roubo, recuperação e baixa do veículo.",
	},
	{
		id: "debitos-e-multas",
		position: "xl:top-[17%] xl:right-0",
		reversed: true,
		title: "Débitos e multas",
		icon: ReceiptTextIcon,
		description:
			"Descubra informações detalhadas sobre débitos do veículo, como IPVA, Seguro DPVAT, Licenciamento e Multas, disponíveis no DETRAN. Devido à diversidade de órgãos responsáveis, algumas multas podem não constar. Verifique todas as informações para uma compra tranquila e sem surpresas.",
	},
	{
		id: "recall",
		position: "xl:top-[69%] xl:right-0",
		reversed: true,
		title: "Informações e pendências de recall",
		icon: WrenchIcon,
		description:
			"Descubra se há convocações de recall emitidas pelas montadoras para o veículo consultado. Verifique também se há pendências de recall que podem ser obrigatórias para a transferência e essenciais para garantir a segurança dos passageiros.",
	},
];

export function DataSection() {
	const [openId, setOpenId] = useState<string | null>(null);
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	const openTopic = topics.find(({ id }) => id === openId);
	const lastOpenedId = useRef<string | null>(null);

	if (openId) lastOpenedId.current = openId;
	const baseId = useId();
	const panelId = (id: string) => `${baseId}-${id}`;

	const diagramRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const diagram = diagramRef.current;
		if (!diagram) return;

		const close = () => setOpenId(null);
		diagram.addEventListener("mouseleave", close);

		return () => diagram.removeEventListener("mouseleave", close);
	}, []);

	useEffect(() => {
		if (!openId || !isDesktop) return;

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key !== "Escape" || !openId) return;

			document.getElementById(`${baseId}-${openId}-botao`)?.focus();
			setOpenId(null);
		}

		document.addEventListener("keydown", handleKeyDown);

		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [openId, isDesktop, baseId]);

	return (
		<section
			id="dados-da-consulta"
			aria-labelledby="dados-da-consulta-titulo"
			className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 py-16 sm:px-8 lg:gap-6 lg:py-10 xl:min-h-svh xl:justify-center"
		>
			<div className="flex max-w-4xl flex-col items-center gap-3 text-center">
				<SectionEyebrow>Dados da consulta</SectionEyebrow>
				<h2
					id="dados-da-consulta-titulo"
					className="text-3xl/tight font-semibold tracking-tight lg:text-[2rem]/tight"
				>
					Transparência total para uma compra sem surpresas
				</h2>
			</div>

			<div
				ref={diagramRef}
				className="flex w-full flex-col gap-6 xl:relative xl:mx-auto xl:block xl:max-w-[min(72rem,calc((100svh-12rem)*1.786))]"
			>
				<img
					src={carDiagram1600}
					srcSet={`${carDiagram960} 960w, ${carDiagram1600} 1600w`}
					sizes="(min-width: 1280px) 1216px, 100vw"
					alt=""
					aria-hidden="true"
					width={1600}
					height={896}
					loading="lazy"
					decoding="async"
					className="w-full mix-blend-multiply"
				/>

				<ul className="grid grid-cols-1 gap-x-3 gap-y-4 min-[360px]:grid-cols-2 sm:grid-cols-4 xl:block">
					{topics.map(({ id, title, icon: Icon, position, reversed }) => {
						const isOpen = openId === id;

						return (
							<li key={id} className={cn("xl:absolute", position)}>
								<button
									id={`${panelId(id)}-botao`}
									type="button"
									aria-expanded={isOpen}
									aria-controls={isDesktop ? panelId(id) : undefined}
									aria-haspopup={isDesktop ? undefined : "dialog"}
									onMouseEnter={() => {
										if (isDesktop) setOpenId(id);
									}}
									onFocus={() => {
										if (isDesktop) setOpenId(id);
									}}
									onClick={() => setOpenId(isOpen ? null : id)}
									className={cn(
										"group flex min-h-12 w-full items-center gap-3 rounded-2xl text-left text-sm leading-snug font-medium text-muted-foreground transition-colors hover:text-heading aria-expanded:text-heading xl:w-auto xl:max-w-44",
										reversed && "xl:flex-row-reverse xl:text-right",
									)}
								>
									<span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-highlight transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground group-aria-expanded:bg-secondary group-aria-expanded:text-secondary-foreground">
										<Icon aria-hidden="true" className="size-6" />
									</span>
									{title}
								</button>
							</li>
						);
					})}
				</ul>

				{topics.map(({ id, title, icon: Icon, description }) => (
					<div
						key={id}
						id={panelId(id)}
						className={cn(
							"relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 pr-16 shadow-[0_24px_48px_-24px_rgb(0_46_85/0.35)] transition-[opacity,translate,visibility] duration-300 ease-out motion-reduce:transition-none max-xl:hidden xl:absolute xl:top-1/2 xl:left-1/2 xl:w-104 xl:-translate-x-1/2 xl:p-7 xl:pr-16",
							openId === id
								? "visible opacity-100 xl:-translate-y-1/2"
								: "invisible opacity-0 xl:-translate-y-[calc(50%-0.75rem)]",
						)}
					>
						<button
							type="button"
							onClick={() => setOpenId(null)}
							className="absolute top-4 right-4 flex size-11 items-center justify-center rounded-full border border-border text-heading transition-colors hover:bg-muted"
						>
							<XIcon aria-hidden="true" className="size-5" />
							<span className="sr-only">Fechar</span>
						</button>
						<span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-highlight">
							<Icon aria-hidden="true" className="size-6" />
						</span>
						<h3 className="text-xl font-semibold">{title}</h3>
						<p className="text-muted-foreground">{description}</p>
					</div>
				))}

				<Dialog
					open={!isDesktop && Boolean(openTopic)}
					onOpenChange={(open) => {
						if (!open) setOpenId(null);
					}}
				>
					<DialogContent
						className="gap-3 pr-16"
						onCloseAutoFocus={(event) => {
							event.preventDefault();
							document
								.getElementById(`${baseId}-${lastOpenedId.current}-botao`)
								?.focus();
						}}
					>
						{openTopic && (
							<>
								<span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-highlight">
									<openTopic.icon aria-hidden="true" className="size-6" />
								</span>
								<DialogTitle>{openTopic.title}</DialogTitle>
								<DialogDescription>{openTopic.description}</DialogDescription>
							</>
						)}
					</DialogContent>
				</Dialog>
			</div>
		</section>
	);
}
