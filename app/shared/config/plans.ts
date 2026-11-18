export type Plan = {
	id: string;
	name: string;
	price: string;
	description?: string;
	features: string[];
	moreUrl: string;
	detailsUrl: string;
	recommended?: boolean;
};

export const plans: Plan[] = [
	{
		id: "checkauto-plus",
		name: "Checkauto Plus",
		price: "69,90",
		description:
			"A consulta mais completa e confiável do mercado, com informações exclusivas",
		features: [
			"Oferta de Leilão",
			"Histórico de Roubo e Furto",
			"Recall",
			"Restrições",
			"Indício de Sinistro",
			"Gravame",
		],
		moreUrl: "/produto/checkauto-plus-150134",
		detailsUrl: "/checkauto-plus-150134",
		recommended: true,
	},
	{
		id: "checkauto-master",
		name: "Checkauto Master",
		price: "59,90",
		features: [
			"Histórico de Roubo e Furto",
			"Recall",
			"Restrições",
			"Indício de Sinistro",
		],
		moreUrl: "/produto/checkauto-master-150135",
		detailsUrl: "/checkauto-master-150135",
	},
	{
		id: "checkauto-standard",
		name: "Checkauto Standard",
		price: "54,90",
		features: [
			"Oferta de Leilão",
			"Histórico de Roubo e Furto",
			"Recall",
			"Restrições",
		],
		moreUrl: "/produto/checkauto-standard-150136",
		detailsUrl: "/checkauto-standard-150136",
	},
];
