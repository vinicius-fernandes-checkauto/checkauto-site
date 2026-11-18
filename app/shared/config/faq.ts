export type FaqItem = {
	question: string;
	answer: string;
};

export const faq: FaqItem[] = [
	{
		question: "O que é o Histórico Veicular Checkauto?",
		answer:
			"Um relatório completo sobre a situação de um veículo usado ou seminovo: restrições, oferta em leilão, histórico de roubo e furto, entre outras. As informações vêm de bancos de dados públicos e privados e são entregues na íntegra, sem manipulação.",
	},
	{
		question: "Por que é importante consultar o histórico do veículo?",
		answer:
			"Um usado pode ter passado por roubo, leilão ou sinistro, ou ainda ter restrições financeiras. Isso derruba o valor do carro e pode travar a transferência para o seu nome. A consulta mostra tudo antes da compra.",
	},
	{
		question: "A Checkauto garante a procedência do veículo?",
		answer:
			"Não. A Checkauto é uma ferramenta de apoio à decisão: mostramos em tempo real tudo o que consta nas bases de dados a que temos acesso.",
	},
	{
		question: "É possível saber o nome do proprietário pela placa?",
		answer:
			"Não. Esses dados são sigilosos e protegidos por lei. Informamos apenas a quantidade de proprietários que o veículo teve a partir de 2012.",
	},
	{
		question: "Minha consulta retornou itens pendentes. O que faço?",
		answer:
			"No seu Histórico de Consultas há a opção Atualizar para quando a consulta retorna com um ou mais itens pendentes.",
	},
	{
		question: "Digitei a placa errada. Dá para corrigir?",
		answer:
			"Não é possível corrigir uma consulta já realizada. Nesse caso, faça uma nova consulta com a placa certa.",
	},
];
