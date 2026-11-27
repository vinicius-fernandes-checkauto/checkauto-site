# Contrato da API do backend

Especificações complementares do backend: [`cadastro-aceite-contrato.md`](cadastro-aceite-contrato.md) (aceite do contrato, consentimento de marketing, reCAPTCHA no cadastro, login com Google).

`openapi.json` é uma cópia do Swagger do backend (Info Magic Service, Swagger 2.0, 140 endpoints), atualizada em 27/11/2026 a partir de `https://dashiest-frazzledly-vihaan.ngrok-free.dev/swagger/`.

O endereço do ngrok muda quando o túnel reinicia. Para atualizar a cópia com o endereço novo:

```bash
curl -s -H "ngrok-skip-browser-warning: 1" -H "Accept: application/openapi+json" \
  "<url-do-backend>/swagger/?format=openapi" -o docs/api/openapi.json
npx biome format --write docs/api/openapi.json
```

## Endpoints que o site usa

| Fluxo                 | Método e rota                                        | Observação                                                                                                                                                                     |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Login                 | `POST /token/`                                       | `username`, `password` (+ `recaptcha_token`/`recaptcha_token_v2`). JWT. Conta do Google: `401` com `code: "google_account"` (desde 27/11/2026)                                 |
| Renovar sessão        | `POST /token/refresh/`                               | `refresh` → `access`                                                                                                                                                           |
| Validar token         | `POST /token/verify/`                                | `token`                                                                                                                                                                        |
| Cadastro              | `POST /signup/` (raiz, público)                      | PF ou PJ, telefone e endereço; corpo completo em `cadastro-aceite-contrato.md` (A6). `201` sem tokens: o site entra depois pelo `/token/`. `user/signup/` é só do Corp (admin) |
| Esqueci a senha       | `POST /user/forgot-password/`                        | corpo não documentado no Swagger. Conta do Google: `400` com `content = { message, code: "google_account" }`                                                                   |
| Trocar senha          | `POST /user/change-password/`                        | `current_password`, `new_password`, `new_password_again` (formato do Corp)                                                                                                     |
| Login com Google      | `POST /user/login/google/`                           | no Swagger sem corpo descrito; `{ id_token }`; resposta na raiz, como o `/token/`                                                                                              |
| Cadastro com Google   | `POST /user/signup/google/`                          | no Swagger sem corpo descrito; `id_token`, PF/PJ, endereço, aceite; resposta em `content`                                                                                      |
| Meus dados e endereço | `GET /user/retrieve/{id}/`, `PUT /user/update/{id}/` | nome, e-mail, CPF, telefone e um único endereço (`cep`, `street`…)                                                                                                             |
| Créditos              | `GET /wallet/movements/`                             | usuário web (perfil 4) vê só a própria carteira                                                                                                                                |
| Pedidos               | `GET /order/list/`, `GET /order/retrieve/{id}/`      | perfil 4 vê só os próprios pedidos                                                                                                                                             |

Autenticação: header `Authorization: Bearer <access>`.

### Meus dados: o que o site envia

`PUT /user/update/{id}/` leva só `phone`, `cep`, `street`, `number_address`, `complement`, `district`, `city`, `uf` e `marketing_consent`, com telefone e CEP só em dígitos. É a mesma lista que o Corp envia ao editar um "Usuário Web", mais o `marketing_consent` da especificação A3. **Não** envia `first_name`, `last_name`, `email`, `marketing_consent_at`, `company`, `cpf` nem `profile`. O corpo é travado pelo teste `domains/account/services/account.service.test.ts`.

**403 observado em 26/11/2026:** com `first_name`, `last_name` e `email` no corpo, o backend respondeu `403` com `{ content: "Acesso negado" }` para um usuário de perfil 4. Por isso nome e sobrenome ficaram só para leitura na tela. ⏳ Falta confirmar com o backend quais campos o perfil 4 pode alterar no próprio cadastro.

A resposta do `GET` e do `PUT` é lida com ou sem o envelope `{ user, content }`, e campos nulos viram texto vazio. O sucesso aparece num toast ("Alterações salvas"). Conferido em 26/11/2026 com uma conta PJ real: a tela carregou nome, telefone, endereço, dados da empresa e a data e a versão do aceite.

