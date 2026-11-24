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
cp .env.example .env                # variáveis locais (o .env não vai para o git)
npm run dev                         # desenvolvimento
npm run typecheck                   # tipos das rotas + tsc
npm run lint                        # biome check
npm run format                      # biome check --write no projeto todo
npx biome check --write --unsafe <arquivos>   # corrige formatação e ordena classes
npm run build                       # build + prerender de todas as rotas
npm test                            # vitest
npx vitest run app/shared/utils/plate.test.ts # um arquivo de teste
npx vitest run -t "<nome do teste>"             # um teste pelo nome
```

- O Vitest só pega `app/**/*.test.ts` (não `.tsx`). Teste fica ao lado do arquivo testado.
- `.env.example` vai para o git e tem **só nomes e comentários, nunca valores** (nem chaves públicas). Os valores ficam no `.env` local de cada um. Prefixo `VITE_` vai para o bundle do navegador: segredo nunca leva `VITE_`.
- O `build` copia `build/client/__spa-fallback.html` para `404.html`, que é a página de erro servida pela Vercel.
- `robots.txt` é arquivo fixo em `public/`. O sitemap entra no lançamento como resource route pré-renderizada (`app/routes/sitemap[.]xml.ts` com `loader` que devolve o XML), como a documentação do React Router orienta.
- Metadados de SEO: `seo({ title, description, path, image, noIndex })` de `~/shared/lib/seo` devolve título, description, canonical, Open Graph e Twitter. Use no `meta` das rotas. A Organization (JSON-LD) já sai no `root.tsx`.
- `vercel.json` manda `X-Robots-Tag: noindex, nofollow` em tudo: o redesign ainda não deve ser indexado. Não remova sem o dono pedir.

Antes de dizer que terminou: **typecheck e Biome sem erro**. Se mexeu em rota, import ou estrutura, rode também o **build**, que pré-renderiza tudo e pega import quebrado.

## 4. Estrutura

```
app/
  app.css                tema (tokens do DS) — único arquivo de estilo global
  root.tsx               HTML base, metadados, página de erro
  routes/                um arquivo por rota; só monta a página com peças de features/ e shared/
  @assets/
    brand/               logos e símbolos da marca
    clients/              logos de clientes
                          demais imagens soltas nesta pasta
  @content/              dados e textos fixos do site: planos, FAQ, navegação, empresa (futuro Sanity)
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
    components/          logo, ícones, BrandAvatar, SkipLink, ErrorPage, LicensePlate, PlansComparison
    components/ui/       shadcn ajustado ao tema
    hooks/               useMediaQuery, useScrolled
    lib/                 código de apoio: cn, gsap
    utils/               funções reutilizáveis: form, placa, telefone
