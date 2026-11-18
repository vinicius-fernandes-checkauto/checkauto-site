# Checkauto Site

Site público da Checkauto (varejo). React Router v8 em modo framework, Vite e Tailwind CSS v4.

As páginas são geradas como HTML estático no build (`ssr: false` e `prerender: true` em `react-router.config.ts`). Não há servidor em produção: o conteúdo de `build/client` é publicado como arquivos estáticos.

## Comandos

```bash
yarn install    # instala as dependências
yarn dev        # servidor de desenvolvimento em http://localhost:5173
yarn typecheck  # gera os tipos das rotas e roda o TypeScript
yarn build      # gera o site estático em build/client
yarn lint       # Biome: formatação, lint, ordem dos imports e das classes do Tailwind
yarn format     # Biome: corrige o que for possível
```

No VS Code, instale as extensões recomendadas (Biome e EditorConfig): o arquivo é formatado ao salvar.

## Estrutura

```
app/
  root.tsx                 HTML base, metadados globais, página de erro
  routes.ts                rotas geradas a partir de app/routes (flatRoutes)
  routes/                  uma rota por arquivo; só compõe o que vem de features e shared
    _site.tsx              layout das páginas do site (cabeçalho e rodapé)
    _site._index.tsx       home (/)
  assets/                  imagens importadas pelos componentes (o Vite gera o nome com hash)
  features/<módulo>/       tudo que é de um assunto do site
    components/            seções e componentes do módulo
    services/              chamadas à API do módulo
    hooks/                 hooks do módulo
    types/                 tipos do módulo
    utils/                 funções puras do módulo
  shared/                  o que é usado por mais de um módulo
    components/ui/         componentes do shadcn/ui, ajustados ao tema
    components/layout/     cabeçalho, rodapé e blocos de página
    config/                dados fixos do site (menu, contatos, SEO)
    hooks/
    lib/                   integrações e helpers de bibliotecas (cn)
    services/              cliente HTTP e chamadas à API usadas por vários módulos
    styles/app.css         tema do Tailwind e do shadcn
    types/
    utils/                 funções puras, sem chamadas externas
```

`public/` guarda só o que precisa de um endereço fixo (favicon, ícones do sistema, `robots.txt`).

As pastas são criadas quando o primeiro arquivo entra nelas; não deixe pastas vazias.

### Convenções

- **Rotas finas.** O arquivo em `app/routes` define `meta`, `loader` e o layout da página, e monta as seções importadas de `features`. Regra de negócio e componentes ficam fora de `routes`.
- **Páginas do site dentro de `_site`.** Uma página nova com cabeçalho e rodapé é `_site.<nome>.tsx` (por exemplo, `_site.planos.tsx` → `/planos`). O `_` deixa o layout fora da URL.
- **`services` faz chamadas externas, `utils` não.** Funções puras ficam em `utils`; qualquer `fetch` fica em `services`.
- **Do módulo para o `shared`, nunca o contrário.** Um módulo pode importar de `shared`. O `shared` não importa de `features`. Quando algo de um módulo passa a ser usado por outro, ele sobe para `shared`.
- **Componentes do shadcn.** `npx shadcn add <componente>` instala em `shared/components/ui`. Depois de instalar, ajuste ao tema: altura mínima de 44px, anel de foco sem opacidade, sem classes `dark:` e sem `"use client"` (diretiva do Next). Troque também `import { cn } from "cn"` por `import { cn } from "~/shared/lib/utils"`.
- **Ícones só de `~/shared/components/icons`.** Todo ícone usado no site é re-exportado do `lucide-react` nesse arquivo; para usar um ícone novo, acrescente-o lá. O Biome bloqueia import direto de `lucide-react` em qualquer outro arquivo.
- **`cn` do projeto.** Use o `cn` de `~/shared/lib/utils`. Ao criar tokens próprios de tamanho de texto (`text-*`) ou sombra (`shadow-*`) no tema, inclua-os em `createCn`: o pacote `cn` puro não os conhece e, ao juntar um tamanho próprio com uma cor, descarta o tamanho.

### Tema (manual de marca 2026)

Fonte única: **Poppins** (400 a 800), servida pelo próprio site via Fontsource. Cores do manual: azul `#002E55` (`brand-blue`), azul de apoio `#002647` (`brand-blue-dark`), verde `#66C61C` (`brand-green`), verde escuro `#008143` (`brand-green-dark`) e branco. Os componentes usam os papéis do shadcn (`primary`, `secondary`, `muted`, `ring`…) mais `heading`, `highlight`, `success`, `warning` e `info`.

Cantos arredondados: raio-base `--radius: 1rem` (16px), com a escala do shadcn derivada dele (`rounded-sm` a `rounded-4xl`). Botões e campos usam pílula (`rounded-full`). O `app.css` também traz os tokens de gráfico (`chart-1` a `chart-5`) e de barra lateral (`sidebar-*`) que os componentes do shadcn esperam.

Regras de acessibilidade (WCAG AA, contraste medido):

- O verde `#66C61C` é fundo de botão (`primary`) com texto azul (6,35:1) ou destaque sobre o azul. **Nunca texto branco sobre verde nem verde como texto em fundo claro** (2,2:1).
- Verde como texto em fundo claro é o verde escuro do manual (`highlight`, 4,97:1 no branco, 4,63:1 no `muted`).
- O foco usa `ring`: azul em fundo claro, verde em fundo escuro.
- Bordas de campo (`input`) têm 3:1 com o fundo.
- Seções escuras usam a classe `surface-inverse`, que troca todos os papéis para o fundo azul. Painéis que abrem dentro de uma seção escura sem portal usam `surface-default`.
- Sem modo escuro.
