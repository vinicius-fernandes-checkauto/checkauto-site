# Contrato da API do backend

Especificações complementares do backend: [`cadastro-aceite-contrato.md`](cadastro-aceite-contrato.md) (aceite do contrato, consentimento de marketing, reCAPTCHA no cadastro, login com Google).

`openapi.json` é uma cópia do Swagger do backend (Info Magic Service, Swagger 2.0, 137 endpoints), atualizada em 25/11/2026 a partir de `https://dashiest-frazzledly-vihaan.ngrok-free.dev/swagger/`.

O endereço do ngrok muda quando o túnel reinicia. Para atualizar a cópia com o endereço novo:

```bash
curl -s -H "ngrok-skip-browser-warning: 1" -H "Accept: application/openapi+json" \
  "<url-do-backend>/swagger/?format=openapi" -o docs/api/openapi.json
npx biome format --write docs/api/openapi.json
```

## Endpoints que o site usa

| Fluxo                 | Método e rota                                        | Observação                                                                   |
| --------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| Login                 | `POST /token/`                                       | `username`, `password` (+ `recaptcha_token`/`recaptcha_token_v2`). JWT       |
| Renovar sessão        | `POST /token/refresh/`                               | `refresh` → `access`                                                         |
| Validar token         | `POST /token/verify/`                                | `token`                                                                      |
| Cadastro              | `POST /signup/` (raiz, público)                      | campos em `cadastro-aceite-contrato.md`; `user/signup/` é só do Corp (admin) |
| Esqueci a senha       | `POST /user/forgot-password/`                        | corpo não documentado no Swagger                                             |
| Trocar senha          | `POST /user/change-password/`                        | corpo não documentado no Swagger                                             |
| Meus dados e endereço | `GET /user/retrieve/{id}/`, `PUT /user/update/{id}/` | nome, e-mail, CPF, telefone e um único endereço (`cep`, `street`…)           |
| Créditos              | `GET /wallet/movements/`                             | usuário web (perfil 4) vê só a própria carteira                              |
| Pedidos               | `GET /order/list/`, `GET /order/retrieve/{id}/`      | perfil 4 vê só os próprios pedidos                                           |

Autenticação: header `Authorization: Bearer <access>`.

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
- O usuário tem **um** endereço nos campos do próprio cadastro; a tela de endereços do redesign permite vários.
- Não há rota de "meu usuário" (`/me`): o `id` precisa vir do token ou do login.
- Recuperação de senha por código e troca obrigatória no próximo acesso (CKCORP1-63) não aparecem no contrato.
- O Swagger declara `http` como esquema; em produção a API precisa ser `https`.