```

`lib` e `utils` são **código**; `content` são **dados**. O `@content/` da raiz fica isolado de propósito, porque vai ser substituído pelo Sanity: ele **não importa nada** de `features/` nem de `shared/` (tipos ficam no próprio arquivo), e quem lê dele são as features e o `shared/`. Configuração fica em `lib/`. Esse é o mesmo padrão dos outros projetos do time e do shadcn (`lib/utils`).

O contrato da API do backend fica em `docs/api/` (`openapi.json` + `README.md` com os endpoints que o site usa e o que falta confirmar).

Rotas:

- `app/routes.ts` usa `flatRoutes()`: a URL sai do **nome do arquivo**. Ponto vira `/`, `$` é parâmetro e o prefixo `_` cria um layout sem segmento na URL (`_site.faq.tsx` → `/faq`, dentro de `_site.tsx`; `conta.consultas.tsx` → `/conta/consultas`, dentro de `conta.tsx`).
- Página nova do site público: `_site.<nome>.tsx`. Rota com parâmetro precisa listar os caminhos no `prerender` de `react-router.config.ts`, senão não vira HTML.

Regras de organização:

- `features/*` pode importar de `shared/` e de `@content/`; **`shared/` nunca importa de `features/`**; **`@content/` não importa de ninguém**.
- Dentro de cada área e em `shared/` ficam só pastas por tipo (`components`, `content`, `hooks`, `lib`, `utils`; `shared/` não tem `content`). **Sem subpastas por página.** Não crie pasta nova (`config`, `helpers`, `constants`) sem combinar antes.
- Algo vai para `shared/` só quando **mais de uma área** usa. Se só o site usa, fica em `features/site`.
- Arquivo de rota fica enxuto: `meta`, estado da página e composição. Blocos grandes viram componentes na feature.
- Imports sempre absolutos com `~/`. Relativo só entre arquivos da mesma pasta.
- Nomes de arquivo em kebab-case; componente com o mesmo nome do arquivo (`site-header.tsx` → `SiteHeader`).
- Ícones: adicione o ícone do lucide ao `export` de `~/shared/components/icons.tsx`, em ordem alfabética, e importe de lá. O Biome bloqueia `lucide-react` direto.
- `cn` vem de `~/shared/lib/utils`. O Biome bloqueia o pacote `cn` direto.
- Componente novo do shadcn: `npx shadcn add <componente>` instala em `shared/components/ui`. Depois ajuste ao tema: altura mínima de 44px, anel de foco sem opacidade, sem classes `dark:`, sem `"use client"` e com `cn` de `~/shared/lib/utils`.
- Formatação do Biome: tabs, aspas duplas, linha de 80 colunas. Imports em grupos: pacotes, depois `~/`, depois relativos, com linha em branco entre eles.

## 5. Design system

### Regra: todo estilo vem do DS

**Cor, raio, borda, sombra, tipografia e espaçamento saem sempre do design system**, nunca de um valor solto no código. Isso é regra, para o visual não ficar inconsistente.

- Use só classes que apontam para os tokens de `app/app.css` ou para a escala padrão do Tailwind: `bg-primary`, `text-heading`, `border-border`, `rounded-3xl`, `rounded-full`, `text-sm`, `font-medium`, `gap-4`.
- **Proibido em código novo:**
  - valores arbitrários de estilo: `text-[0.9375rem]`, `rounded-[1.75rem]`, `shadow-[…]`, `bg-[#…]`, `bg-[color-mix(…)]`;
  - cor em hex, `rgb()` ou `oklch()` dentro de componente;
  - `style={{ … }}` para cor, raio, borda, sombra ou fonte;
  - paleta crua do Tailwind em UI (`slate-300`, `navy-50`, `green-50`). Use os tokens semânticos ou a cor da marca com opacidade.
- **Permitido:**
  - opacidade sobre token, como `bg-brand-blue/6` e `border-brand-green/50`;
  - a máscara dos arcos da marca (`style={{ maskImage: url(...) }}`);
  - valores de **posição e tamanho de layout**, que não são estilo visual: `top-[17%]`, `w-[min(…)]`, `lg:min-h-[calc(100svh-…)]`, `cqw`.
- **Tokens têm a nomenclatura do shadcn e não se criam tokens novos.** Os nomes são os do shadcn/Tailwind (`background`, `card`, `primary`, `muted-foreground`, `border`, `ring`, `--radius`, `shadow-*`, `text-*`) mais os da marca que já existem (`heading`, `highlight`, `brand-*`).
- **Faltou um valor?** Não use arbitrário nem crie token. **Ajuste o valor do token que já existe** em `app/app.css` (`:root` ou `@theme`) para seguir o padrão visual do DS, ou use o degrau mais próximo da escala.
- **Dívida conhecida:** o código ainda tem valores soltos, anteriores a esta regra:
  - cerca de 85 tamanhos de texto arbitrários (`0.625rem`, `0.6875rem`, `0.8125rem`, `0.9375rem`, `1.75rem`, `2.75rem`);
  - 23 sombras arbitrárias, 3 `color-mix` e 4 raios arbitrários;
  - 8 cores em hex nos componentes e usos de `navy-*`/`slate-*`.

  Ao mexer num arquivo, troque pelo degrau mais próximo da escala ou do token existente (por exemplo `text-[0.8125rem]` → `text-sm`, `shadow-[…]` → `shadow-*` do tema), **sem criar token**. Se a troca mudar demais o visual, ajuste o valor do token no `app.css` em vez de manter o arbitrário.

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
- Tom claro opaco, para cards sobre formas decorativas: hoje usa `color-mix` inline (dívida). Em código novo, use um token existente (`bg-accent`, `bg-muted`, `bg-card`) ou a cor da marca com opacidade.
- Fundo de página e seção: `bg-background` (#F3F5F2). Cards: `bg-card`. Bordas: `border-border`.

### Tokens

Use **só os tokens semânticos do shadcn** definidos em `:root` do `app/app.css`: `background`, `foreground`, `heading`, `card`, `muted`, `muted-foreground`, `primary`, `secondary`, `accent`, `highlight`, `destructive`, `border`, `ring`.

- **Não crie tokens novos** (`bg-paper`, `border-hairline`, `text-h2`, `shadow-card`). Os tokens seguem a nomenclatura do shadcn; para mudar o visual, ajuste o **valor** dos tokens existentes no `app.css`. Se um conjunto de classes se repete, extraia um **componente** (seção 5, Componentes-base), não um token.
- Raio base `--radius: 1rem`. Cards usam `rounded-3xl`/`rounded-4xl`; botões, campos e chips usam `rounded-full`.

### Tipografia

- **Poppins** 400/500/600 (`font-sans` e `font-heading`). Os títulos (`h1`–`h6`) já saem com `text-heading` e `text-balance` pela base.
- Tipografia com a escala do Tailwind, por exemplo:
  - título de página: `text-3xl/tight font-medium tracking-tight lg:text-4xl/tight`;
  - título de seção: hoje `lg:text-[2.75rem]/[1.1]` (dívida: passar para o degrau da escala, como `lg:text-5xl`, ajustando o valor do degrau no `@theme` se precisar);
  - corpo: `text-base/relaxed text-muted-foreground` ou `text-sm/6`;
  - rótulo: `text-sm font-medium`.
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

- **Arcos da marca, não bolhas nem blobs.** Use o símbolo `~/@assets/brand/symbol-ring-blue.webp` como máscara (`style={{ maskImage: url(...) }}` + `mask-contain mask-no-repeat`), pintado com `bg-brand-green/20` e afins. Também existe `symbol-ticks.webp`.
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
- Formulário: `noValidate`, React Hook Form + zod com os componentes `Field` (seção 10.1). Erro ligado ao campo com `aria-invalid` e `aria-describedby` apontando para o `FieldError`; o foco no primeiro campo inválido vem do próprio React Hook Form.
- Prévias animadas usam `role="img"` com `aria-label` descrevendo a cena.
- Contraste: texto pequeno nunca em #66C61C sobre fundo claro.

## 9. Conteúdo e linguagem

- Português do Brasil, tom direto e confiável. Pouco texto por bloco.
- Diga **"veículo"**, não "carro".
- Não cite a **DEKRA**.
- Não use **"lojista"** no header nem na navegação.
- Pacotes sempre em **ordem crescente de preço**: Standard → Master → Plus. Os dados ficam em `~/@content/plans.ts` e servem de fonte única para preço, itens e links (`/pacotes/checkauto-*`).
- Números da empresa: abreviados e grandes ("+250 mil", não o número cheio).
- Placa de exemplo: `ABC1D23` (Mercosul).

## 10. Código

- **Não escreva comentários** no código: nada de JSX `{/* */}`, JSDoc ou `//`. Explique as decisões na conversa. **Não apague** comentários nem código comentado que já existam, porque são do dono do projeto.
- Componentes como `function` nomeada e exportada. Props tipadas com `type XProps`.
- Estado derivado em vez de `useEffect`. Para assinar eventos do navegador, use `useSyncExternalStore` (veja `use-scrolled.ts` e `use-media-query.ts`).
- Classes condicionais com `cn(...)`. O Biome ordena as classes, então rode `--write --unsafe`.
- Dados fixos ficam em `@content/` (o da raiz, ou `content/` da área para textos que só ela usa) e dados de demonstração no `lib/` da área, nunca soltos no JSX.
- Não adicione dependência sem necessidade clara. Prefira o que já está no projeto.

