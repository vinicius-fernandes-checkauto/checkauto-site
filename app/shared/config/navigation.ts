export type NavLink = {
	label: string;
	to: string;
};

export const headerNav: NavLink[] = [
	{ label: "Por que Checkauto", to: "/#por-que-checkauto" },
	{ label: "Dados da consulta", to: "/#dados-da-consulta" },
	{ label: "Como funciona", to: "/#como-funciona" },
	{ label: "Pacotes", to: "/#pacotes" },
	{ label: "FAQ", to: "/#faq" },
	{ label: "Lojista", to: "/lojista" },
];

export const accountLink: NavLink = {
	label: "Entre ou cadastre-se",
	to: "/entrar",
};

export const cartLink: NavLink = {
	label: "Carrinho",
	to: "/carrinho",
};

export type FooterGroup = {
	title: string;
	links: NavLink[];
};

export const footerNav: FooterGroup[] = [
	{
		title: "Consultas",
		links: [
			{ label: "Pacotes", to: "/#pacotes" },
			{ label: "Como funciona", to: "/#como-funciona" },
			{ label: "Dados da consulta", to: "/#dados-da-consulta" },
			// { label: "Ainda não tenho a placa", to: "/ainda-nao-tenho-placa" },
			{ label: "Para lojistas", to: "/lojista" },
		],
	},
	{
		title: "Empresa",
		links: [
			{ label: "Sobre nós", to: "/institucional/sobre-nos" },
			{ label: "Imprensa", to: "/imprensa" },
			{ label: "Aspectos legais", to: "/aspectos-legais" },
		],
	},
	{
		title: "Ajuda",
		links: [
			{ label: "Perguntas frequentes", to: "/#faq" },
			{ label: "Fale conosco", to: "/contato" },
			{ label: "Minhas consultas", to: "/entrar" },
		],
	},
];

export const legalNav: NavLink[] = [
	{ label: "Política de privacidade", to: "/politica-de-privacidade" },
	{ label: "Termos de compra", to: "/contrato" },
	{ label: "Contrato", to: "/contrato" },
];
