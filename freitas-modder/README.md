# Freitas Modder

Loja online de contas modadas e serviços de GTA V: tema vermelho, animações,
carrinho e checkout pelo WhatsApp. Pronta para publicar na Vercel.

## Stack

| | |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Cache Components, páginas estáticas) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| Animações | [Motion](https://motion.dev) + CSS + canvas (brasas) |
| Scroll suave | [Lenis](https://lenis.darkroom.engineering) |
| Carrinho | Zustand (salvo no navegador) |
| Avisos | Sonner |
| Ícones | Lucide + Simple Icons (marcas) |
| Métricas | Vercel Analytics |

## Rodando no computador

Precisa do Node.js 20.9 ou mais novo.

```bash
cd freitas-modder
npm install
npm run dev
```

Abra <http://localhost:3000>.

Outros comandos:

```bash
npm run build      # build de produção
npm run start      # roda o build de produção
npm run lint       # ESLint
npm run typecheck  # checagem de tipos
```

## Onde editar cada coisa

| O quê | Arquivo |
| --- | --- |
| WhatsApp, Discord, redes, e-mail, garantia, horário, números da loja | `src/config/site.ts` |
| Produtos, preços por plataforma, estoque, selos | `src/data/products.ts` |
| Avaliações de clientes | `src/data/testimonials.ts` |
| Perguntas frequentes | `src/data/faq.ts` |
| Termos e garantia | `src/app/termos/page.tsx` |
| Cores, fontes e animações globais | `src/app/globals.css` |

### Produtos

Cada produto tem um `slug` (vira a URL `/contas/<slug>`), uma categoria
(`conta`, `dinheiro` ou `servico`), um tier visual (`starter`, `pro`, `elite`
ou `lendaria`) e uma lista de `variants` com o preço de cada plataforma:

```ts
variants: [
  { platform: "pc", price: 79.9, oldPrice: 119.9 },
  { platform: "playstation", price: 89.9 },
],
```

Se o produto não existir para uma plataforma, é só não colocar a variante: ele
some do filtro dessa plataforma automaticamente.

**Imagens:** por padrão cada produto ganha uma "capa" gerada (gradiente + emblema).
Para usar prints reais, coloque a imagem em `public/produtos/` e informe no
produto, por exemplo `image: "/produtos/conta-elite.jpg"`.

## Como funciona a compra

1. O cliente adiciona produtos ao carrinho (fica salvo no navegador).
2. Em "Finalizar pelo WhatsApp" o site monta a mensagem com itens, plataforma e
   total, e abre a conversa no número configurado em `src/config/site.ts`.
3. Pagamento e entrega acontecem na conversa.

Dá para trocar por pagamento automático depois (PIX via Mercado Pago, por
exemplo) usando um Route Handler do Next.js, sem mudar o visual.

## Publicando na Vercel

1. Na Vercel, clique em **Add New → Project** e importe este repositório.
2. Em **Root Directory**, escolha `freitas-modder`.
3. O framework (Next.js) é detectado sozinho. Clique em **Deploy**.
4. Depois de ligar um domínio próprio, crie a variável de ambiente
   `NEXT_PUBLIC_SITE_URL` (ex.: `https://freitasmodder.com.br`) e faça um novo
   deploy, para o sitemap e as imagens de compartilhamento usarem o domínio certo.
5. Opcional: ative **Analytics** no painel do projeto para ver as visitas.

Sem a variável, o site usa automaticamente o domínio `.vercel.app` do projeto.

## Antes de publicar (checklist)

Os dados abaixo são **exemplos** e precisam ser trocados pelos reais:

- [ ] Número do WhatsApp, link do Discord, redes e e-mail (`src/config/site.ts`)
- [ ] Números da loja: contas entregues, clientes, nota e avaliações (`src/config/site.ts`)
- [ ] Preços, descrições e estoque dos produtos (`src/data/products.ts`)
- [ ] Avaliações: substituir pelas reais dos clientes (`src/data/testimonials.ts`)
- [ ] Prazo de garantia, horário de atendimento e texto dos termos

## Estrutura

```
src/
├── app/                 rotas (home, /contas, /contas/[slug], /termos, 404, SEO)
├── assets/fonts/        fontes usadas nas imagens de compartilhamento
├── components/
│   ├── cart/            carrinho lateral
│   ├── catalog/         catálogo com filtros
│   ├── effects/         animações reutilizáveis (reveal, tilt, brasas, marquee…)
│   ├── icons/           ícones de marcas
│   ├── layout/          navbar, footer, botão do WhatsApp
│   ├── product/         card, capa, seletor de plataforma, bloco de compra
│   ├── sections/        seções da home
│   └── ui/              botões, logo, títulos
├── config/site.ts       dados da loja
├── data/                produtos, avaliações e FAQ
├── lib/                 utilitários (preço, WhatsApp, scroll, imagem OG)
└── store/cart.ts        estado do carrinho
```

## Créditos

- Fontes Anton e Chakra Petch (Google Fonts, licença SIL Open Font License).
- Ícones de marcas do [Simple Icons](https://simpleicons.org) (CC0).
- O Freitas Modder não tem vínculo com a Rockstar Games ou a Take-Two
  Interactive. GTA é marca registrada de seus respectivos donos.