A tela antiga tinha "telefone secundário" e "inscrição estadual isenta", que não existem no contrato; os dois saíram. O endereço usa os mesmos campos do cadastro, com busca por CEP e `Select` na UF.

### Meus dados: o que o cliente pode editar

Conferido no Corp em 26/11/2026 (`src/pages/User/CreateOrUpdateUserWeb/`): ao editar um "Usuário Web", a tela só mostra e só envia telefone e endereço. Nome, sobrenome, CPF/CNPJ, dados da empresa, tipo de pessoa, e-mail e senha só existem no cadastro. O site segue a mesma regra:

| Campo                                                 | No site                                                                     |
| ----------------------------------------------------- | --------------------------------------------------------------------------- |
| Telefone                                              | editável                                                                    |
| CEP, rua, número, complemento, bairro, cidade, UF     | editáveis                                                                   |
| Novidades por e-mail (`marketing_consent`)            | editável (especificação A3)                                                 |
| Senha                                                 | editável pelo diálogo "Alterar senha" (`change-password`)                   |
| Nome e sobrenome                                      | bloqueados                                                                  |
| CPF                                                   | bloqueado                                                                   |
| Razão social, nome fantasia, CNPJ, inscrição estadual | bloqueados                                                                  |
| E-mail de acesso                                      | bloqueado; o diálogo de troca de e-mail (que era só interface) foi removido |
| Aceite do contrato                                    | só leitura, sem desfazer                                                    |

No Corp, o endereço de conta PJ vem em `content.company` quando os campos do usuário estão vazios; o site lê do usuário e cai para `company` nesse caso.

### Histórico de consultas: como o site usa a API

**Desde 27/11/2026 a tela lê pedidos, não consultas.** O backend confirmou que, por baixo, o "Histórico de consultas" do site é a tela de **pedidos web** do Corp (`src/pages/Order/Orders/`). O título continua "Histórico de consultas"; os dados, filtros e colunas são os do pedido.

O Swagger descreve só o acesso ("Perfil 4 vê e cria só os próprios pedidos; perfil 3 vê todos…; os demais recebem 403"), sem parâmetros nem formato de resposta. Parâmetros e campos vêm do Corp (`src/features/order/services/order.ts` e `types/order.ts`).

**Lista: `GET /order/list/`**

| Parâmetro              | O que o site envia                                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `page`                 | a página atual, começando em 1                                                                                                     |
| `page_size`            | 10, 20 ou 50, conforme "Por página"                                                                                                |
| `search`               | o texto da busca (placa, chassi ou código), sem espaços nas pontas; só com 2 caracteres ou mais                                    |
| `status`               | a situação escolhida no filtro; não é enviado em "Todas"                                                                           |
| `date_from`, `date_to` | sempre, em `AAAA-MM-DD`. Sem filtro: os últimos 12 meses. Com filtro: o período escolhido, limitado a 12 meses antes da data final |

