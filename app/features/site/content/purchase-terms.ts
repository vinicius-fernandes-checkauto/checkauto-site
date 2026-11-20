import type { LegalDocumentContent } from "~/features/site/lib/legal";

export const purchaseTerms: LegalDocumentContent = {
	title: "Contrato de fornecimento de informações veiculares Checkauto",
	updatedAt: "04/09/2024",
	intro: [
		{
			text: 'Este Contrato de Fornecimento de Informações sobre Veículos pela Internet ("Contrato") disciplina os termos e condições pelos quais a empresa CHECKAUTO prestará os serviços ao USUÁRIO, no endereço nova.checkauto.com.br, que mediante a aceitação eletrônica deste Contrato aceita expressamente todos os seus termos e condições.',
			emphasis: false,
		},
		{
			text: "Por favor leia atentamente este contrato antes de utilizar o sistema Checkauto. Ao realizar o seu cadastro e iniciar o uso da plataforma, o usuário está consentindo e aceitando todas as condições do presente contrato.",
			emphasis: true,
		},
		{
			text: "Caso não esteja de acordo com as condições aqui previstas, não utilize os serviços Checkauto.",
			emphasis: true,
		},
	],
	sections: [
		{
			id: "clausula-1",
			number: "1",
			title: "Das definições",
			blocks: [
				{
					kind: "paragraph",
					number: "1.1",
					text: "Para os fins do presente Contrato, os termos abaixo terão as seguintes definições:",
				},
				{
					kind: "list",
					items: [
						{
							marker: "a",
							text: "é um serviço online de disponibilização - por meio do site nova.checkauto.com.br - de informações sobre veículos, centralizadas no banco de dados da CHECKAUTO, conforme layout e características de consulta pré-definida pela CHECKAUTO e divulgadas no site.",
							term: "CONSULTA CHECKAUTO",
						},
						{
							marker: "b",
							text: "é a pessoa física ou jurídica que, ao aderir, mediante aceite eletrônico, os termos do presente Contrato, cadastra-se no site da CHECKAUTO, com login e senha, e adquire através da compra em reais, um dos pacotes disponíveis para ser utilizado no acesso/liberação das consultas CHECKAUTO.",
							term: "USUÁRIO",
						},
					],
				},
				{
					kind: "paragraph",
					number: "1.2",
					text: "As informações veiculares presentes na base de dados da CHECKAUTO são:",
				},
				{
					kind: "list",
					items: [
						{
							marker: "a",
							text: "Informações do registro do veículo na base de dados nacional, também conhecida como BIN. Este registro é realizado pelo fabricante no SENATRAN (Secretária Nacional de Trânsito), e corresponde as características originais e os números de identificação do veículo.",
							term: "Dados Cadastrais Nacionais",
						},
						{
							marker: "b",
							text: "Informações restritivas da base do SENATRAN (Secretária Nacional de Trânsito), as quais podem afetar a negociação do veículo, como a possibilidade de transferência do veículo. Alguns exemplos de restrições: Alienação Fiduciária, Comunicação de Venda, Restrição Administrativa, RENAJUD, Restrição Benefício Tributário, entre outras.",
							term: "Restrições Nacionais",
						},
						{
							marker: "c",
							text: "Informações do registro do veículo na base de dados do DETRAN (Departamento Estadual de Trânsito) conforme estado em que está licenciado. As alterações nos veículos como remarcação de chassi, troca de motor, troca de cor, ente outras, são atualizadas nos dados cadastrais estaduais, e elas podem der ser evidenciadas através do confronto com os dados cadastrais nacionais. Alterações nas características ou números de identificação dos veículos exigem regularização e devem ser feitos com a autorização do DETRAN.",
							term: "Dados Cadastrais Estaduais",
						},
						{
							marker: "d",
							text: "Informações restritivas da base do DETRAN (Departamento Estadual de Trânsito) de emplacamento do veículo, as quais podem afetar a negociação do veículo, como a possibilidade de transferência do veículo. Alguns exemplos de restrições: Alienação Fiduciária, Comunicação de Venda, Restrição Administrativa, Restrição Roubo/furto em Aberto, Restrição Benefício Tributário, entre outras.",
							term: "Restrições Estaduais",
						},
						{
							marker: "e",
							text: "Informações de débitos existentes para o veículo, como IPVA, Seguro DPVAT, Licenciamento e Multas, desde que disponibilizados pelo DETRAN, visto que no Brasil existem diversos órgãos autuadores, cenário que dificulta a busca pelas informações, podendo existir casos de multas não informados ao DETRAN. A responsabilidade por multas em aberto anterior à data da aquisição do veículo é do proprietário anterior e deve ser por ele informada.",
							term: "Débitos / Multas",
						},
						{
							marker: "f",
							text: "Informações de multas cometidas em unidade da federação diferente de registro do veículo, que são obtidas através do RENAINF (Registro Nacional de Infrações), sistema que registra e possibilita a notificação da autuação e da penalidade. Por exemplo: um veículo de SP comete uma infração em MG. A informação será apresentada desde que que disponibilizada pela RENAINF, visto que no Brasil existem diversos órgãos autuadores, cenário que dificulta a busca pelas informações, podendo existir casos de multas não informados a RENAINF. A responsabilidade por multas em aberto anterior à data da aquisição do veículo é do proprietário anterior e deve ser por ele informada.",
							term: "RENAINF",
						},
						{
							marker: "g",
							text: "Informações de restrições judiciais relacionadas a processos na justiça, como penhoras, heranças e processos trabalhistas, que podem impedir a transferência, a venda e até mesmo a circulação do veículo. O RENAJUD é um sistema on-line de restrição judicial de veículos criado pelo Conselho Nacional de Justiça (CNJ), que interliga o Judiciário ao Departamento Nacional de Trânsito (Denatran).",
							term: "RENAJUD",
						},
						{
							marker: "h",
							text: "Informação da existência de alguma convocação de RECALL publicada pelas Montadoras. Maiores informações podem ser obtidas pelo telefone de contato da montadora, que é informado quando houver ocorrência positiva para este item.",
							term: "Informação de RECALL",
						},
						{
							marker: "i",
							text: "Informação da existência de convocação de RECALL pendente de realização. A regularização desta pendência pode ser obrigatória no processo de transferência do veículo, bem como em alguns casos o problema identificado no veículo pode comprometer a segurança dos passageiros.",
							term: "Pendência de RECALL",
						},
						{
							marker: "j",
							text: "Informação de histórico de roubo e furto obtida através do SENATRAN, sendo que na ocorrência poderá trazer a informação do roubo, recuperação e baixa.",
							term: "Histórico de Roubo e Furto",
						},
						{
							marker: "k",
							text: "Informação da quantidade de proprietários que o veículo possui a partir de 2012. Em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD), a CHECKAUTO não divulga o nome ou quaisquer dados pessoais do proprietário do veículo consultado, visando preservar a privacidade e a proteção dos dados conforme exigido por lei.",
							term: "Quantidade Proprietário",
						},
						{
							marker: "l",
							text: "Informação da existência de algum registro de Ofertas em Leilão, podendo trazer informações do Comitente, Lote, Data de Realização, Ano do Veículo, Status de Avaria. IMPORTANTE: A informação sobre Ofertas em Leilão apenas tem como finalidade dar conhecimento ao usuário se aquele veículo consultado alguma vez foi OFERTADO em Leilão. A CHECKAUTO não garante a precisão ou a completude das informações relativas à venda de veículos em leilão, uma vez que tais informações são obtidas de fornecedores terceiros. Devido à inexistência de um registro nacional unificado de ofertas e ao tempo necessário para a coleta e processamento desses dados, a CHECKAUTO expressamente se exime de qualquer responsabilidade por eventuais imprecisões ou omissões nessas informações.",
							term: "Leilão Base 1",
						},
						{
							marker: "m",
							text: "Informação da existência de algum registro de Ofertas em Leilão. IMPORTANTE: A informação sobre Ofertas em Leilão apenas tem como finalidade dar conhecimento ao usuário se aquele veículo consultado alguma vez foi OFERTADO em Leilão. Não implica, todavia, na informação ou confirmação de que o veículo foi VENDIDO em Leilão. Esta informação é fornecida pela CHECKAUTO, utilizando-se de fontes de terceiros. Dada a ausência de um registro nacional unificado e o tempo necessário para a coleta e processamento desses dados, a CHECKAUTO não garante a infalibilidade da informação coletada e não se responsabiliza por eventuais imprecisões ou omissões.",
							term: "Leilão Base 2",
						},
						{
							marker: "n",
							text: "Informação da existência de algum registro em eventos internos e fechados onde os veículos são ofertados por maior lance. As informações de remarketing são fornecidas pela CHECKAUTO, que as obtém de fornecedores terceiros. Devido à ausência de um registro nacional unificado dessas ofertas e ao tempo necessário para a coleta e processamento desses dados, a CHECKAUTO não garante a precisão ou a completude dessas informações. A CHECKAUTO exclui expressamente qualquer responsabilidade por imprecisões, omissões ou erros nas informações de remarketing fornecidas, bem como por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos resultantes do uso dessas informações.",
							term: "Remarketing",
						},
						{
							marker: "o",
							text: "Informação do histórico de quilometragem junto as bases de dados advindos de vistorias ou outros serviços realizados nos veículos onde a coleta da informação de km do veículo é realizada. Assim, se o veículo nunca passou por uma vistoria ou outro serviço no Grupo DEKRA não teremos o histórico da mesma. A quilometragem informada é obtida exclusivamente pela leitura do número exibido no painel do veículo no momento da vistoria ou do serviço prestado. A CHECKAUTO disponibiliza essa informação tal como é visualizada no hodômetro, sem realizar qualquer verificação quanto à sua precisão ou integridade. A CHECKAUTO não se responsabiliza por quaisquer alterações ou adulterações que possam ter sido feitas no equipamento do hodômetro antes ou após a coleta da informação.",
							term: "Histórico de KM",
						},
						{
							marker: "p",
							text: "Informação dos valores, códigos e descrições dos veículos na tabela FIPE. Esta informação serve de parâmetro de compra/venda de veículos.",
							term: "Precificador FIPE",
						},
						{
							marker: "q",
							text: "Permite traduzir a numeração do chassi do veículo (VIN - Vehicle Identification Number), de acordo com a metodologia adotada pelos fabricantes. O principal benefício da decodificação é alertar para eventual suspeita de adulteração do chassi, através de sua validação e o fornecimento de dados para confrontação entre as características físicas e visuais do veículo e as informações fornecidas pelo Decodificador de Chassi.",
							term: "Decodificação",
						},
						{
							marker: "r",
							text: "Informação da quantidade de vezes em que o veículo foi consultado.",
							term: "Histórico de Consultas",
						},
						{
							marker: "s",
							text: "Informação da existência de um possível indício de sinistro originado de dados cujas fontes podem ser públicas (quando advindas de órgãos administrativos/oficiais) ou privadas (como seguradoras e lojas de bens salvados). Em alguns casos, tais informações são restritas ao informante das mesmas e não são divulgadas. Embora as bases de dados sejam regularmente atualizadas, a CHECKAUTO não garante a identificação completa de indícios de sinistro, e a ausência de registros em nossas consultas não deve ser interpretada como garantia da inexistência de sinistros anteriores. Para uma avaliação mais detalhada e conclusiva das condições do veículo, recomenda-se a realização de uma vistoria física. As informações fornecidas na consulta dependerão do pacote selecionado pelo USUÁRIO no momento da compra.",
							term: "Indício de Sinistro",
						},
						{
							marker: "t",
							text: "Informação da existência de um contrato que vincula o veículo enquanto bem utilizado como garantia, restringindo a sua transferência para terceiros sem que a respectiva instituição financeira ou vendedor tenham ciência e concordem com esta transação. Os gravames mais comuns são: a alienação fiduciária (financiamento), reserva de domínio e o arrendamento mercantil. Tal registro informativo é feito junto ao DETRAN (Departamento Nacional de Trânsito) que indicará se há: um gravame ativo, pelo qual a titularidade do veículo não é passível de transferência; gravame baixado, apontando que não há nenhuma pendência financeira em relação ao veículo, podendo ter sua titularidade transferida. Para realizar a consulta junto ao DETRAN (Departamento Nacional de Trânsito) é necessário ter a placa e o número de chassi do veículo, e, eventualmente, o CPF do proprietário poderá ser requerido. Esta informação retornará na consulta, conforme tipo pacote selecionado no momento da compra.",
							term: "Gravame",
						},
						{
							marker: "u",
							text: "Vistorias de Regularização (Cortesia) - Informação se o veículo possui registro de Inspeção Veicular, qual inspeção realizada, data, empresa credenciada e o status.",
							term: "Inspeção Veicular",
						},
						{
							marker: "v",
							text: "Informação se o número do motor, possui registro em outras numerações de chassi de veículos que já tenham sido inspecionados e vistoriados por empresas especializadas, pois todo motor possui uma numeração de fábrica que identifica sua origem com o chassi ele foi montado. Essa correspondência entre Chassi e Motor, permite verificar eventual e suposto indício de adulteração.",
							term: "Duplicidade de Motor",
						},
						{
							marker: "x",
							text: "Informação se o documento do veículo foi extraviado ou roubado. Existem milhares de documentos de porte obrigatório, (antigo DUT e atual CRLV – Certificado de Registro e Licenciamento de Veículos), extraviados e roubados. Esses documentos verdadeiros são utilizados por quadrilhas e fraudadores para legalizar um veículo irregular. O registro dos CRLV’s roubados ou extraviados, só é possível para os documentos com numeração de controle, sem o qual não se tem o registro.",
							term: "Documento Extraviado e Roubado",
						},
						{
							marker: "w",
							text: "DEKRA Garantido (Cortesia) - Informação da existência de Certificado de Garantia da empresa DEKRA, líder mundial em serviços voltados ao mercado automotivo.",
							term: "Certificado de Garantia",
						},
						{
							marker: "y",
							text: "Informação da existência do sistema de controle e de gravação do número do chassi em baixo relevo, que é realizado por empresas especializadas.",
							term: "Gravação de Peças Antifurto (Cortesia)",
						},
					],
				},
				{
					kind: "paragraph",
					text: "As informações citadas acima são referentes ao nosso pacote Consulta Completa. Para obter mais detalhes sobre quais pacotes são contemplados com o insumo desejado, verifique os Pacotes em nosso site.",
				},
			],
		},
		{
			id: "clausula-2",
			number: "2",
			title: "Objeto",
			blocks: [
				{
					kind: "paragraph",
					number: "2.1",
					text: "O objeto do presente Contrato é o fornecimento, pela CHECKAUTO, do serviço CONSULTA CHECKAUTO ao USUÁRIO, disponibilizado exclusivamente via Internet no site nova.checkauto.com.br, conforme as especificações e limitações previstas neste Contrato e divulgadas no referido site. A CHECKAUTO não garante a disponibilidade contínua e ininterrupta do serviço, estando este sujeito a eventuais limitações, interrupções ou suspensões necessárias para manutenções, atualizações, modificações de layout, entre outras ações necessárias para seu aprimoramento e boa funcionalidade.",
				},
				{
					kind: "paragraph",
					number: "2.2",
					text: "O acesso à CONSULTA CHECKAUTO poderá ser feito pelo USUÁRIO através de smartphone ou de computador com acesso à Internet, e provedor de sua preferência e escolha, sob seu único e exclusivo encargo.",
				},
			],
		},
		{
			id: "clausula-3",
			number: "3",
			title: "Da forma de cadastro do usuário e do prazo",
			blocks: [
				{
					kind: "paragraph",
					number: "3.1",
					text: "O USUÁRIO, pessoa física ou jurídica, se cadastrará no site da CHECKAUTO, fornecendo dados pessoais, como nome/razão social, endereço/sede, data de nascimento, CPF/CNPJ e endereço eletrônico (e-mail) para correspondência, obrigando-se a fornecer somente informações verdadeiras, atualizadas e completas, sob pena de responsabilizar-se, civil e criminalmente, perante a CHECKAUTO e/ou terceiros, por todos e quaisquer danos ocasionados pela utilização de informações falsas, incompletas ou alheias.",
				},
				{
					kind: "paragraph",
					number: "3.2",
					text: "É expressamente vedada a utilização de dados cadastrais de terceiros, pelo USUÁRIO, sem a devida e expressa autorização do detentor, respondendo o USUÁRIO por todo e qualquer prejuízo, sem limite de espécie ou valor, causado em decorrência de violação da presente cláusula.",
				},
				{
					kind: "paragraph",
					number: "3.3",
					text: "A efetivação do cadastro do USUÁRIO dependerá do fornecimento do número correto do CPF (Cadastro de Pessoa Física) ou do CNPJ (Cadastro Nacional de Pessoa Jurídica), sem o qual o sistema não autorizará o cadastro.",
				},
				{
					kind: "paragraph",
					number: "3.4",
					text: "A CHECKAUTO reserva-se o direito de verificar a autenticidade das informações fornecidas pelo USUÁRIO, incluindo, mas não se limitando a, nome completo, data de nascimento, CPF ou dados equivalentes para Pessoa Jurídica. Caso seja identificada qualquer discrepância entre as informações fornecidas pelo USUÁRIO e aquelas verificadas pela CHECKAUTO, a CHECKAUTO notificará o USUÁRIO através do e-mail fornecido no ato do cadastro, alertando sobre a incompatibilidade detectada. O acesso à CONSULTA CHECKAUTO permanecerá suspenso até que o USUÁRIO corrija as informações em seu cadastro e estas sejam validadas e aceitas pelo sistema da CHECKAUTO. A CHECKAUTO não se responsabiliza por quaisquer inconvenientes ou prejuízos resultantes da suspensão do acesso devido a dados cadastrais incorretos ou incompletos fornecidos pelo USUÁRIO.",
				},
				{
					kind: "paragraph",
					number: "3.5",
					text: "O Usuário autoriza expressamente a realização e manutenção de seu cadastro pela CHECKAUTO, podendo o USUÁRIO realizar ou solicitar a correção de dados incompletos, inexatos ou desatualizados, bem como a eliminação de dados desnecessários e excessivos.",
				},
				{
					kind: "paragraph",
					number: "3.6",
					text: "O USUÁRIO deverá registrar sua senha inicial e poderá alterá-la conforme necessário. Para a liberação de uma nova senha, o USUÁRIO deverá confirmar todos os seus dados cadastrais. A CHECKAUTO reserva-se o direito de solicitar informações adicionais ou documentação comprobatória para validar a autenticidade dos dados fornecidos antes de liberar a nova senha, visando garantir a segurança e integridade do acesso ao sistema.",
				},
				{
					kind: "paragraph",
					number: "3.7",
					text: "A senha é de uso exclusivo, confidencial, pessoal e intransferível do USUÁRIO, e, como tal, não deve ser compartilhada com terceiros sob nenhuma circunstância. Na eventualidade de o USUÁRIO suspeitar que sua senha foi comprometida ou acessada por terceiros, é imperativo que o USUÁRIO altere sua senha imediatamente através dos mecanismos fornecidos no site e notifique a CHECKAUTO sobre o ocorrido, utilizando os canais de comunicação disponibilizados para esse fim. A CHECKAUTO não se responsabiliza por quaisquer danos ou prejuízos resultantes do uso indevido de senhas não comunicado tempestivamente pela parte do USUÁRIO.",
				},
				{
					kind: "paragraph",
					number: "3.8",
					text: "O uso indevido de acesso é de inteira e exclusiva responsabilidade do USUÁRIO, assim como os danos e prejuízos decorrentes de sua utilização.",
				},
				{
					kind: "paragraph",
					number: "3.9",
					text: "O cadastro do USUÁRIO permanecerá ativo por prazo indeterminado. O USUÁRIO poderá solicitar o cancelamento de seu cadastro e a exclusão de seus dados pessoais, a qualquer momento, encaminhando a devida solicitação, por escrito, à CHECKAUTO. Em quaisquer casos, todos os dados serão eliminados ou anonimizados, a critério da CHECKAUTO, que manterá também em seu banco de dados todo histórico relativo aos logs de acesso e pesquisas realizadas pelo USUÁRIO.",
				},
			],
		},
		{
			id: "clausula-4",
			number: "4",
			title: "Da compra de consulta",
			blocks: [
				{
					kind: "paragraph",
					number: "4.1",
					text: "A realização da CONSULTA CHECKAUTO será efetuada mediante a aquisição e o pagamento pelo USUÁRIO, de acordo com os preços estabelecidos pela CHECKAUTO na data da consulta, para os pacotes que estiverem disponíveis no momento. A CHECKAUTO reserva-se o direito de alterar os preços e disponibilidade dos pacotes a qualquer momento, sem necessidade de aviso prévio ao USUÁRIO.",
				},
				{
					kind: "paragraph",
					number: "4.2",
					text: "A forma de pagamento para aquisição de consulta deverá ser escolhida pelo USUÁRIO conforme opções disponibilizadas no site da CHECKAUTO. O USUÁRIO somente terá o acesso liberado às consultas quando o valor requerido for liberado ou confirmado pela instituição financeira, liberando-se, assim, o valor em favor da CHECKAUTO.",
				},
				{
					kind: "paragraph",
					number: "4.3",
					text: "Os valores dos serviços oferecidos pela CHECKAUTO estão sujeitos a reajustes a qualquer momento, conforme a política interna da CHECKAUTO. O USUÁRIO reconhece e concorda que é sua responsabilidade verificar o preço atualizado do serviço antes de realizar qualquer consulta, estando ciente de que os preços podem variar sem aviso prévio.",
				},
				{
					kind: "paragraph",
					number: "4.4",
					text: "O pagamentos realizados via website são de única e exclusiva responsabilidade do USUÁRIO e do agente financeiro vinculado ao USUÁRIO, uma vez que tais transações ocorrem fora do ambiente virtual da CHECKAUTO, especificamente nos sistemas da instituição financeira responsável, que deve adotar as medidas de segurança e privacidade necessárias. Consequentemente, a CHECKAUTO não tem acesso a quaisquer informações financeiras do USUÁRIO e não será responsável por quaisquer problemas de pagamento, incluindo falhas de segurança ou vazamentos de informações financeiras.",
				},
				{
					kind: "paragraph",
					number: "4.5",
					text: "O USUÁRIO estará ratificando expressa concordância com os termos e condições do presente Contrato, bem como dos serviços e pacotes disponibilizados pela CHECKAUTO, não havendo qualquer direito a reembolso ou estorno, mesmo em caso de solicitação de cancelamento de seu cadastro, nos termos da cláusula 3.9.",
				},
				{
					kind: "paragraph",
					number: "4.6",
					text: "Caso haja o pagamento e/ou compensação da quantia adquirida sem a devida liberação por parte da CHECKAUTO, por fatores alheios a esta, o USUÁRIO deverá entrar em contato com a CHECKAUTO, de posse do comprovante de pagamento para possibilitar a liberação e acesso aos pacotes de consulta, desde que o pacote adquirido seja compatível com os valores vigentes no momento da compra.",
				},
			],
		},
		{
			id: "clausula-5",
			number: "5",
			title: "Condições gerais do serviço",
			blocks: [
				{
					kind: "paragraph",
					number: "5.1",
					text: "O site da CHECKAUTO estará geralmente disponível para o USUÁRIO 24 (vinte e quatro) horas por dia, 7 (sete) dias por semana. No entanto, a disponibilidade pode ser interrompida, sem aviso prévio, por motivos de manutenção programada ou emergencial, falhas de sistema, atualizações, ou por outras circunstâncias além do controle da CHECKAUTO, incluindo, mas não se limitando a, casos fortuitos ou força maior conforme descrito na cláusula 5.4. A CHECKAUTO não será responsável por qualquer indisponibilidade do site ou por quaisquer perdas ou danos decorrentes dessa indisponibilidade.",
				},
				{
					kind: "paragraph",
					number: "5.2",
					text: "O Usuário é responsável pela instalação e custeio dos equipamentos necessários para sua conexão à Internet (computador, linha telefônica e modem, de energia elétrica e outros).",
				},
				{
					kind: "paragraph",
					number: "5.3",
					text: "O USUÁRIO reconhece e concorda que quaisquer problemas relacionados ao fornecimento, aos equipamentos e/ou à cobrança dos serviços de energia elétrica, comunicação, telecomunicação ou conexão à Rede Mundial de Computadores são de responsabilidade exclusiva das respectivas empresas prestadoras desses serviços. O USUÁRIO compreende que a CHECKAUTO não possui qualquer controle ou responsabilidade sobre tais serviços e que quaisquer questões decorrentes desses serviços devem ser resolvidas diretamente com as empresas fornecedoras, sem envolvimento ou intermediação da CHECKAUTO.",
				},
				{
					kind: "paragraph",
					number: "5.4",
					text: "A qualidade do acesso ao sistema CHECKAUTO pode variar devido a fatores externos, incluindo, mas não se limitando a, equipamento utilizado pelo USUÁRIO, localização, velocidade da conexão com a internet e largura de banda disponível. A CHECKAUTO não será responsável por quaisquer variações ou interrupções no acesso causadas por tais fatores externos. Adicionalmente, a CHECKAUTO reserva-se o direito de, a seu exclusivo critério, realizar: (a) interrupções programadas para manutenção da plataforma, que incluem ajustes técnicos, backups e outras operações necessárias para o bom funcionamento da plataforma, sendo estas preferencialmente realizadas em períodos noturnos ou de baixo movimento; (b) intervenções emergenciais para preservar a segurança e integridade da plataforma e de seus dados, incluindo ações para prevenir, cessar ou mitigar atuações de hackers ou implementar correções de segurança; (c) suspensão temporária dos serviços contratados por determinação de autoridades competentes ou por descumprimento de cláusulas deste Contrato pelo USUÁRIO. A CHECKAUTO envidará esforços razoáveis para minimizar inconvenientes e informará os USUÁRIOS, sempre que possível, sobre tais interrupções ou suspensões.",
				},
			],
		},
		{
			id: "clausula-6",
			number: "6",
			title: "Obrigações do usuário",
			blocks: [
				{
					kind: "paragraph",
					number: "6.1",
					text: "Sem prejuízos das demais obrigações previstas neste Contrato, o USUÁRIO obriga-se, sob pena de responder civil, criminal e administrativamente pelos danos que seus atos possam vir a causar, e se compromete a indenizar a CHECKAUTO por quaisquer danos causados pelos seguintes atos:",
				},
				{
					kind: "list",
					items: [
						{
							marker: "a",
							text: "fornecer corretamente todos os dados pessoais, atualizando-os no sistema sempre que sofrerem alterações;",
						},
						{
							marker: "b",
							text: "fornecer corretamente os critérios de pesquisa da CONSULTA CHECKAUTO, tais como placa do veículo;",
						},
						{
							marker: "c",
							text: "utilizar a CONSULTA CHECKAUTO e os respectivos serviços com total boa-fé e probidade, não a utilizando, ou o site da CHECKAUTO, para fins ilegais, fraudulentos ou para transmitir ou obter material em desacordo com a legislação brasileira;",
						},
						{
							marker: "d",
							text: "não transmitir, por meio do site da CHECKAUTO, dolosa ou culposamente, arquivos contendo vírus ou que, de qualquer forma, possam prejudicar os programas e/ou os equipamentos de terceiros;",
						},
						{
							marker: "e",
							text: "guardar sigilo sua senha de acesso, realizando a respectiva troca sempre que achar necessário;",
						},
						{
							marker: "f",
							text: "não obter acesso não autorizado à CONSULTA CHECKAUTO ou a qualquer outro serviço prestado no site da empresa e/ou de suas afiliadas, violando sistemas de segurança por métodos de invasão de sistemas e programas ou por outros métodos considerados ilegais;",
						},
						{
							marker: "g",
							text: "não divulgar, por qualquer meio ou forma, todas e quaisquer informações pessoais e financeiras, se disponibilizadas pela consulta, cuja finalidade única e precípua é a concessão de subsídios para tomada de decisão sobre a viabilidade do negócio com o veículo pesquisado e seu respectivo proprietário.",
						},
					],
				},
			],
		},
		{
			id: "clausula-7",
			number: "7",
			title: "Obrigações da Checkauto",
			blocks: [
				{
					kind: "paragraph",
					number: "7.1",
					text: "A CHECKAUTO compromete-se a:",
				},
				{
					kind: "list",
					items: [
						{
							marker: "a",
							text: "envidar seus melhores esforços para assegurar e desenvolver a qualidade das informações;",
						},
						{
							marker: "b",
							text: "reproduzir fielmente as informações obtidas de banco de dados público ou privado que alimentam a CONSULTA CHECKAUTO;",
						},
						{
							marker: "c",
							text: "informar o USUÁRIO qualquer alteração nos termos e condições do presente Contrato e dos serviços aqui regulados.",
						},
					],
				},
			],
		},
		{
			id: "clausula-8",
			number: "8",
			title: "Responsabilidade limitada da Checkauto",
			blocks: [
				{
					kind: "paragraph",
					number: "8.1",
					text: "A responsabilidade da CHECKAUTO limita-se a prestar informações sobre veículos automotores registradas nas bases públicas e privadas detentoras das informações, reproduzindo-as sem qualquer manipulação. O USUÁRIO reconhece que as estimativas dos valores de mercado fornecidas pela CHECKAUTO em seu PRECIFICADOR são baseadas em fontes de dados de terceiros e não garantem refletir o valor de mercado real do bem objeto da vistoria. Tais estimativas podem apresentar variações ou divergências devido a fatores como uso de diferentes versões de um mesmo modelo de veículo no cálculo, variações regionais nos preços de mercado e o estado de conservação do bem.",
				},
				{
					kind: "paragraph",
					number: "8.2",
					text: "Nos termos da cláusula anterior, a CHECKAUTO não é responsável pela atualidade, completude, acuidade e veracidade das informações obtidas na base de dados públicas e privadas que alimentam seu banco de dados, responsabilizando-se apenas em divulgá-las na forma como obtidas. A CHECKAUTO, igualmente, não poderá ser responsabilizada no caso de divulgação de informações que se apresentem divergentes ou incorretas, por não deter a origem das mesmas.",
				},
				{
					kind: "paragraph",
					number: "8.3",
					text: "Links para sites de terceiros podem estar presentes na página da CHECKAUTO, contudo, isso não implica que tais sites sejam de propriedade da CHECKAUTO ou por ela operados. Consequentemente, a CHECKAUTO não assume responsabilidade pelos conteúdos, práticas ou serviços oferecidos ou divulgados nesses sites externos. A presença de tais links não estabelece qualquer forma de relação de sociedade, associação, consórcio, vinculação, supervisão, cumplicidade ou solidariedade com esses sites ou seus titulares. O acesso a esses sites é realizado exclusivamente por conta e risco do USUÁRIO, que é encorajado a revisar cuidadosamente os termos e condições de uso, políticas de privacidade e o tratamento de dados pessoais desses sites antes de utilizá-los. A CHECKAUTO declara expressamente que não será responsável por quaisquer danos ou prejuízos decorrentes do acesso ou uso de sites de terceiros, nem pela precisão, conteúdo ou disponibilidade das informações encontradas nesses sites vinculados à sua plataforma.",
				},
				{
					kind: "paragraph",
					number: "8.4",
					text: "A CHECKAUTO, igualmente, não será responsabilizada por custos, prejuízos e/ou danos causados ao USUÁRIO ou a terceiros por:",
				},
				{
					kind: "list",
					items: [
						{
							marker: "a",
							text: 'conteúdo, propaganda, produtos, serviços contidos ou oferecidos em sites visitados por meio do acesso provido pela CHECKAUTO, mesmo quando houver no seu próprio portal "links" ou publicidade relativa a tais sites;',
						},
						{
							marker: "b",
							text: "negociações de qualquer natureza envolvendo o USUÁRIO e/ou titulares de sites apontados, incluindo participação em promoções e sorteios, contratação de serviços ou fornecimento de mercadorias;",
						},
						{
							marker: "c",
							text: "falhas no sistema de acesso, estabelecendo-se que o acesso será fornecido tal como estiver disponível;",
						},
						{
							marker: "d",
							text: "dano, prejuízo ou perda do equipamento do USUÁRIO causado por falha no sistema, no servidor ou na internet, ataque de vírus em decorrência do acesso ou navegação do site CHECKAUTO, ou em decorrência da transferência de dados, arquivos, imagens, textos ou áudio para o computador do USUÁRIO;",
						},
						{
							marker: "e",
							text: "mau funcionamento dos serviços, linhas e/ou cabos de conexão do USUÁRIO junto a terceiros;",
						},
						{
							marker: "f",
							text: 'mau funcionamento de "software" de terceiros;',
						},
						{
							marker: "g",
							text: "má utilização da CONSULTA CHECKAUTO, bem como fornecimento incorreto dos dados para consulta, hipótese em que não haverá reembolso ou estorno do crédito pago.",
						},
					],
				},
			],
		},
		{
			id: "clausula-9",
			number: "9",
			title: "Propriedade intelectual e links",
			blocks: [
				{
					kind: "paragraph",
					number: "9.1",
					text: "Os conteúdos das telas relativas aos serviços da CHECKAUTO, assim como os programas, bancos de dados, redes, arquivos que permitem ao USUÁRIO acessar a CONSULTA CHECKAUTO, estão protegidos pelas leis e tratados, nacionais e internacionais, de propriedade intelectual. O uso indevido e a reprodução total ou parcial dos referidos conteúdos são proibidos, salvo com autorização expressa e por escrito da CHECKAUTO.",
				},
				{
					kind: "paragraph",
					number: "9.2",
					text: "Este Contrato não confere ao USUÁRIO qualquer direito, título ou participação na aplicação, incluindo-se – mas não se limitando a –códigos fontes, scripts, sistemas, códigos matemáticos, recursos interativos, interface, diagramação, layout, imagens, logos, textos, marcas ou outros aspectos relacionados à CHECKAUTO e a seus produtos (“Direitos de Propriedade Intelectual”).",
				},
				{
					kind: "paragraph",
					number: "9.3",
					text: "Em hipótese alguma será permitido ao USUÁRIO ou a quaisquer terceiros a ela relacionados: (a) copiar, ceder, sublicenciar, vender, dar em locação ou em garantia, reproduzir, doar, alienar de qualquer forma, transferir total ou parcialmente, sob quaisquer modalidades, gratuita ou onerosamente, provisória ou permanentemente, a plataforma CHECKAUTO, bem como quaisquer de seus módulos, partes, manuais ou quaisquer informações relativas ao Software; ou (B) praticar engenharia reversa, descompilação ou desmontagem da plataforma.",
				},
			],
		},
		{
			id: "clausula-10",
			number: "10",
			title: "Uso de informações de cadastro e autenticação do usuário",
			blocks: [
				{
					kind: "paragraph",
					number: "10.1",
					text: "A CHECKAUTO poderá enviar e-mails de caráter técnico-informativo, que tratem dos serviços e das condições ora contratados, não estando sujeitos à recusa do USUÁRIO.",
				},
				{
					kind: "paragraph",
					number: "10.2",
					text: 'O USUÁRIO declara ter ciência que CHECKAUTO poderá utilizar "cookies" no site para sua autenticação. O objetivo dos cookies é facilitar a navegação no site da CHECKAUTO e não identificam pessoalmente o USUÁRIO, embora identifiquem seus computadores.',
				},
				{
					kind: "paragraph",
					number: "10.3",
					text: "A CHECKAUTO poderá usar dados pessoais do USUÁRIO para fins publicitários e compartilhar tais dados com parceiros comerciais para tal finalidade apenas se houver manifestação expressa do USUÁRIO. Tal consentimento se dará por meio da ativação do item “ACEITO RECEBER OS INFORMATIVOS DA CHECKAUTO E SEUS PARCEIROS EM MEU E-MAIL” no ato do cadastramento do usuário na plataforma.",
				},
				{
					kind: "paragraph",
					number: "10.4",
					text: "Caso o USUÁRIO opte pelo recebimento de tais informações, o USUÁRIO estará expressamente consentindo com o compartilhamento de seus dados pessoais com as demais empresas do grupo CHECKAUTO e seus parceiros comerciais, que poderão realizar campanhas publicitárias e oferecer seus produtos diretamente ao USUÁRIO. Referido consentimento poderá ser revogado a qualquer momento pelo USUÁRIO mediante por quaisquer meios de comunicação disponíveis indicados no link https://nova.checkauto.com.br/Institucional/PoliticaDePrivacidade através do e-mail dpo.br@dekra.com, ou mediante alteração de tais configurações no perfil do usuário disponível na plataforma CHECKAUTO.",
				},
				{
					kind: "paragraph",
					number: "10.5",
					text: "A CHECKAUTO esclarece que não garante a satisfação do USUÁRIO com produtos ou serviços adquiridos de terceiros, uma vez que tais entidades são independentes e operam sem interferência da CHECKAUTO. Ademais, a CHECKAUTO não se responsabiliza por quaisquer mercadorias ou serviços fornecidos por esses terceiros, nem pela segurança das informações, incluindo dados financeiros e pessoais, que possam ser compartilhados com esses parceiros ou por eles solicitados, salvo quando expressamente autorizado pelo USUÁRIO.",
				},
			],
		},
		{
			id: "clausula-11",
			number: "11",
			title: "Alterações nos termos e condições do contrato",
			blocks: [
				{
					kind: "paragraph",
					number: "11.1",
					text: "A CHECKAUTO se reserva o direito de alterar unilateralmente quaisquer condições do presente Contrato, ressalvado o direito do USUÁRIO denunciá-lo unilateralmente, manifestando-se, por escrito, com antecedência mínima de 30 (trinta) dias a contar da data da alteração e/ou informação da alteração. O silêncio do USUÁRIO no prazo ora estipulado será entendido como aceitação aos novos termos e condições contratuais vigentes, nos termos do artigo 111 do Código Civil.",
				},
				{
					kind: "paragraph",
					number: "11.2",
					text: "O CONTRATANTE, ao aceitar os termos deste Contrato, concorda expressamente com o recebimento de pesquisas de satisfação enviadas pela CHECKAUTO, as quais têm como objetivo aprimorar continuamente a qualidade dos serviços oferecidos. O CONTRATANTE reconhece que tais pesquisas são parte integrante do processo de melhoria da CHECKAUTO e que sua participação é fundamental para o desenvolvimento e aperfeiçoamento dos serviços prestados.",
				},
			],
		},
		{
			id: "clausula-12",
			number: "12",
			title: "Do prazo e da rescisão",
			blocks: [
				{
					kind: "paragraph",
					number: "12.1",
					text: "O presente Contrato entrará em vigor a partir da aceitação eletrônica dada pelo USUÁRIO, permanecendo vigente por prazo indeterminado até que quaisquer das partes motive a rescisão contratual nas formas definidas neste Contrato.",
				},
				{
					kind: "paragraph",
					number: "12.2",
					text: "Sem prejuízo do disposto na cláusula anterior, a CHECKAUTO poderá bloquear o acesso do USUÁRIO, eliminando o seu login e senha, rescindindo o presente Contrato, a qualquer tempo, independentemente de notificação ou comunicação, na hipótese de descumprimento das cláusulas 3 (três) e 4 (quatro) e de seus respectivos subitens, pelo USUÁRIO, sem que o mesmo tenha qualquer direito a indenização.",
				},
			],
		},
		{
			id: "clausula-13",
			number: "13",
			title: "Disposições gerais",
			blocks: [
				{
					kind: "paragraph",
					number: "13.1",
					text: "A CHECKAUTO poderá oferecer serviços adicionais aos ora previstos, mediante o cancelamento e a substituição deste Contrato por um novo Contrato. Neste caso, o USUÁRIO deverá manifestar expressamente sua aceitação ao novo Contrato, por meio de aceite eletrônico, caso deseje utilizar os serviços adicionais oferecidos.",
				},
				{
					kind: "paragraph",
					number: "13.2",
					text: "A CHECKAUTO não será responsável por quaisquer falhas ou atrasos na execução dos serviços que sejam decorrentes de caso fortuito, força maior ou quaisquer outras circunstâncias fora de seu controle razoável, incluindo, mas não se limitando a, falhas de terceiros, interrupções ou falhas de serviços de internet e problemas técnicos dos sistemas de informação.",
				},
				{
					kind: "paragraph",
					number: "13.3",
					text: "O presente Contrato não poderá ser cedido, nem transferido, total ou parcialmente, sem anuência expressa da CHECKAUTO.",
				},
				{
					kind: "paragraph",
					number: "13.4",
					text: "O presente Contrato revoga e substitui todos e quaisquer contratos/acordos anteriormente celebrados, orais ou escritos, em relação ao seu objeto.",
				},
			],
		},
		{
			id: "clausula-14",
			number: "14",
			title: "Do foro",
			blocks: [
				{
					kind: "paragraph",
					number: "14.1",
					text: "O Contrato é regido pelas leis vigentes nacionais e as partes elegem, para dirimir quaisquer controvérsias dele decorrentes, a Comarca da cidade de Atibaia – SP, com renúncia de qualquer outro foro, por mais privilegiado que seja.",
				},
				{
					kind: "paragraph",
					number: "14.2",
					text: "O USUÁRIO declara, expressamente, que teve prévia ciência e conhecimento do inteiro teor deste Contrato, lendo e entendendo perfeitamente suas cláusulas e condições, concordando com tudo e exarando o seu interesse na contratação através do aceite eletrônico.",
				},
			],
		},
	],
};