### 10.1 Formulários (regra)

**Todo formulário usa React Hook Form com zod**, montado com os componentes `Field` do shadcn (`~/shared/components/ui/field`). O modelo são as telas de auth (`features/auth`). Não valide à mão com `useState`, `FormData` ou `safeParse` no `onSubmit`, e não use `required`, `minLength` e afins do HTML para validar.

Responsabilidades separadas:

| Peça       | Onde                                                                                                                                               | O que faz                                                                                                                                |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Schema zod | `features/<área>/lib/<área>-schema.ts` (ou `shared/utils` se for genérico, como a placa)                                                           | regras e mensagens, em português e no imperativo ("Informe o CEP."); exporta os tipos `…FormInput`/`…FormOutput` quando há transformação |
| Formulário | `features/<área>/components/<nome>-form.tsx` (`SignInForm`, `SignUpForm`)                                                                          | `useForm`, campos e envio                                                                                                                |
| Rota       | `routes/*.tsx`                                                                                                                                     | só monta: heading, `<XForm />`, links. Nada de `useForm` na rota                                                                         |
| Campos     | `~/shared/components/ui/*` (`Input`, `Checkbox`, `Label`, `Field…`) e compostos de `~/shared/components` (`PasswordInput`, `CpfInput`, `TextLink`) | visual vindo do DS; nada de input estilizado na mão                                                                                      |