- **Resposta:** `{ count, results }`, com ou sem o envelope `{ user, content }`. De cada pedido o site lê `id`, `number`, `status`, `status_label`, `plate`, `product.name`, `amount`, `created_at` e `query_code`.
- **Colunas:** Pedido (`#number`, em texto cinza de peso médio, com link para a página do pedido; o código da consulta fica só na página do pedido), Placa, Pacote, Valor, Data, Situação e ações.
- **Situação:** o texto é o `status_label` do backend; a cor vem do `status`. Valores conhecidos: `created` (Criado), `awaiting_payment` (Aguardando pagamento), `paid` (Pago), `processing` (Em consulta), `completed` (Concluído), `completed_partial` (Concluído com informações parciais), `failed` (Falhou), `cancelled` (Cancelado), `expired` (Expirado). Um `status` desconhecido aparece neutro, com o `status_label` ou "Em análise".
- **Atualização automática:** com algum pedido em `created`, `awaiting_payment`, `paid` ou `processing` na página, a lista é buscada de novo a cada 30 segundos (mesma regra do Corp).
- **Página do pedido: `/conta/consultas/<id>`** (pedido do backend, 27/11/2026). O `<id>` é o `id` (UUID) do pedido, o mesmo que vai para a Stripe depois do `POST /order/create/`; o `number` é só o que aparece na tela ("Pedido #1042"). O backend redireciona o cliente para essa página depois do pagamento.
  - Mesmo esquema da página de pedido do Corp (`src/pages/Order/OrderDetail/`), sem o cartão do cliente (é a própria pessoa): cabeçalho com número, data e situação; cartão **Pagamento** desenhado conforme o método do último evento `payment_paid`: cartão de crédito (bandeira e final `last4`) ou Pix; sem pagamento, um cartão tracejado com o valor e "Pague até" (`expires_at`); cartão **Consulta** (placa, pacote, código, "Ver extrato" e "Reconsultar"); e **Histórico do pedido** numa coluna à direita no desktop (fixa ao rolar), com os `events` (rótulo, grupo e data, do mais recente para o mais antigo, terminando em "Início do pedido"; cada evento tem um marcador: check verde em sucesso, X vermelho em falha, cancelamento ou expiração, relógio âmbar em espera. A cor vem do `type` conhecido ou, se não houver, do `status_after` do evento; `payment_failed` com `reason: "divergence"` mostra "Valor cobrado não confere com o pedido").
  - **Cancelar pedido:** botão nos pedidos `created` e `awaiting_payment`, com confirmação. Chama `POST /order/cancel/{id}/`; o `409` vira "Esse pedido não pode mais ser cancelado." e a página recarrega.
  - Campos lidos do `GET /order/retrieve/{id}/`, além dos da lista: `expires_at`, `call.id` e `events[]` (`type`, `group`, `label`, `created_at`, `data.method`, `data.brand`, `data.last4`, `data.error_code`, `data.reason`). Fora do Swagger; vieram do Corp.
  - Enquanto o pedido está `created`, `awaiting_payment`, `paid` ou `processing`, mostra uma mensagem do momento ("aguardando a confirmação do pagamento", "consultando o veículo"…) e se atualiza a cada 5 segundos.
  - Erros: `403` "Você não tem acesso a esse pedido." e `404` "Pedido não encontrado." (sem "Tentar novamente"); outros erros têm "Tentar novamente".
  - Na lista, o número do pedido é um link para essa página.
  - Como o site é estático, o `vercel.json` reescreve `/conta/consultas/:orderId` para `/__spa-fallback.html`; sem isso a Vercel responderia 404.
- **Pedido → consulta:** a lista não traz a consulta. Para a reconsulta, o site busca `GET /order/retrieve/{id}/` e usa `call.id` e `call.status`. Sem `call`, mostra "Esse pedido ainda não tem consulta.".
- **Erros:** `403` "Você não tem acesso a esse pedido.", `404` "Pedido não encontrado.". Falha ao carregar a lista mostra a mensagem com "Tentar novamente".

**Reconsultar: `POST /call/requery/{call_id}/`** (regra do backend, 26/11/2026)

- O botão "Reconsultar" aparece só quando `order.status === "completed_partial"` e `order.call.status === "5"`. Com `call.status === "2"` a reconsulta está em andamento: o botão fica desabilitado, girando, com "Reconsultando…", e a página do pedido mostra o aviso no cabeçalho.
- Na lista, o site busca `GET /order/retrieve/{id}/` só dos pedidos `completed_partial` da página, para ler o `call.status`. Se a chamada falhar, o botão não aparece.
- O `POST` vai sem corpo e responde `202 {"content":{"call_id":"..."}}`. Erros `409` "Consulta já está em execução." e `400` "Nenhum insumo indisponível elegível pra reconsulta." vêm como texto no `content`; o site mostra essa mensagem em toast (o `toApiError` usa o `content` quando ele é texto curto, em erros abaixo de 500; página HTML de erro, como o 404 do Django, é ignorada e vira a mensagem padrão).
- Depois do `202`, o site recarrega o pedido a cada 4 s (lista e página do pedido) enquanto `call.status` for `"2"`. Se o pedido virar `completed`, a reconsulta resolveu tudo; se continuar `completed_partial`, o botão volta.
- A reconsulta invalida o extrato antigo; como o extrato é pedido de novo a cada clique, nada mais é necessário.
- Não usamos mais `GET /call/availability/{id}/`.

**Extrato em PDF: `GET /order/extrato/{order_id}/`** (substitui `product/report/pdf/{call}/{product}/`)

