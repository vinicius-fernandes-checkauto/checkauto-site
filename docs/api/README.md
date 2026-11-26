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
| Login                 | `POST /token/`                                       | `username`, `password` (+ `recaptcha_token`/`recaptcha_token_v2`). JWT                                                                                                         |
| Renovar sessão        | `POST /token/refresh/`                               | `refresh` → `access`                                                                                                                                                           |
| Validar token         | `POST /token/verify/`                                | `token`                                                                                                                                                                        |
| Cadastro              | `POST /signup/` (raiz, público)                      | PF ou PJ, telefone e endereço; corpo completo em `cadastro-aceite-contrato.md` (A6). `201` sem tokens: o site entra depois pelo `/token/`. `user/signup/` é só do Corp (admin) |
| Esqueci a senha       | `POST /user/forgot-password/`                        | corpo não documentado no Swagger                                                                                                                                               |
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

`GET /call/list/`. O Swagger documenta só `search`, `ordering` e `page`; os demais parâmetros vêm do Corp (`src/pages/Query/Queries/index.tsx`), que usa a mesma rota.

| Parâmetro                    | O que o site envia                                                                                                                                        |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initial_date`, `final_date` | sempre, em `AAAA-MM-DD`. Sem filtro: os últimos 12 meses. Com filtro: o período escolhido, limitado a 12 meses antes da data final (mesmo limite do Corp) |
| `page`                       | a página atual, começando em 1                                                                                                                            |
| `page_size`                  | 10                                                                                                                                                        |
| `search`                     | a placa digitada, só letras e números em maiúsculas; não é enviado quando vazio                                                                           |

- **Sem filtro por status:** a rota não tem esse parâmetro (nem no Swagger, nem no Corp). ⏳ Pedir ao backend se for necessário.
- **`ordering`:** existe no Swagger, mas o site não usa; a ordem é a do backend.
- **Resposta:** `{ count, results }`, com ou sem o envelope `{ user, content }`. De cada item o site lê `id`, `query_code`, `products`, `status`, `data` e `created_at`.
  - **Placa:** vem de `data`, no parâmetro cuja chave ou descrição fala em placa; se não houver, o primeiro valor.
  - **Pacote:** o nome em `products`; com mais de um, "Consulta múltipla".
  - **Data:** aceita o texto já formatado do backend (`DD/MM/AAAA às HH:MM`) e data ISO.
  - **Status:** `1` na fila, `2` em andamento, `3` finalizada, `4` erro, `5` informações indisponíveis.
- **Reconsultar:** `POST /call/requery/{id}/`, oferecido nos status `4` e `5`. O backend recusa com `409` se a consulta já está em execução; o site mostra a mensagem em toast.
- **Atualização automática:** enquanto houver consulta na fila ou em andamento na página, o site busca a lista de novo a cada 30 segundos.
- **Filtro de período:** componente `PeriodFilter`, no modelo do Corp (abre num `Popover` no desktop e num painel de baixo para cima em telas menores que 640px): atalhos (Hoje, Ontem, Últimos 7 dias, 30 dias, 3, 6 e 12 meses) e intervalo personalizado de até 12 meses, com "Aplicar" e "Limpar". Sem período escolhido, mostra "Últimos 12 meses", que é o que o site envia por padrão.
- **Filtros na URL (nuqs):** `?placa=`, `?de=`, `?ate=` e `?pagina=`. Mudar um filtro refaz a busca pelo `clientLoader` da rota; a busca por placa espera 400 ms depois da digitação.
- **Fora desta entrega:** abrir o extrato em PDF (`GET /product/report/pdf/{call_id}/{product_id}/`, com espera pelo status) e o detalhe da consulta (`GET /call/retrieve/{id}/`).

### Situação da integração na área do cliente (26/11/2026)

| Tela                                          | Situação                                                                                                                                      |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Meus dados: alterar senha                     | integrado (`POST /user/change-password/`)                                                                                                     |
| Meus dados: telefone, endereço e marketing    | integrado em 26/11/2026: carrega com `GET /user/retrieve/{id}/` (o `id` vem da sessão) e salva com `PUT /user/update/{id}/`                   |
| Meus dados: contrato                          | só leitura: mostra `terms_accepted_at` e `terms_accepted_version`; sem opção de desfazer (especificação A3). "Ler contrato" abre em outra aba |
| Meus dados: nome, CPF e dados da empresa (PJ) | só leitura (`first_name`, `last_name`, `cpf` e `company.corporate_name`, `fantasy_name`, `cnpj`, `state_registration`)                        |
| Meus dados: e-mail de acesso                  | só leitura; não há rota de troca de e-mail no contrato                                                                                        |
| Histórico de consultas                        | integrado em 26/11/2026: `GET /call/list/` e `POST /call/requery/{id}/`. Ainda sem conferência com dados reais                                |
| Histórico de transações                       | **dados de demonstração**                                                                                                                     |

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
