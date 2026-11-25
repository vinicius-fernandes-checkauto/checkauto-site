# PRODUCT.md

Contexto de produto da **Checkauto** para agentes de IA (e pessoas) que trabalham neste repositório. O `CLAUDE.md` diz **como** construir; este arquivo diz **o quê** e **para quem**. Quando os dois falarem do mesmo assunto, as regras técnicas do `CLAUDE.md` valem.

Números, preços e listas mudam: a fonte de verdade é o código em `app/@content/` (principalmente `plans.ts` e `checkauto.ts`). Este arquivo resume; não copie valores daqui para o código.

## 1. O produto

A Checkauto vende **consulta de histórico veicular pela placa**. A pessoa informa a placa, escolhe um pacote, paga e recebe na hora um relatório (o "extrato") com o que pode pesar na compra ou na transferência do veículo: leilão, roubo e furto, restrições, débitos, recall, quilometragem, ocorrências e gravame.

- **Promessa:** comprar ou vender um veículo sem surpresa. Saber o histórico antes de fechar negócio.
- **História:** pioneira da consulta veicular no Brasil (desde 2000). Mais de 25 anos, +13 milhões de consultas, +80 milhões de registros, +70 mil usuários.
- **Empresa:** Checkauto Consultoria Técnica e Informações Veiculares LTDA, Guarulhos/SP. Em 2026 passou a fazer parte do **Grupo Forrisk**, com investimento para expansão.
- **Momento:** este repositório é o **redesign do site público** e da área do cliente. A marca está ganhando cara nova e virando uma plataforma de inteligência veicular.

## 2. Para quem

| Público | O que quer | Onde aparece |
| --- | --- | --- |
| **Pessoa física comprando um veículo usado** (principal) | Saber se o veículo tem problema antes de pagar | Home, pacotes, carrinho, conta |
| **Pessoa vendendo o próprio veículo** | Mostrar ao comprador que o veículo está limpo | Home, pacotes |
| **Empresas que vendem veículos** (revendas, multimarcas) | Volume de consultas e pacotes próprios | FAQ e contato comercial. **Não** é o foco do site; nunca usar "lojista" no header ou na navegação |
| **Equipe interna** | Cadastrar e atender clientes | Fica no **Checkauto Corp**, outro sistema que usa a mesma API |

## 3. Pacotes

Sempre em **ordem crescente de preço**: Standard → Master → Plus. Detalhes, preços e itens em `app/@content/plans.ts` (fonte única).

| Pacote | Posicionamento | O que acrescenta |
| --- | --- | --- |
| **Standard** | Essencial | Leilão, roubo e furto, restrições e bloqueios, débitos e multas, recall, histórico de quilometragem + informações cadastrais |
| **Master** | Intermediário | Tudo do Standard + **indício de ocorrência** |
| **Plus** | Mais completo (recomendado) | Tudo do Master + **gravame** |

O que diferencia os pacotes é só **indício de ocorrência** e **gravame**. O resto (documentação, restrições, débitos, roubo e furto, KM, leilão, recall, FIPE) é comum aos três.

## 4. Jornadas

1. **Consultar (site público):** placa na home (exemplo `ABC1D23`, Mercosul) → escolher pacote → carrinho (pode ter mais de uma placa) → pagamento → relatório.
2. **Não tenho a placa:** página `/ainda-nao-tenho-placa` orienta quem ainda está procurando o veículo.
3. **Conta:** entrar ou cadastrar → `/conta` com histórico de consultas, histórico de transações (créditos), pacotes, nova consulta e meus dados.
4. **Institucional:** sobre nós, FAQ, contato, imprensa, contrato, política de privacidade e aspectos legais.

## 5. Estado atual (atualize quando mudar)

- **Interface:** pronta para todas as rotas, com dados de demonstração.
- **Integração com o backend:** em andamento, passo a passo, começando pela autenticação.
  - Feito: login por e-mail e senha com reCAPTCHA v3 e fallback v2, sessão no navegador, logout, proteção da `/conta`, token nas chamadas com renovação automática.
  - Falta: cadastro (`POST /signup/` com aceite do contrato), esqueci a senha, trocar senha, login com Google, e todas as telas da conta com dados reais.
- **Pagamento, carrinho e consultas:** ainda só interface.
- **Indexação:** o site ainda **não** deve ser indexado (`noindex` no `vercel.json`) até o lançamento.
- Ao entregar algo, diga o que é só interface (por exemplo, "Mensagem enviada" sem envio real).

## 6. Backend

- API Django REST, a mesma do Checkauto Corp. Contrato em `docs/api/` (`openapi.json`, `README.md`, `cadastro-aceite-contrato.md`).
- Autenticação por JWT (`access` + `refresh`). O usuário do site é o **perfil 4** (cliente web) e só vê os próprios dados.
- O cadastro do site usa `POST /signup/` (público). O `user/signup/` é exclusivo do Corp (admin).

## 7. Voz e linguagem

- Português do Brasil, **direto e confiável**. Pouco texto por bloco; frases curtas.
- Diga **"veículo"**, não "carro".
- **Não cite a DEKRA.**
- Gravame é "gravame registrado no veículo". Não amarrar gravame a financiamento.
- Use "indício de ocorrência" (não "batida", "enchente" ou "sinistro").
- Números da empresa sempre abreviados e grandes: "+13 milhões", "+70 mil".
- Mensagens de erro e validação no imperativo e com a solução: "Informe o CEP.", "Confirme que você não é um robô para continuar."
- Sem promessas que o produto não cumpre (por exemplo, "100% garantido").

## 8. Marca e visual (resumo)

- Cores: azul `#002E55` (títulos, superfícies escuras), verde escuro `#008143` (botões e ações), verde `#66C61C` só como destaque. Fundo claro `#F3F5F2`.
- Estilo moderno, limpo e orgânico: muito respiro, cards arredondados, detalhes em verde sobre azul e os **arcos da marca** (nunca bolhas ou blobs).
- Regras completas de design system, tokens e acessibilidade no `CLAUDE.md`.

## 9. Fora do escopo deste repositório

- Checkauto Corp (painel interno da equipe).
- Geração do relatório da consulta (é do backend; o site só mostra).
- Planos para revendas em volume (atendimento comercial).
