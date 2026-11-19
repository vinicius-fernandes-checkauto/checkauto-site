import { Link } from "react-router";

import {
	CheckIcon,
	LightbulbIcon,
	type LucideIcon,
	SmartphoneIcon,
	StoreIcon,
	UsersRoundIcon,
} from "~/shared/components/icons";
import { PageHeader } from "~/shared/components/layout/page-header";
import { Button } from "~/shared/components/ui/button";

import type { Route } from "./+types/_site.ainda-nao-tenho-placa";

export const meta: Route.MetaFunction = () => [
	{ title: "Ainda não tenho a placa | Checkauto" },
	{
		name: "description",
		content:
			"Não tem a placa do veículo? Veja 3 formas simples de conseguir essa informação e consultar o histórico veicular com a Checkauto.",
	},
];

const situations: {
	icon: LucideIcon;
	kicker: string;
	title: string;
	text: string;
	tip: string;
}[] = [
	{
		icon: SmartphoneIcon,
		kicker: "Comprando online",
		title: "Pesquisando em sites de carros usados",
		text: "Se você encontrou o veículo ideal em um site de vendas online, entre em contato diretamente com o vendedor. A maioria dos vendedores sérios não hesita em fornecer a placa, pois demonstra transparência e confiança na negociação. Você pode solicitar por mensagem, WhatsApp ou telefone.",
		tip: "Aproveite para perguntar sobre outros detalhes importantes, como as condições gerais do carro, histórico de manutenção e motivo da venda. Essas informações complementam a consulta do histórico veicular.",
	},
	{
		icon: StoreIcon,
		kicker: "Comprando na loja",
		title: "Comprando em loja ou concessionária",
		text: "Lojas e concessionárias são ainda mais acessíveis quando se trata de fornecer a placa do veículo. Peça diretamente ao vendedor ou anote a informação assim que encontrar aquele veículo que deu “match” com o que você procurava. Muitas vezes, a placa está visível no próprio veículo exposto.",
		tip: "Estabelecimentos sérios valorizam clientes que se preocupam com o histórico do veículo. Isso demonstra que você é um comprador consciente e responsável.",
	},
	{
		icon: UsersRoundIcon,
		kicker: "Comprando de particular",
		title: "Negociando com pessoa física",
		text: "Se está negociando com um conhecido, amigo ou pessoa física, é ainda mais simples! Basta pedir a placa diretamente. A maioria das pessoas entende a importância de verificar o histórico antes da compra e ficará satisfeita em fornecer essa informação.",
		tip: "Explique que a consulta do histórico é uma prática recomendada e que beneficia ambas as partes, garantindo uma negociação transparente e justa.",
	},
];

const nextSteps = [
	"Conseguiu a placa? Acesse nosso site e faça sua consulta.",
	"Ainda tem dúvidas? Entre em contato com nossa equipe especializada.",
	"Quer saber mais? Conheça todos os nossos serviços de histórico veicular.",
];

