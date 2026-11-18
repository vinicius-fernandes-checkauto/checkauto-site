export type FaqItem = {
	question: string;
	answer: string;
};

export const faq: FaqItem[] = [
	{
		question: "O que é o Histórico Veicular Checkauto?",
		answer:
			"O Histórico Veicular Checkauto fornece um relatório completo sobre a situação de um veículo usado ou seminovo, contemplando a verificação de informações como restrições, oferta em leilão, histórico de roubo e furto, entre outras. As informações veiculares são obtidas em diversos banco de dados públicos e privado, sendo centralizadas e distribuídas na integra, sem qualquer manipulação. Este serviço é uma ferramenta que facilita o processo de compra de automóveis, permitindo uma negociação mais satisfatória e proporcionando maior segurança e confiança.",
	},
	{
		question: "Por que é importante consultar o histórico do veículo?",
		answer:
			"Veículos usados e seminovos podem ter um passado complexo devido aos seus proprietários anteriores, que nem sempre cuidaram adequadamente do carro. Isso pode resultar em uma série de problemas, como histórico de roubo e furto, restrições financeiras, débitos e multas pendentes, entre outros. Esses fatores não apenas reduzem o valor de tabela do veículo, mas também podem criar dificuldades na transferência de propriedade para o seu nome. A consulta do histórico veicular, especialmente a completa, é uma ferramenta essencial para evitar prejuízos. Ao obter um relatório detalhado, você pode identificar problemas ocultos que poderiam resultar em custos inesperados ou complicações legais. Isso permite tomar decisões informadas e escolher o melhor veículo para suas necessidades.",
	},
	{
		question: "A Checkauto garante a procedência do veículo?",
		answer:
			"Não. O objetivo do Checkauto é ser utilizado como uma ferramenta de apoio para tomada de decisão. Nosso compromisso é apresentar em tempo real, todas as informações contidas nos bancos de dados que a Checkauto possui acesso.",
	},
	{
		question: "É possível saber o nome do proprietário apenas com a placa?",
		answer:
			"Não. A Checkauto não possui identificação de proprietários. Estes dados são sigilosos e estão protegidos por lei. Há uma resolução do Conatran que impede a divulgação dos mesmos. Disponibilizamos somente a informação da quantidade de proprietários que o veículo possui, a partir de 2012.",
	},
	{
		question: "Minha consulta retornou itens pendentes, o que devo fazer?",
		answer:
			"Em seu “Histórico de Consultas” haverá a opção de “Atualizar” caso a consulta retorne com um ou mais itens pendentes.",
	},
	{
		question:
			"Digitei e confirmei a placa do veículo errada, é possível corrigir?",
		answer:
			"Não é possível corrigir uma consulta depois de realizada. Neste caso, será necessário realizar uma nova consulta.",
	},
];
