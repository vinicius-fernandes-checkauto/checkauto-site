# Cadastro: aceite do contrato (especificação do backend)

Recebida em 24/11/2026 e atualizada no mesmo dia. Complementa o `openapi.json`. Toda resposta vem no envelope `{ "user": ..., "content": ... }`.

## Duas rotas de cadastro

| Quem cadastra                                                       | Rota                                       | Acesso                                                           | reCAPTCHA |
| ------------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------- | --------- |
| **Site novo** (este projeto)                                        | `POST /signup/` (na raiz, **sem** `user/`) | público, sem token                                               | sim (A4)  |
| **Checkauto Corp**, tela "Usuário Web" (cadastro feito pela equipe) | `POST user/signup/` (a mesma URL de hoje)  | só admin: JWT de perfil 3. Anônimo → `401`, outro perfil → `403` | não       |

As demais rotas continuam no padrão do sistema, sob `user/`.

## Parte A: site novo (este projeto)

### A1. Texto do contrato

- `GET user/terms/current/` — público, sem token.
- `content = { version, content, published_at }`. Sem contrato publicado: `404`.
- O ambiente já vem com a versão atual `2026-11`.
- O texto tem recuo de 20 espaços por linha e linhas em branco com espaços. Mostrar numa caixa com rolagem usando `white-space: pre-wrap`, **sem `trim`** e **sem `innerHTML`** (é texto puro).

### A2. Cadastro: `POST /signup/` ganha 3 campos

| Campo               | Regra                                    | Erro                                                                                             |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `accept_terms`      | `true`, obrigatório                      | faltando ou `false` → `400` com a chave `accept_terms`                                           |
| `terms_version`     | obrigatório; a `version` do A1           | não é a vigente → `400` com a chave `terms_version`: buscar o texto de novo e pedir nova leitura |
| `marketing_consent` | opcional, `true`/`false`, padrão `false` | —                                                                                                |

- O botão "Cadastrar" só habilita com o aceite marcado (a API também recusa).
- O `201` de sucesso continua igual ao de hoje.
- Nesta rota o backend **ignora** o cabeçalho `Authorization`: token vencido não dá `401`. Mesmo assim, **não anexe o token** no cadastro público.

### A3. Meus dados

- `GET user/retrieve/<id>/` passa a trazer `terms_accepted_version`, `terms_accepted_at`, `marketing_consent`, `marketing_consent_at`.
- Contrato já aceito: mostrar "Sim, concordo" marcado, **sem opção de desfazer**.
- Alterar marketing: `PUT user/update/<id>/ { "marketing_consent": true | false }`.
- **Não** enviar `marketing_consent_at` (vira `403`; a data é do servidor).

### A4. reCAPTCHA no cadastro (antes da subida de 03/12)

O `POST /signup/` vai exigir reCAPTCHA (hoje não exige), igual ao login:

- `recaptcha_token`: token v3, ação `"signup"`.
- `recaptcha_token_v2`: token do desafio v2, enviado só quando o backend pedir.
- Se o v3 não bastar, o backend responde com o código `recaptcha_fallback_required` e o front mostra o desafio v2. Se falhar, `recaptcha_failed`.
- Mesmas keys do login (site key v3 com a ação `"signup"` e a key v2 de fallback).
- Não se aplica ao cadastro pelo Google.

Formato observado no login (`POST /token/` sem reCAPTCHA): `401` com `{ "detail": "...", "code": "recaptcha_fallback_required" }`.

### A6. Corpo completo do `POST /signup/` (recebido em 26/11/2026)

A pessoa se cadastra com **CPF (PF)** ou **CNPJ (PJ)**, no mesmo esquema do "Usuário Web" do Corp. `Content-Type: application/json`.

Pessoa física:

```json
{
	"person_type": "pf",
	"first_name": "Maria",
	"last_name": "Silva",
	"email": "maria@exemplo.com",
	"password": "<senha>",
	"cpf": "<CPF>",
	"phone": "11988887777",
	"cep": "01310100",
	"street": "Av Paulista",
	"number_address": "1000",
	"complement": "Apto 12",
	"district": "Bela Vista",
	"city": "São Paulo",
	"uf": "SP",
	"accept_terms": true,
	"terms_version": "2026-11",
	"marketing_consent": false,
	"recaptcha_token": "<token v3 com a ação signup>"
}
```