- `order_id` é o `id` (UUID) do pedido.
- `200 {"pdf_status":"ready","download_url":"https://..."}`: abre o link (assinado, expira) numa aba nova.
- `202 {"pdf_status":"pending"|"processing"}`: o PDF está sendo gerado; o site repete a chamada a cada 2,5 s, por até 40 tentativas (cerca de 100 s).
- `200` e `202` vêm **sem** o envelope `{user, content}`.
- Erros: `409` com o texto do backend em `content` ("O extrato só fica disponível depois da consulta concluída."), `403` "Você não tem acesso a esse pedido.", `404` "Pedido não encontrado.", `401` volta para o login.
- O botão "Ver extrato" aparece só nos pedidos `completed` e `completed_partial`.

Enquanto espera, o botão "Ver extrato" fica desabilitado, com o ícone girando, e os dos outros itens também ficam desabilitados. Não há modal nem tela intermediária. Erro aparece em toast. Se o navegador bloquear a aba nova, porque ela é aberta depois da espera e não no clique, o site mostra um toast "Extrato pronto" com o botão "Abrir extrato".

- Não usamos mais `GET /call/retrieve/{id}/` nem `GET /product/report/pdf/…` no site.
- Pedido de teste em DEV: #100044 (`059c6abf-2601-459e-80ec-b50167dab1d3`), `completed_partial` com 2 APIs elegíveis.

**Filtros na URL (nuqs):** `?busca=`, `?situacao=`, `?de=`, `?ate=`, `?pagina=` e `?itens=`. Mudar um filtro refaz a busca pelo `clientLoader` da rota; a busca espera 400 ms depois da digitação.

**Filtro de período:** componente `PeriodFilter`, no modelo do Corp (abre num `Popover` no desktop e num painel de baixo para cima em telas menores que 640px): atalhos (Hoje, Ontem, Últimos 7 dias, 30 dias, 3, 6 e 12 meses) e intervalo personalizado de até 12 meses, com "Aplicar" e "Limpar". Sem período escolhido, mostra "Últimos 12 meses", que é o que o site envia por padrão.

**Fora desta entrega:** exportar CSV. No Corp a exportação é por empresa (`company/download/invoice/{id}/start/`), então não serve para pessoa física, e falta confirmar se o perfil 4 tem permissão.

### Histórico de transações (carteira): `GET /wallet/movements/`

Integrado em 27/11/2026 (`/conta/transacoes`). É o "Histórico de Saldos" do Corp (`src/pages/Wallet/BalanceHistory/`), que lá é só do admin; aqui é a visão do próprio cliente.

- **Acesso:** o perfil 4 vê só a carteira que paga as consultas dele. O site **não** manda `user_id` nem `company_id` (o backend responde 403 mesmo com o próprio id).
- **Parâmetros:** `date_from`, `date_to` (`AAAA-MM-DD`), `page`, `page_size`. Mesmo período padrão e limite do histórico de consultas (12 meses), e os mesmos itens por página (10, 20, 50). Na URL: `?de=`, `?ate=`, `?pagina=`, `?itens=`.
- **Resposta** (formato vindo do Corp; o Swagger não descreve): `content.count`, `content.results[]` e `content.summary.balance`. Cada movimento: `id`, `type`, `origin` (`manual`/`automatic`), `amount` (com sinal), `balance_after`, `reason`, `created_at`. O site não usa `category`, `changed_by` nem `client` (são do admin).
- **Rótulos de `type`:** `credit_order` Crédito por pedido, `credit_manual` Crédito manual, `debit_call` Débito de consulta, `refund` Estorno, `adjustment` Ajuste, `limit_change` Alteração de limite, `period_reset` Virada de período, `opening` Saldo inicial. Tipo desconhecido aparece com o texto cru.
- **Sinal e cor:** vêm do sinal de `amount`: positivo "+ R$" em verde, negativo "− R$" em vermelho, zero sem sinal. Sem `reason` e com `origin: "manual"`, mostra "Ajuste manual".
- **Saldo do card:** `content.summary.balance`. Se não vier, o site usa o `balance` do usuário (`GET /user/retrieve/{id}/`). Sem nenhum dos dois, mostra "R$ 0,00".
- **Erros:** `403` "Você não tem acesso ao histórico de saldo."; outros mostram a mensagem com "Tentar novamente".
- **A conferir com dados reais:** se o `summary` vem para o perfil 4 e se o movimento traz referência ao pedido (para virar link para `/conta/consultas/<id>`).

### Situação da integração na área do cliente (26/11/2026)

