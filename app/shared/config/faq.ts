export type FaqCategoryId =
	| "consulta"
	| "informacoes"
	| "pagamento"
	| "problemas";

export type FaqItem = {
	question: string;
	answer: string;
	category: FaqCategoryId;
};

export const faqCategories: { id: FaqCategoryId; label: string }[] = [
	{ id: "consulta", label: "Sobre a consulta" },
	{ id: "informacoes", label: "Informações do relatório" },
	{ id: "pagamento", label: "Pagamento e planos" },
	{ id: "problemas", label: "Problemas com a consulta" },
];

export const HOME_FAQ_LIMIT = 6;

export const faq: FaqItem[] = [
	{
		category: "consulta",
		question: "O que é o Histórico Veicular Checkauto?",
		answer:
			"Um relatório completo sobre a situação de um veículo usado ou seminovo: restrições, oferta em leilão, histórico de roubo e furto, entre outras. As informações vêm de bancos de dados públicos e privados e são entregues na íntegra, sem manipulação.",
	},
	{
		category: "consulta",
		question: "Por que é importante consultar o histórico do veículo?",
		answer:
			"Um usado pode ter passado por roubo, leilão ou sinistro, ou ainda ter restrições financeiras. Isso derruba o valor do veículo e pode travar a transferência para o seu nome. A consulta mostra tudo antes da compra.",
	},
	{
		category: "consulta",
		question: "A Checkauto garante a procedência do veículo?",
		answer:
			"Não. A Checkauto é uma ferramenta de apoio à decisão: mostramos em tempo real tudo o que consta nas bases de dados a que temos acesso.",
	},
	{
		category: "informacoes",
		question: "É possível saber o nome do proprietário pela placa?",
		answer:
			"Não. Esses dados são sigilosos e protegidos por lei. Informamos apenas a quantidade de proprietários que o veículo teve a partir de 2012.",
	},
	{
		category: "problemas",
		question: "Minha consulta retornou itens pendentes. O que faço?",
		answer:
			"No seu Histórico de Consultas há a opção Atualizar para quando a consulta retorna com um ou mais itens pendentes.",
	},
	{
		category: "problemas",
		question: "Digitei a placa errada. Dá para corrigir?",
		answer:
			"Não é possível corrigir uma consulta já realizada. Nesse caso, faça uma nova consulta com a placa certa.",
	},
	{
		category: "consulta",
		question: "Como funciona a consulta?",
		answer:
			"São três passos: informe a placa do veículo, escolha o pacote ideal e receba o histórico completo, com todas as informações em um só extrato.",
	},
	{
		category: "consulta",
		question: "Quais informações preciso para consultar um veículo?",
		answer:
			"Basta a placa. Também é possível consultar pelo chassi ou pelo RENAVAM, informando a UF em que o veículo está registrado.",
	},
	{
		category: "consulta",
		question: "Que tipo de veículo posso consultar?",
		answer:
			"Qualquer veículo automotor registrado nos órgãos de trânsito, como carros, motos e caminhões.",
	},
	{
		category: "informacoes",
		question: "Quais informações a Checkauto fornece sobre o veículo?",
		answer:
			"Mais de 40 informações em um só extrato, como leilão, indício de batida ou enchente, roubo e furto, financiamento (gravame), recall, débitos e multas.",
	},
	{
		category: "informacoes",
		question: "De onde vêm as informações da consulta?",
		answer:
			"De bases de dados públicas e privadas, como SENATRAN, DETRANs, seguradoras e leiloeiros, consultadas em tempo real.",
	},
	{
		category: "pagamento",
		question: "A consulta Checkauto é gratuita?",
		answer:
			"Não. As consultas são feitas com créditos, comprados em pacotes. O cadastro é gratuito e não tem mensalidade nem taxa de manutenção.",
	},
	{
		category: "pagamento",
		question: "Quais são as formas de pagamento?",
		answer: "Você pode pagar com cartão de crédito ou boleto bancário.",
	},
	{
		category: "pagamento",
		question: "Sou lojista. Vocês têm planos para maiores volumes?",
		answer:
			"Sim. Para empresas com volume maior de consultas, temos condições especiais. Fale com o nosso time comercial pela página Fale conosco.",
	},
	{
		category: "pagamento",
		question: "É seguro comprar no site da Checkauto?",
		answer:
			"Sim. Todo o processo de compra é criptografado, para que nenhum terceiro consiga ler ou copiar os seus dados.",
	},
	{
		category: "problemas",
		question:
			"A consulta tinha itens adicionais, mas eles sumiram. O que aconteceu?",
		answer:
			"Os itens adicionais só podem ser consultados no momento da consulta. Depois que você sai da tela, não é possível incluí-los.",
	},
];

export const homeFaq = faq.slice(0, HOME_FAQ_LIMIT);