export default function NoPlate() {
	return (
		<div className="bg-background">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pt-2 pb-18 sm:px-8 lg:gap-16 lg:pb-24">
				<div className="flex flex-col gap-8">
					<PageHeader
						label="Ainda não tenho a placa"
						title={
							<>
								Não tem a placa do veículo?{" "}
								<span className="text-highlight">Sem problemas!</span>
							</>
						}
						description="Descubra como conseguir essa informação essencial e faça sua consulta do histórico veicular com a Checkauto."
					/>
					<div className="flex max-w-3xl flex-col gap-3 rounded-3xl bg-navy-100/70 p-6 text-[0.9375rem]/7 text-heading/85 lg:p-8">
						<p>
							A Checkauto está aqui para te ajudar em cada etapa. Sabemos que
							encontrar o carro dos seus sonhos é apenas o primeiro passo. Antes
							de fechar negócio, é fundamental conhecer o histórico completo do
							veículo para tomar uma decisão segura e informada. E para isso,
							você precisa da{" "}
							<strong className="font-semibold text-heading">
								placa do veículo
							</strong>
							.
						</p>
						<p>
							Se você chegou até aqui, provavelmente está interessado em um
							carro específico, mas ainda não tem acesso à placa. Não se
							preocupe! Preparamos um guia completo para te ajudar a conseguir
							essa informação de forma rápida e eficiente.
						</p>
					</div>
				</div>

				<section
					aria-labelledby="formas-titulo"
					className="flex flex-col gap-6"
				>
					<h2
						id="formas-titulo"
						className="text-2xl/tight font-medium tracking-tight text-heading lg:text-3xl/tight"
					>
						3 formas simples de conseguir a placa do veículo
					</h2>
					<ol className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-3">
						{situations.map(
							({ icon: Icon, kicker, title, text, tip }, index) => (
								<li
									key={title}
									className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6"
								>
									<div className="flex items-center justify-between gap-3">
										<span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-highlight">
											<Icon aria-hidden="true" className="size-5" />
										</span>
										<span className="text-sm font-medium text-muted-foreground tabular-nums">
											Situação {index + 1}
										</span>
									</div>
									<div className="flex flex-col gap-1">
										<p className="text-xs font-semibold tracking-widest text-highlight uppercase">
											{kicker}
										</p>
										<h3 className="text-lg/6 font-medium text-heading">
											{title}
										</h3>
									</div>
									<p className="text-sm/6 text-muted-foreground">{text}</p>
									<p className="mt-auto flex gap-2.5 rounded-2xl bg-muted p-4 text-sm/6 text-heading/85">
										<LightbulbIcon
											aria-hidden="true"
											className="mt-0.5 size-4 shrink-0 text-highlight"
										/>
										<span>
											<strong className="font-semibold text-heading">
												Dica extra:
											</strong>{" "}
											{tip}
										</span>
									</p>
								</li>
							),
						)}
					</ol>
				</section>

				<section
					aria-labelledby="pronto-titulo"
					className="grid grid-cols-[minmax(0,1fr)] gap-8 rounded-3xl bg-secondary p-6 text-secondary-foreground sm:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:p-12"
				>
					<div className="flex flex-col gap-4">
						<h2
							id="pronto-titulo"
							className="text-2xl/tight font-medium tracking-tight text-white lg:text-3xl/tight"
						>
							Pronto para fazer sua consulta?
						</h2>
						<p className="text-[0.9375rem]/7 text-white/80">
							Assim que conseguir a placa do veículo seguindo nossas
							orientações, você estará a apenas alguns cliques de ter acesso ao
							histórico completo. A Checkauto está aqui para garantir que sua
							compra seja segura e bem-informada.
						</p>
						<div className="flex flex-col gap-3 pt-2 sm:flex-row">
							<Button asChild>
								<Link to="/#topo">Fazer consulta agora</Link>
							</Button>
							<Button
								asChild
								variant="outline"
								className="border-white/25 bg-transparent text-white hover:border-white/40 hover:bg-white/10"
							>
								<Link to="/contato">Falar com especialista</Link>
							</Button>
						</div>
					</div>
					<ul className="flex flex-col gap-3">
						{nextSteps.map((step) => (
							<li
								key={step}
								className="flex items-start gap-3 rounded-2xl bg-white/8 p-4 text-[0.9375rem]/6 text-white/90"
							>
								<span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-green text-brand-blue">
									<CheckIcon
										aria-hidden="true"
										strokeWidth={3}
										className="size-3"
									/>
								</span>
								{step}
							</li>
						))}
					</ul>
				</section>

				<p className="text-xs/5 text-muted-foreground">
					*A consulta do histórico veicular depende da disponibilidade de dados
					públicos e privados coletados pela Checkauto.
				</p>
			</div>
		</div>
	);
}