Padrão do campo:

```tsx
<Controller
	name="email"
	control={form.control}
	render={({ field, fieldState }) => (
		<Field data-invalid={fieldState.invalid}>
			<FieldLabel htmlFor="email">E-mail</FieldLabel>
			<Input
				{...field}
				id="email"
				type="email"
				aria-invalid={fieldState.invalid}
				aria-describedby={fieldState.error ? "email-error" : undefined}
				autoComplete="email"
			/>
			{fieldState.error && (
				<FieldError id="email-error" errors={[fieldState.error]} />
			)}
		</Field>
	)}
/>;
```

- `const form = useForm({ resolver: zodResolver(schema), defaultValues })`. Com transformação (máscara, `trim`, `toUpperCase`): `useForm<XFormInput, unknown, XFormOutput>`.
- `<form noValidate onSubmit={form.handleSubmit(submit)}>`; o `submit` recebe os dados já validados e transformados.
- Todo campo usa `Controller` + `Field`, com `data-invalid`, `aria-invalid` e `aria-describedby` apontando para o `FieldError`. Label sempre existe (pode ser `sr-only` quando o placeholder já identifica o campo).
- Checkbox do shadcn: `checked={field.value}` e `onCheckedChange={field.onChange}`.
- Máscara: componente próprio em `shared/components` (como `CpfInput`) usando os formatadores de `shared/utils`.
- Erro da regra de negócio (cupom inválido, placa repetida): `form.setError("campo", { message }, { shouldFocus: true })`.
- Campo condicional: `form.watch` + schema com `.optional()` e `refine`.
- Depois do envio: `form.reset()` para limpar, e estado local só para a tela de sucesso (`sent`, `done`).
- Formulários antigos que ainda usam `register`, `FormField` ou `withMask`/`errorProps` migram para este padrão quando forem mexidos.

## 11. Fluxo de trabalho

1. Mudança visual grande, como seção nova ou página nova: **prototipe primeiro** (Claude Design) e só implemente depois da aprovação.
2. Implemente seguindo esta spec.
3. Rode `typecheck` e `biome` (e o `build` quando a estrutura mudar).
4. Confira no navegador: desktop nas três alturas acima e mobile 375. Verifique que não há rolagem lateral.
5. **Commit, push e deploy só quando o dono pedir.** Deploy de produção: `vercel deploy --prod --yes`.

## 12. Critérios de pronto

- [ ] Todo estilo vem do DS (seção 5): sem valores arbitrários de cor, raio, borda, sombra ou tipografia, sem hex e sem paleta crua do Tailwind.
- [ ] Cabe no viewport do desktop (home) e não rola para os lados no mobile.
- [ ] Acessível: foco, labels, `h1` único, toque de 44px, reduced motion.
- [ ] Componentes na pasta certa (`site`, `auth`, `account` ou `shared`) e rota enxuta.
- [ ] Formulários com React Hook Form + zod (seção 10.1).
- [ ] Sem comentários novos no código.
- [ ] Typecheck, Biome e (quando necessário) build passando.
- [ ] Na entrega, apontar o que é só interface e o que ficou pendente.
