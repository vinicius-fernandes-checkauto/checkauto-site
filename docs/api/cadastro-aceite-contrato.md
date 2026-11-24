# Cadastro: aceite do contrato (especificação do backend)

Recebida em 24/11/2026. Complementa o `openapi.json`. Rotas sob `user/`. Toda resposta vem no envelope `{ "user": ..., "content": ... }`.

## Parte A: site novo (este projeto)

### A1. Texto do contrato

- `GET user/terms/current/` — público, sem token.
- `content = { version, content, published_at }`. Sem contrato publicado: `404`.
- O ambiente já vem com a versão atual `2026-11`.
- O texto tem recuo de 20 espaços por linha e linhas em branco com espaços. Mostrar numa caixa com rolagem usando `white-space: pre-wrap`, **sem `trim`** e **sem `innerHTML`** (é texto puro).

### A2. Cadastro: `POST user/signup/` ganha 3 campos

| Campo               | Regra                                    | Erro                                                                                             |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `accept_terms`      | `true`, obrigatório                      | faltando ou `false` → `400` com a chave `accept_terms`                                           |
| `terms_version`     | obrigatório; a `version` do A1           | não é a vigente → `400` com a chave `terms_version`: buscar o texto de novo e pedir nova leitura |
| `marketing_consent` | opcional, `true`/`false`, padrão `false` | —                                                                                                |

- **Não** deixar "Sim" pré-selecionado no consentimento de marketing.
- O botão "Cadastrar" só habilita com o aceite marcado (a API também recusa).
- O `201` de sucesso continua igual.

### A3. Meus dados

- `GET user/retrieve/<id>/` passa a trazer `terms_accepted_version`, `terms_accepted_at`, `marketing_consent`, `marketing_consent_at`.
- Contrato já aceito: mostrar "Sim, concordo" marcado, **sem opção de desfazer**.
- Alterar marketing: `PUT user/update/<id>/ { "marketing_consent": true | false }`.
- **Não** enviar `marketing_consent_at` (vira `403`; a data é do servidor).

### A4. reCAPTCHA no cadastro (antes da subida de 03/12)

O `POST user/signup/` vai exigir reCAPTCHA, igual ao login:

- `recaptcha_token`: token v3, ação `"signup"`.
- `recaptcha_token_v2`: token do desafio v2, enviado só quando o backend pedir.
- Se o v3 não bastar, o backend responde com o código `recaptcha_fallback_required` e o front mostra o desafio v2. Se falhar, `recaptcha_failed`.
- Mesmas keys do login (site key v3 com a ação `"signup"` e a key v2 de fallback).
- Não se aplica ao cadastro pelo Google.

Formato observado no login (`POST /token/` sem reCAPTCHA): `401` com `{ "detail": "...", "code": "recaptcha_fallback_required" }`.

### A5. Próxima branch (preparar)

- Login e cadastro pelo Google: `POST user/login/google/` e `POST user/signup/google/`. O cadastro pelo Google exige o mesmo aceite (`accept_terms`, `terms_version`) e os dados que o Google não traz (CPF/CNPJ, telefone, endereço).
- Senha dos migrados (se aprovada): o login devolve o código `password_setup_required`, página pública `/definir-senha` e `POST user/password/set/`.

## Parte B: Front Corp, tela "Usuário web" (outro projeto)

Não é deste repositório; registrado para contexto. A tela de cadastro feita pela equipe passa a enviar `accept_terms: true`, `terms_version` e, se houver a pergunta, `marketing_consent`, com o checkbox "O cliente declarou ter lido e aceito o contrato" e link/modal com o texto de `GET user/terms/current/`. Mantém o `Authorization` do admin (o aceite fica "atestado pela equipe"). Sem reCAPTCHA.