Pessoa jurídica (muda só o bloco de documento e empresa):

```json
{
	"person_type": "pj",
	"cnpj": "<CNPJ>",
	"corporate_name": "Empresa Teste Ltda",
	"fantasy_name": "Empresa Teste",
	"business_area": "Despachante",
	"municipal_registration": "",
	"state_registration": ""
}
```

| Grupo        | Campos                                                                                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Obrigatórios | `person_type`, `first_name`, `last_name`, `email`, `password`, `phone`, `cep`, `street`, `number_address`, `district`, `city`, `uf`, `accept_terms` (`true`), `terms_version`, `recaptcha_token` |
| Só PF        | `cpf`                                                                                                                                                                                            |
| Só PJ        | `cnpj`, `corporate_name`, `fantasy_name` (o `cpf`, se vier, é ignorado)                                                                                                                          |
| Opcionais    | `complement`, `marketing_consent` (padrão `false`), `business_area`, `municipal_registration`, `state_registration`                                                                              |

Regras:

- `terms_version`: a `version` de `GET user/terms/current/`. Versão desatualizada dá `400`.
- `accept_terms`: tem de ser `true`.
- `marketing_consent`: sem pré-seleção; só `true` se a pessoa marcou.
- `password`: mínimo de 8 caracteres, com minúscula, maiúscula, número e um símbolo entre `_ @ ! ( ) & + $` (outros, como `#` e `*`, não contam), sem espaços. O site limita a 16, como o Corp.
- `cpf`/`cnpj`: podem ir com máscara; o backend normaliza. O site envia só dígitos.
- `recaptcha_token`: v3 com a ação `"signup"`. Se vier `recaptcha_fallback_required`, mostrar o desafio v2 e reenviar o **mesmo** formulário com `recaptcha_token_v2`.

Resposta (envelope `{ user, content }`):

- `201`: `content = { id, first_name, last_name, email, profile, company }`. **Não traz tokens:** depois do `201`, fazer o login em `POST /token/` (com `recaptcha_token` da ação `"login"`).
- `400` com erros por campo, por exemplo `email`, `cpf`, `password`, `terms_version`, cada um com uma lista de mensagens.
- `400` com `{ "detail": "...", "code": "recaptcha_fallback_required" | "recaptcha_failed" }`. O erro de reCAPTCHA vem **antes** dos erros de campo: sem token, só ele aparece.

**No site:** o formulário não tem `business_area`, `municipal_registration` nem `state_registration` (opcionais).

### A5. Próxima branch (preparar)

- Login e cadastro pelo Google — **caminhos finais a confirmar** na próxima branch. O cadastro pelo Google exige o mesmo aceite (`accept_terms`, `terms_version`) e os dados que o Google não traz (CPF/CNPJ, telefone, endereço).
- Senha dos migrados (se aprovada): o login devolve o código `password_setup_required`, página pública `/definir-senha` e `POST user/password/set/`.

## Parte B: Checkauto Corp, tela "Usuário Web" (outro projeto)

Não é deste repositório; registrado para contexto. **Ajuste obrigatório:** hoje a tela chama `POST user/signup/` sem os campos novos e vai receber `400` depois do deploy do backend.

- **Manter o caminho `user/signup/`.** A rota agora exige admin (JWT de perfil 3); a tela já é só de admin, então nada muda no acesso.
- Checkbox obrigatório: "O cliente declarou ter lido e aceito o contrato", com link ou modal que mostra o texto de `GET user/terms/current/` (sem token).
- Enviar `accept_terms: true` e `terms_version` (a `version` do texto exibido), e `marketing_consent` se houver a pergunta.
- Manter o `Authorization` do admin: o backend registra o aceite como "atestado pela equipe", com o id do admin.
- **Sem reCAPTCHA** nesta tela.
- Resposta `201` sem mudança.
