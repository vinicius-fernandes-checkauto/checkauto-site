export const planFeatures = [
	"Oferta em leilão",
	"Roubo e furto",
	"Restrições e bloqueios",
	"Débitos e multas",
	"Recall",
	"Histórico de quilometragem",
	"Indício de batida ou enchente",
	"Financiamento ativo",
] as const;

export type PlanFeature = (typeof planFeatures)[number];

export const planFeatureHints: Partial<Record<PlanFeature, string>> = {
	"Indício de batida ou enchente": "ocorrência",
	"Financiamento ativo": "gravame",
};

export const sharedExtraInfoCount = 10;

export const PLAN_STORAGE_KEY = "checkauto:plan";

export type PlanInfoItem = {
	name: string;
	description: string;
	requires?: PlanFeature;
};

export type PlanInfoGroup = {
	title: string;
	items: PlanInfoItem[];
	differentiator?: boolean;
};

export const planInfoGroups: PlanInfoGroup[] = [
	{
		title: "Documentação",
		items: [
			{
				name: "Dados cadastrais nacionais",
				description:
					"Marca, modelo, ano e chassi conforme a base nacional do veículo.",
			},
			{
				name: "Dados cadastrais estaduais",
				description:
					"Situação do veículo no DETRAN do estado onde está registrado.",
			},
			{
				name: "Quantidade de proprietários",
				description: "Quantos donos o veículo teve a partir de 2012.",
			},
			{
				name: "Decodificação do chassi",
				description:
					"Confere se o chassi bate com o modelo e o ano informados.",
			},
		],
	},
	{
		title: "Restrições e bloqueios",
		items: [
			{
				name: "Restrições federais",
				description:
					"Impedimentos na base nacional que podem travar a transferência.",
			},
			{
				name: "Restrições estaduais",
				description: "Bloqueios administrativos registrados no DETRAN.",
			},
			{
				name: "Bloqueios judiciais (RENAJUD)",
				description: "Restrições determinadas pela Justiça sobre o veículo.",
			},
		],
	},
	{
		title: "Débitos e multas",
		items: [
			{
				name: "Débitos e multas",
				description:
					"IPVA, licenciamento e multas em aberto antes de você assumir a conta.",
			},
			{
				name: "Multas de outros estados (RENAINF)",
				description: "Infrações cometidas fora do estado de registro.",
			},
		],
	},
	{
		title: "Histórico do veículo",
		items: [
			{
				name: "Roubo e furto",
				description:
					"Ocorrências de roubo e furto, inclusive as já recuperadas.",
			},
			{
				name: "Histórico de quilometragem",
				description:
					"Leituras de KM registradas, que ajudam a perceber adulteração.",
			},
			{
				name: "Consultas anteriores",
				description: "Quantas vezes o veículo já foi consultado.",
			},
		],
	},
	{
		title: "Leilão e remarketing",
		items: [
			{
				name: "Oferta em leilão (2 bases)",
				description:
					"Se o veículo já foi ofertado em leilão, com lote e condição.",
			},
			{
				name: "Remarketing",
				description:
					"Se o veículo já foi revendido por banco, financeira ou seguradora.",
			},
		],
	},
	{
		title: "Recall e preço",
		items: [
			{
				name: "Recall e pendências",
				description:
					"Chamados do fabricante e reparos que ainda estão pendentes.",
			},
			{
				name: "Preço de referência FIPE",
				description: "Valor de referência do modelo na tabela FIPE.",
			},
		],
	},
	{
		title: "O que diferencia os pacotes",
		differentiator: true,
		items: [
			{
				name: "Indício de batida ou enchente",
				description:
					"Registros de batida, enchente ou perda total informados por seguradoras.",
				requires: "Indício de batida ou enchente",
			},
			{
				name: "Financiamento ativo (gravame)",
				description:
					"Se o veículo ainda está alienado a um banco ou financeira.",
				requires: "Financiamento ativo",
			},
		],
	},
];

export function planIncludes(plan: Plan, item: PlanInfoItem) {
	return !item.requires || plan.features.includes(item.requires);
}

export type Plan = {
	id: string;
	name: string;
	shortName: string;
	kicker: string;
	price: string;
	description: string;
	longDescription: string;
	features: PlanFeature[];
	infoCount: number;
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
		longDescription:
			"As informações necessárias para uma consulta segura, com tudo o que pode travar a compra ou a transferência.",
		features: [
			"Oferta em leilão",
			"Roubo e furto",
			"Restrições e bloqueios",
			"Débitos e multas",
			"Recall",
			"Histórico de quilometragem",
		],
		infoCount: 16,
		moreUrl: "/produto/checkauto-standard-150136",
		detailsUrl: "/pacotes/checkauto-standard",
	},
	{
		id: "checkauto-master",
		name: "Checkauto Master",
		shortName: "Master",
		kicker: "Intermediário",
		price: "59,90",
		description:
			"Informações essenciais para negociar e escolher seu veículo com segurança.",
		longDescription:
			"Informações essenciais para negociar e escolher seu veículo com segurança, incluindo indício de batida ou enchente.",
		features: [
			"Oferta em leilão",
			"Roubo e furto",
			"Restrições e bloqueios",
			"Débitos e multas",
			"Recall",
			"Histórico de quilometragem",
			"Indício de batida ou enchente",
		],
		infoCount: 17,
		moreUrl: "/produto/checkauto-master-150135",
		detailsUrl: "/pacotes/checkauto-master",
	},
	{
		id: "checkauto-plus",
		name: "Checkauto Plus",
		shortName: "Plus",
		kicker: "Mais completo",
		price: "69,90",
		description:
			"A consulta mais completa e confiável, com informações exclusivas.",
		longDescription:
			"A consulta mais completa e confiável, com todas as informações que a Checkauto oferece, inclusive financiamento ativo.",
		features: [...planFeatures],
		infoCount: 18,
		moreUrl: "/produto/checkauto-plus-150134",
		detailsUrl: "/pacotes/checkauto-plus",
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
