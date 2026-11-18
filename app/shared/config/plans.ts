/** Itens comparados entre os pacotes, na ordem em que aparecem. */
export const planFeatures = [
	"Oferta em leilão",
	"Histórico de roubo e furto",
	"Recall",
	"Restrições",
	"Indício de sinistro",
	"Gravame",
] as const;

export type PlanFeature = (typeof planFeatures)[number];

export type Plan = {
	id: string;
	name: string;
	shortName: string;
	kicker: string;
	price: string;
	description: string;
	features: PlanFeature[];
	moreUrl: string;
	detailsUrl: string;
	recommended?: boolean;
};

export const plans: Plan[] = [
	{
		id: "checkauto-standard",
		name: "Checkauto Standard",
		shortName: "Standard",
		kicker: "Essencial",
		price: "54,90",
		description: "Informações necessárias para uma consulta segura.",
		features: [
			"Oferta em leilão",
			"Histórico de roubo e furto",
			"Recall",
			"Restrições",
		],
		moreUrl: "/produto/checkauto-standard-150136",
		detailsUrl: "/checkauto-standard-150136",
	},
	{
		id: "checkauto-master",
		name: "Checkauto Master",
		shortName: "Master",
		kicker: "Intermediário",
		price: "59,90",
		description:
			"Informações essenciais para negociar e escolher seu carro com segurança.",
		features: [
			"Oferta em leilão",
			"Histórico de roubo e furto",
			"Recall",
			"Restrições",
			"Indício de sinistro",
		],
		moreUrl: "/produto/checkauto-master-150135",
		detailsUrl: "/checkauto-master-150135",
	},
	{
		id: "checkauto-plus",
		name: "Checkauto Plus",
		shortName: "Plus",
		kicker: "Mais completo",
		price: "69,90",
		description:
			"A consulta mais completa e confiável, com informações exclusivas.",
		features: [...planFeatures],
		moreUrl: "/produto/checkauto-plus-150134",
		detailsUrl: "/checkauto-plus-150134",
		recommended: true,
	},
];

export const corporatePlan = {
	kicker: "Para empresas",
	name: "Soluções corporativas",
	description:
		"Atendimento para operações e necessidades específicas. Fale com especialistas.",
	segments: [
		"Consórcios e seguradoras",
		"Bancos e financeiras",
		"Concessionárias e locadoras",
		"Empresas de frotas",
		"Outros segmentos",
	],
	cta: { label: "Saiba mais", to: "/contato" },
};
