export type NavLink = {
	label: string;
	to: string;
};

export const mainNav: NavLink[] = [
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

export const institutionalNav: NavLink[] = [
	{ label: "Termos de compra", to: "/contrato" },
	{ label: "Política de Privacidade", to: "/politica-de-privacidade" },
	{ label: "Fale Conosco", to: "/contato" },
	{ label: "Aspectos Legais", to: "/aspectos-legais" },
	{ label: "Sobre Nós", to: "/institucional/sobre-nos" },
	{ label: "Contrato", to: "/contrato" },
	{ label: "Imprensa", to: "/imprensa" },
];

export const contact = {
	email: "receptivo@checkauto.com.br",
	phones: [
		{ label: "+55 0800 4187 077", href: "tel:+558004187077" },
		{ label: "+55 11 4418 7077", href: "tel:+551144187077" },
	],
};

export const socialLinks = [
	{ label: "Facebook", href: "https://www.facebook.com/checkauto.br/" },
	{ label: "Instagram", href: "https://www.instagram.com/checkauto.br/" },
	{ label: "YouTube", href: "https://www.youtube.com/@CHEKAUTO" },
] as const;

export const company = {
	legalName: "Checkauto Consultoria Técnica e Informações Veiculares LTDA",
	cnpj: "00.305.974/0001-83",
	address:
		"Brazilian Business Park - Condomínio Barão de Mauá, Rodovia Dom Pedro I, 0 - KM 87 - Unidade 20 - Edifício Da Vinci, Ponte Alta - Atibaia / SP - CEP 12952-821 - Brasil",
};
