import type { NavLink } from "~/shared/types";

export const headerNav: NavLink[] = [
	{ label: "Dados da consulta", to: "/#dados-da-consulta" },
	{ label: "Por que Checkauto", to: "/#por-que-checkauto" },
	{ label: "Como funciona", to: "/#como-funciona" },
	{ label: "Pacotes", to: "/#pacotes" },
	{ label: "Lojista", to: "/#hora-de-vender" },
	{ label: "FAQ", to: "/#faq" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
	{
		title: "Consultas",
		links: [
			{ label: "Pacotes", to: "/#pacotes" },
			{ label: "Como funciona", to: "/#como-funciona" },
			{ label: "Dados da consulta", to: "/#dados-da-consulta" },
			{ label: "Para lojistas", to: "/#hora-de-vender" },
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
];
