# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Checkauto Site — spec para IA

Contexto, regras e critérios para qualquer IA (ou pessoa) que for mexer neste projeto. Leia inteiro antes da primeira alteração. Quando uma regra daqui conflitar com um hábito seu, vale a regra daqui.

## 1. O que é

Site público da **Checkauto** (grupo Forrisk): consulta de histórico veicular pela placa, vendida em pacotes (Standard, Master, Plus). O projeto é o **redesign** do site, com três áreas:

| Área            | Rotas                                                                                        | Layout                 |
| --------------- | -------------------------------------------------------------------------------------------- | ---------------------- |
| Site público    | `/`, `/pacotes/:planId`, `/faq`, `/contato`, `/carrinho`, páginas institucionais e jurídicas | `app/routes/_site.tsx` |
| Autenticação    | `/entrar`, `/cadastro`, `/redefinir-senha`                                                   | `app/routes/_auth.tsx` |
| Área do cliente | `/conta` (redireciona), `/conta/consultas`, `/conta/meus-dados`, `/conta/transacoes`         | `app/routes/conta.tsx` |

**Fase atual: só interface.** Nada de integração com API, login real, pagamento ou envio de formulário. Estado de demonstração (dados fixos e `useState`) é o esperado. Ao entregar, diga quando a tela sugere um comportamento real que ainda não existe, como "Mensagem enviada".

## 2. Stack

- **React Router 8** em modo framework, `ssr: false` + `prerender`. As páginas viram HTML estático no build; não há servidor. Rotas dinâmicas pré-renderizadas entram em `react-router.config.ts`, como os pacotes.
- **React 19**, **TypeScript**, **Vite 8**.
- **Tailwind CSS v4**, com o tema em `app/app.css`. Não existe `tailwind.config`.
- **shadcn/ui** (estilo `radix-maia`, Radix) em `app/shared/components/ui`.
- **GSAP** + ScrollTrigger via `~/shared/lib/gsap` (`gsap`, `ScrollTrigger`, `useGSAP`, `MOTION_OK`).
- **React Hook Form** + **zod 4** (`@hookform/resolvers/zod`) para todos os formulários.
- **lucide-react**, mas só importado por `~/shared/components/icons`.
- **Biome** para lint, formatação e ordem de imports e de classes. **Vitest** para testes.
- Deploy na **Vercel** como site estático (`vercel.json`, `installCommand: npm install`).

## 3. Comandos

```bash
npm run dev                         # desenvolvimento
npm run typecheck                   # tipos das rotas + tsc
npm run lint                        # biome check
npm run format                      # biome check --write no projeto todo
npx biome check --write --unsafe <arquivos>   # corrige formatação e ordena classes
npm run build                       # build + prerender de todas as rotas
npm test                            # vitest
npx vitest run app/shared/utils/plate.test.ts   # um arquivo de teste
npx vitest run -t "<nome do teste>"             # um teste pelo nome
```

- O Vitest só pega `app/**/*.test.ts` (não `.tsx`). Teste fica ao lado do arquivo testado.
- O `build` copia `build/client/__spa-fallback.html` para `404.html`, que é a página de erro servida pela Vercel.
- `vercel.json` manda `X-Robots-Tag: noindex, nofollow` em tudo: o redesign ainda não deve ser indexado. Não remova sem o dono pedir.

Antes de dizer que terminou: **typecheck e Biome sem erro**. Se mexeu em rota, import ou estrutura, rode também o **build**, que pré-renderiza tudo e pega import quebrado.

## 4. Estrutura

