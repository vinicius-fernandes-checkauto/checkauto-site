# Contrato da API do backend

Especificações complementares do backend: [`cadastro-aceite-contrato.md`](cadastro-aceite-contrato.md) (aceite do contrato, consentimento de marketing, reCAPTCHA no cadastro, login com Google).

`openapi.json` é uma cópia do Swagger do backend (Info Magic Service, Swagger 2.0, 139 endpoints), atualizada em 26/11/2026 a partir de `https://dashiest-frazzledly-vihaan.ngrok-free.dev/swagger/`.

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

O Swagger é a referência. Onde ele não descreve (parâmetros extras e o formato das respostas), o site segue o que o Corp faz com as mesmas rotas (`src/pages/Query/` e `src/features/query/`), e isso está marcado como "fora do Swagger".

**Lista: `GET /call/list/`**

| Parâmetro                    | Origem                 | O que o site envia                                                                                                                 |
| ---------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `search`                     | Swagger                | o texto da busca (placa, chassi ou código da consulta), sem espaços nas pontas; só é enviado com 2 caracteres ou mais              |
| `page`                       | Swagger                | a página atual, começando em 1                                                                                                     |
| `ordering`                   | Swagger                | não usado; a ordem é a do backend                                                                                                  |
| `initial_date`, `final_date` | fora do Swagger (Corp) | sempre, em `AAAA-MM-DD`. Sem filtro: os últimos 12 meses. Com filtro: o período escolhido, limitado a 12 meses antes da data final |
| `page_size`                  | fora do Swagger (Corp) | 10, 20 ou 50, conforme "Por página"                                                                                                |

- **Sem filtro por status nem busca por tipo:** o Swagger só tem um `search` livre. No Corp, os "tipos de busca" (placa, código, CPF…) só validam o texto no navegador e enviam o mesmo `search`.
- **Resposta:** `{ count, results }`, com ou sem o envelope `{ user, content }`. De cada item o site lê `id`, `query_code`, `products`, `status`, `data` e `created_at`.
  - **Placa:** vem de `data`, no parâmetro cuja chave ou descrição fala em placa; se não houver, o primeiro valor.
  - **Pacote:** o nome em `products`; com mais de um, "Consulta múltipla".
  - **Data:** aceita o texto já formatado do backend (`DD/MM/AAAA às HH:MM`) e data ISO.
  - **Status:** `1` na fila, `2` em andamento, `3` finalizada, `4` erro, `5` informações indisponíveis.
- **Atualização automática:** enquanto houver consulta na fila ou em andamento na página, o site busca a lista de novo a cada 30 segundos.

**Reconsultar: `GET /call/availability/{id}/` e `POST /call/requery/{id}/`**

- O Swagger diz que a `availability` é "usada pelo front pra decidir se mostra o botão reconsultar". O site segue isso: para cada consulta da página com status `4` ou `5`, chama a `availability` e só mostra o botão quando alguma API vem com `requery_eligible: true`. Se a chamada falhar, o botão não aparece.
- O formato da resposta (`products[].apis[].requery_eligible`) está fora do Swagger e veio do Corp. O Corp só consulta a `availability` no status `5`; o site consulta também no `4` e deixa o backend decidir.
- O `POST` recusa com `409` se a consulta já está em execução; o site mostra a mensagem em toast e, no sucesso, recarrega a lista.

**Extrato em PDF: `GET /call/retrieve/{id}/` e `GET /product/report/pdf/{call_id}/{product_id}/`**

1. O site lê `extrato_products` da consulta e usa o primeiro produto com `extrato_enabled: true`. Sem nenhum, mostra "Extrato indisponível".
2. Chama a rota do PDF. O Swagger explica que ela responde na hora com o PDF em cache ou dispara a geração e devolve o status atual, sem bloquear.
3. Enquanto o status for `pending`, `processing` ou `failed`, o site repete a chamada a cada 3 segundos, por até 30 tentativas (o backend redispara a geração sozinho quando falha).
4. Com `ready`, abre o `download_url` (o PDF) numa aba nova.

Enquanto espera, o botão "Ver extrato" da linha fica desabilitado, com o ícone girando, e os dos outros itens também ficam desabilitados. Não há modal nem tela intermediária. Erro (sem extrato, consulta de outra conta, demora além das 30 tentativas) aparece em toast. Se o navegador bloquear a aba nova, porque ela é aberta depois da espera e não no clique, o site mostra um toast "Extrato pronto" com o botão "Abrir extrato".

- Os campos `extrato_products`, `pdf_status` e `download_url` estão fora do Swagger e vieram do Corp.
- Erros: `403` "Essa consulta não pertence à sua conta.", `404` "Essa consulta não tem extrato disponível.", `503` "Não foi possível carregar o extrato agora.".
- O botão "Ver extrato" aparece nas consultas finalizadas e nas com informações indisponíveis. No Corp, o cliente não abre consulta com erro.

**Filtros na URL (nuqs):** `?busca=`, `?de=`, `?ate=`, `?pagina=` e `?itens=`. Mudar um filtro refaz a busca pelo `clientLoader` da rota; a busca espera 400 ms depois da digitação.

**Filtro de período:** componente `PeriodFilter`, no modelo do Corp (abre num `Popover` no desktop e num painel de baixo para cima em telas menores que 640px): atalhos (Hoje, Ontem, Últimos 7 dias, 30 dias, 3, 6 e 12 meses) e intervalo personalizado de até 12 meses, com "Aplicar" e "Limpar". Sem período escolhido, mostra "Últimos 12 meses", que é o que o site envia por padrão.

**Fora desta entrega:** exportar CSV. No Corp a exportação é por empresa (`company/download/invoice/{id}/start/`), então não serve para pessoa física, e falta confirmar se o perfil 4 tem permissão.

### Situação da integração na área do cliente (26/11/2026)

| Tela                                          | Situação                                                                                                                                                       |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Meus dados: alterar senha                     | integrado (`POST /user/change-password/`)                                                                                                                      |
| Meus dados: telefone, endereço e marketing    | integrado em 26/11/2026: carrega com `GET /user/retrieve/{id}/` (o `id` vem da sessão) e salva com `PUT /user/update/{id}/`                                    |
| Meus dados: contrato                          | só leitura: mostra `terms_accepted_at` e `terms_accepted_version`; sem opção de desfazer (especificação A3). "Ler contrato" abre em outra aba                  |
| Meus dados: nome, CPF e dados da empresa (PJ) | só leitura (`first_name`, `last_name`, `cpf` e `company.corporate_name`, `fantasy_name`, `cnpj`, `state_registration`)                                         |
| Meus dados: e-mail de acesso                  | só leitura; não há rota de troca de e-mail no contrato                                                                                                         |
| Histórico de consultas                        | integrado em 26/11/2026: lista, busca, período, itens por página, reconsulta e extrato em PDF. Lista conferida com dados reais; reconsulta e extrato ainda não |
| Histórico de transações                       | **dados de demonstração**                                                                                                                                      |

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