| Tela                                          | Situação                                                                                                                                                       |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Meus dados: alterar senha                     | integrado (`POST /user/change-password/`)                                                                                                                      |
| Meus dados: telefone, endereço e marketing    | integrado em 26/11/2026: carrega com `GET /user/retrieve/{id}/` (o `id` vem da sessão) e salva com `PUT /user/update/{id}/`                                    |
| Meus dados: contrato                          | só leitura: mostra `terms_accepted_at` e `terms_accepted_version`; sem opção de desfazer (especificação A3). "Ler contrato" abre em outra aba                  |
| Meus dados: nome, CPF e dados da empresa (PJ) | só leitura (`first_name`, `last_name`, `cpf` e `company.corporate_name`, `fantasy_name`, `cnpj`, `state_registration`)                                         |
| Meus dados: e-mail de acesso                  | só leitura; não há rota de troca de e-mail no contrato                                                                                                         |
| Histórico de consultas                        | integrado em 26/11/2026: lista, busca, período, itens por página, reconsulta e extrato em PDF. Lista conferida com dados reais; reconsulta e extrato ainda não |
| Histórico de transações                       | integrado em 27/11/2026: saldo, movimentações da carteira, período e itens por página. Ainda não conferido com dados reais                                     |

## Sessão no redesign

O Swagger documenta access/refresh tokens e autenticação por header; não
documenta emissão de sessão com `Set-Cookie`. Até o backend oferecer cookies
`HttpOnly`, o frontend guarda access, refresh e dados mínimos do usuário em
cookies `Secure` (HTTPS), `SameSite=Lax`, acessíveis ao JavaScript, e envia o
access token no header `Authorization` nas chamadas protegidas. Esses cookies
não são `HttpOnly`; a solução mantém compatibilidade com os endpoints atuais,
mas não tem a proteção contra leitura por JavaScript de uma sessão gerenciada
integralmente pelo backend.

## Pontos a confirmar com o backend

- O Swagger repete o corpo da requisição como resposta em `/token/` e `/token/refresh/`; confirmar o formato real (esperado: `access` e `refresh`).
- `forgot-password` e `change-password` não têm corpo documentado. A chamada de recuperação usa `{ "email": ... }`, conforme o fluxo legado do CK-CORP, até confirmação do backend.
- O Swagger lista `POST /signup/` e `GET /user/terms/current/`, mas não descreve o corpo do cadastro nem a resposta dos termos. Os campos do cadastro e o formato do contrato estão em `cadastro-aceite-contrato.md`.
- `forgot-password` com e-mail sem conta responde `400` com `{ content: { message: "Opss.. Por favor tente novamente mais tarde!" } }` (26/11/2026). Confirmar se é o esperado.
- CORS: `http://localhost:3000` liberado; o domínio da Vercel ainda não (26/11/2026).
- O usuário tem **um** endereço nos campos do próprio cadastro; a tela de endereços do redesign permite vários.
- Não há rota de "meu usuário" (`/me`): o `id` precisa vir do token ou do login.
- Recuperação de senha por código e troca obrigatória no próximo acesso (CKCORP1-63) não aparecem no contrato.
- O Swagger declara `http` como esquema; em produção a API precisa ser `https`.

## Stripe: produtos dos pacotes

Cada pacote corresponde a um `product_id` da Stripe, em variáveis de ambiente (pedido do backend em 27/11/2026):

| Pacote             | Variável                       |
| ------------------ | ------------------------------ |
| Checkauto Standard | `VITE_STRIPE_PRODUCT_STANDARD` |
| Checkauto Master   | `VITE_STRIPE_PRODUCT_MASTER`   |
| Checkauto Plus     | `VITE_STRIPE_PRODUCT_PLUS`     |

- Os nomes estão no `.env.example`; os valores ficam no `.env` local e na Vercel. Levam `VITE_` porque o `product_id` não é segredo.
- `stripeProductId(planId)` em `app/shared/lib/stripe-products.ts` devolve o `product_id` do pacote (`checkauto-standard`, `checkauto-master`, `checkauto-plus`) ou `null` se a variável estiver vazia.
- ⏳ Ainda não é usado em nenhuma tela. O backend explicou (27/11/2026) que o que vai para a Stripe é o `id` do pedido gerado no `POST /order/create/`; falta confirmar se o site ainda precisa desses `product_id` ou se a escolha do pacote vai só no corpo do pedido.