```
app/
  app.css                tema (tokens do DS) — único arquivo de estilo global
  root.tsx               HTML base, metadados, página de erro
  routes/                um arquivo por rota; só monta a página com peças de features/ e shared/
  assets/                imagens importadas (o Vite gera hash); prefira .webp
  features/
    site/                site público
      components/        seções da home, header/footer do site, página do pacote, carrinho, contato, jurídico
      lib/               dados e funções do site (cart, contact, legal, plan-selection)
      content/           textos longos (termos, privacidade, aviso legal)
    auth/components/     formulários e painel visual do login/cadastro
    account/
      components/        header, sidebar, menu, cards e diálogos da área do cliente
      lib/               dados de demonstração, schemas e helpers da conta
  shared/                só o que mais de uma área usa
    components/          logo, ícones, BrandAvatar, SkipLink, ErrorPage, LicensePlate
    components/ui/       shadcn ajustado ao tema
    config/              dados fixos: planos, FAQ, navegação, empresa
    hooks/               useMediaQuery, useScrolled
    lib/                 cn, gsap
    utils/               funções puras (placa, iniciais, telefone)
```

O contrato da API do backend fica em `docs/api/` (`openapi.json` + `README.md` com os endpoints que o site usa e o que falta confirmar).

Rotas:

- `app/routes.ts` usa `flatRoutes()`: a URL sai do **nome do arquivo**. Ponto vira `/`, `$` é parâmetro e o prefixo `_` cria um layout sem segmento na URL (`_site.faq.tsx` → `/faq`, dentro de `_site.tsx`; `conta.consultas.tsx` → `/conta/consultas`, dentro de `conta.tsx`).
- Página nova do site público: `_site.<nome>.tsx`. Rota com parâmetro precisa listar os caminhos no `prerender` de `react-router.config.ts`, senão não vira HTML.

Regras de organização:

- `features/*` pode importar de `shared/`; **`shared/` nunca importa de `features/`**.
- Dentro de cada área ficam só pastas por tipo (`components`, `lib`, `content`, `hooks`). **Sem subpastas por página.**
- Algo vai para `shared/` só quando **mais de uma área** usa. Se só o site usa, fica em `features/site`.
- Arquivo de rota fica enxuto: `meta`, estado da página e composição. Blocos grandes viram componentes na feature.
- Imports sempre absolutos com `~/`. Relativo só entre arquivos da mesma pasta.
- Nomes de arquivo em kebab-case; componente com o mesmo nome do arquivo (`site-header.tsx` → `SiteHeader`).
- Ícones: adicione o ícone do lucide ao `export` de `~/shared/components/icons.tsx`, em ordem alfabética, e importe de lá. O Biome bloqueia `lucide-react` direto.
- `cn` vem de `~/shared/lib/utils`. O Biome bloqueia o pacote `cn` direto.
- Componente novo do shadcn: `npx shadcn add <componente>` instala em `shared/components/ui`. Depois ajuste ao tema: altura mínima de 44px, anel de foco sem opacidade, sem classes `dark:`, sem `"use client"` e com `cn` de `~/shared/lib/utils`.
- Formatação do Biome: tabs, aspas duplas, linha de 80 colunas. Imports em grupos: pacotes, depois `~/`, depois relativos, com linha em branco entre eles.

## 5. Design system

### Cores da marca (fixas)

| Token              | Hex       | Uso                                                                                        |
| ------------------ | --------- | ------------------------------------------------------------------------------------------ |
| `brand-blue`       | `#002E55` | títulos (`text-heading`), superfícies escuras, `secondary`                                 |
| `brand-blue-dark`  | `#002647` | texto base (`foreground`)                                                                  |
| `brand-green`      | `#66C61C` | **só destaque**: preenchimentos decorativos, gráficos, ícones e arcos, detalhes sobre azul |
| `brand-green-dark` | `#008143` | **botões e ações** (`primary`), texto de destaque (`text-highlight`)                       |
| branco             | `#FFFFFF` |                                                                                            |

Regras de cor:

- **Botão é `bg-primary` (#008143).** O verde claro #66C61C nunca vai em fundo de botão nem em texto pequeno sobre fundo claro, porque não passa em contraste.
- **Tons claros saem da cor da marca com opacidade**, não da paleta do Tailwind: `bg-brand-blue/6`, `bg-brand-green/15`, `border-brand-green/50`, `--alpha(var(--color-brand-blue)/35%)` em sombras. Evite `green-50`, `navy-50` e `slate-*` em UI nova, salvo semântica (erro, alerta).
- Tom claro opaco, para cards sobre formas decorativas: `bg-[color-mix(in_oklab,var(--color-brand-green)_12%,var(--card))]`.
- Fundo de página e seção: `bg-background` (#F3F5F2). Cards: `bg-card`. Bordas: `border-border`.

### Tokens

Use **só os tokens semânticos do shadcn** definidos em `:root` do `app/app.css`: `background`, `foreground`, `heading`, `card`, `muted`, `muted-foreground`, `primary`, `secondary`, `accent`, `highlight`, `destructive`, `border`, `ring`.

- **Não crie tokens novos** (`bg-paper`, `border-hairline`) nem estilos de texto globais (`text-h2`). Se um conjunto de classes se repete em vários lugares, **pergunte antes** de extrair um estilo global.
- Raio base `--radius: 1rem`. Cards usam `rounded-3xl`/`rounded-4xl`; botões, campos e chips usam `rounded-full`.

### Tipografia

- **Poppins** 400/500/600 (`font-sans` e `font-heading`). Os títulos (`h1`–`h6`) já saem com `text-heading` e `text-balance` pela base.
- Tipografia inline com a escala do Tailwind, por exemplo:
  - título de página: `text-3xl/tight font-medium tracking-tight lg:text-4xl/tight`;
  - título de seção: `text-4xl`–`5xl`, `font-medium tracking-tight`;
  - corpo: `text-[0.9375rem]/6` ou `text-base/relaxed text-muted-foreground`;
  - rótulo: `text-[0.8125rem] font-medium`.
- Eyebrow de seção: `<SectionEyebrow>`, que usa caixa alta, `tracking-widest` e `text-highlight`. Sem ícone.

### Componentes-base

**Sempre que possível, use componentes do shadcn ajustados ao nosso DS** em vez de montar o elemento na mão. Não espalhe nem repita blocos de classes: quando um elemento de UI aparece em mais de um lugar (botão, badge, chip, checkbox, radio, switch, input, tabs, tooltip…), ele vira componente.

- Existe no shadcn? Instale com `npx shadcn add <componente>` em `shared/components/ui` e ajuste ao tema (veja a seção 4). As variações entram como `variant`/`size` (`cva`), não como classes soltas em cada uso.
- Não existe no shadcn ou é específico de uma área? Crie o componente na pasta `components/` da área, ou em `shared/components` se mais de uma área usar.
- Componentize quando houver repetição ou regra própria; não crie abstração para um uso único.
- Essa regra é sobre componentes React. Estilo global em CSS (classes utilitárias novas, `text-h2`) continua precisando de aprovação antes.

- **Button** (`~/shared/components/ui/button`). Variantes: `default` (verde escuro), `secondary` (azul), `outline`, `ghost`, `destructive`, `link`. Tamanhos: `default` h-12, `sm` h-11, `lg` h-14, `icon`, `icon-sm`. Área de toque mínima de 44px (`min-h-11`).
- **Dialog**, **Sheet**, **DropdownMenu**, **Accordion** do shadcn.
- **BrandAvatar** (`~/shared/components/brand-avatar`): iniciais sobre azul com o arco verde da marca em volta. O tamanho vem pelo `className`, e o arco e o texto acompanham.
- **CheckautoLogo**: `variant="default" | "white"`.
- **HeaderCart** (site), **AccountMenu** (conta), **AccountPageHeader** (título, descrição e ação das páginas da conta).
- Campos de formulário: `h-11 rounded-full border-border bg-card px-4.5 text-sm`, com label acima (`px-1 text-[0.8125rem] font-medium`) e erro embaixo em `text-destructive`.

### Elementos da marca

- **Arcos da marca, não bolhas nem blobs.** Use o símbolo `~/assets/brand/symbol-ring-blue.webp` como máscara (`style={{ maskImage: url(...) }}` + `mask-contain mask-no-repeat`), pintado com `bg-brand-green/20` e afins. Também existe `symbol-ticks.webp`.
- Estilo: **moderno, limpo, orgânico**. Muito respiro, poucos textos, cards arredondados, detalhes em verde sobre azul.

## 6. Layout e responsividade

- Container: `mx-auto w-full max-w-7xl px-4 sm:px-8`.
- Breakpoint principal: `lg`. O mobile empilha; o desktop ganha grids e colunas.
- **Seções da home cabem no viewport do desktop**, até cerca de 1366×657, **só com CSS**:
  - Seção: `lg:min-h-svh` + flex centralizado. Use `min-h`, não `h` fixo.
  - Hero: desconta o header, com `lg:min-h-[calc(100svh-4.75rem-1px)]`.
  - Blocos consecutivos da mesma seção: `lg:min-h-[min(100svh,40rem)]`, para não sobrar vazio em telas altas.
  - **Nunca** use GSAP, `useEffect` ou medição em JS para dimensionar.
  - Mantenha conteúdo moderado (≲ 560px de altura) e confira em 1366×657, 1536×730 e 1920×969.
- **Header do site**: sticky só abaixo de `lg`, com sombra ao rolar (`useScrolled`). No desktop ele rola junto com a página.
- **Header da conta**: branco, sticky em todos os tamanhos, com sombra ao rolar.
  - Desktop: só "Ajuda". "Nova consulta" fica no topo do menu da conta, em destaque.
  - Mobile: só o avatar, que abre o `AccountMenu`.
  - A sidebar da conta só aparece em `lg`.
- Sem rolagem horizontal no mobile (confira em 360/375/390). Tabelas largas ficam dentro de um contêiner `relative min-w-0 overflow-x-auto`.

## 7. Movimento

- GSAP serve para entrada, contagem de números e flutuação, sempre dentro de `gsap.matchMedia().add(MOTION_OK, ...)` e com `useGSAP`.
- Animação simples vai em CSS/Tailwind (`@theme` em `app/app.css` já tem `marquee` e `pdf-scroll`).
- `prefers-reduced-motion` é respeitado globalmente. Toda animação precisa ter um estado final estático que faça sentido.

## 8. Acessibilidade

- Cada layout tem `<SkipLink />` e `<main id="conteudo">`.
- Um `h1` por página. Seções com `aria-labelledby`.
- Textos de acessibilidade em português (`aria-label`, `sr-only`). Botões de ícone sempre com `sr-only`.
- Foco visível (já global: `outline-3 outline-ring`). Toque mínimo de 44px.
- Formulário: `noValidate`, React Hook Form + zod (veja a seção 10.1). Erro ligado ao campo com `aria-invalid` e `aria-describedby` (`errorProps`); o foco no primeiro campo inválido vem do próprio React Hook Form.
- Prévias animadas usam `role="img"` com `aria-label` descrevendo a cena.
- Contraste: texto pequeno nunca em #66C61C sobre fundo claro.

## 9. Conteúdo e linguagem

- Português do Brasil, tom direto e confiável. Pouco texto por bloco.
- Diga **"veículo"**, não "carro".
- Não cite a **DEKRA**.
- Não use **"lojista"** no header nem na navegação.
- Pacotes sempre em **ordem crescente de preço**: Standard → Master → Plus. Os dados ficam em `~/shared/config/plans.ts` e servem de fonte única para preço, itens e links (`/pacotes/checkauto-*`).
- Números da empresa: abreviados e grandes ("+250 mil", não o número cheio).
- Placa de exemplo: `ABC1D23` (Mercosul).

## 10. Código

- **Não escreva comentários** no código: nada de JSX `{/* */}`, JSDoc ou `//`. Explique as decisões na conversa. **Não apague** comentários nem código comentado que já existam, porque são do dono do projeto.
- Componentes como `function` nomeada e exportada. Props tipadas com `type XProps`.
- Estado derivado em vez de `useEffect`. Para assinar eventos do navegador, use `useSyncExternalStore` (veja `use-scrolled.ts` e `use-media-query.ts`).
- Classes condicionais com `cn(...)`. O Biome ordena as classes, então rode `--write --unsafe`.
- Dados fixos e de demonstração ficam em `lib/` ou `config/`, nunca soltos no JSX.
- Não adicione dependência sem necessidade clara. Prefira o que já está no projeto.

### 10.1 Formulários (regra)

**Todo formulário usa React Hook Form com zod.** Não valide à mão com `useState`, `FormData` ou `safeParse` no `onSubmit`, e não use `required`, `minLength` e afins do HTML para validar.

- O schema zod fica no `lib/` da área (`features/<área>/lib/*.ts`) ou em `shared/utils` quando é genérico, como a placa. As mensagens são em português e no imperativo ("Informe o CEP.").
- `useForm({ resolver: zodResolver(schema), defaultValues })`. Quando o schema transforma valores (máscaras, `trim`, `toUpperCase`), tipe como `useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>` e exporte os dois tipos do `lib/`.
- `<form noValidate onSubmit={handleSubmit(submit)}>`; o `submit` recebe os dados já validados e transformados.
- Ligue os campos com `{...register("campo")}`. Para máscara, use `withMask(register("campo"), formatador)` de `~/shared/lib/form` (telefone, CEP, CPF, placa, código).
- Erros: `errors.campo?.message` no `FormField` (conta), no `AuthField`/`PasswordField`/`TermsCheckbox` (auth) ou no componente do site. Para as props de acessibilidade, use `errorProps(id, errors.campo)`.
- Erro que vem da regra de negócio, como cupom inválido ou placa repetida: `setError("campo", { message }, { shouldFocus: true })`.
- Campo condicional, como a inscrição estadual quando a empresa é isenta: `register("campo", { disabled })` + `watch`, e o schema trata o valor opcional (`.optional()` + `refine`).
- Depois do envio: `reset()` para limpar, e estado local só para a tela de sucesso (`sent`, `done`).

### 10.2 Integração com a API

- Componentes e rotas **nunca importam `axios`** (o Biome bloqueia). Use `getHttpClient()` de `~/shared/api` dentro de um serviço.
- O cliente é criado só na primeira chamada e só no navegador. O prerender roda em Node e **nunca** chama a API: chame em `clientLoader`, evento ou efeito, não no nível do módulo.
- Erros chegam sempre como `ApiError` (`code`, `status`, `details`), com mensagem padrão em português. Erros de campo do Django REST ficam em `details`.
- Variáveis: copie `.env.example` para `.env`. Tudo que começa com `VITE_` vai para o bundle público, então **nunca** coloque segredo nelas.
- O contrato da API está em `docs/api/`.

## 11. Fluxo de trabalho

1. Mudança visual grande, como seção nova ou página nova: **prototipe primeiro** (Claude Design) e só implemente depois da aprovação.
2. Implemente seguindo esta spec.
3. Rode `typecheck` e `biome` (e o `build` quando a estrutura mudar).
4. Confira no navegador: desktop nas três alturas acima e mobile 375. Verifique que não há rolagem lateral.
5. **Commit, push e deploy só quando o dono pedir.** Deploy de produção: `vercel deploy --prod --yes`.

## 12. Critérios de pronto

- [ ] Segue as cores, os tokens e a tipografia desta spec, sem tokens novos e sem paleta do Tailwind.
- [ ] Cabe no viewport do desktop (home) e não rola para os lados no mobile.
- [ ] Acessível: foco, labels, `h1` único, toque de 44px, reduced motion.
- [ ] Componentes na pasta certa (`site`, `auth`, `account` ou `shared`) e rota enxuta.
- [ ] Formulários com React Hook Form + zod (seção 10.1).
- [ ] Sem comentários novos no código.
- [ ] Typecheck, Biome e (quando necessário) build passando.
- [ ] Na entrega, apontar o que é só interface e o que ficou pendente.
