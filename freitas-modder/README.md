# Freitas Modder

Loja online de dinheiro, up de level, Unlock All com Corrida Modder e contas
prontas de GTA V para PS4 e PS5: tema vermelho, carrinho e pedido pelo
WhatsApp. Publicada na Vercel.

## Stack

| | |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Cache Components, páginas estáticas) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| Animações | [Motion](https://motion.dev) + CSS |
| Scroll suave | [Lenis](https://lenis.darkroom.engineering) |
| Carrinho e console escolhido | Zustand (salvos no navegador) |
| Fontes | Barlow e Barlow Condensed |
| Avisos | Sonner |
| Ícones | Lucide + Simple Icons (marcas) |
| Banco | [Neon](https://neon.tech) (Postgres) + [Drizzle](https://orm.drizzle.team) |
| Login | [Better Auth](https://www.better-auth.com) com Discord |
| Fotos do painel | Vercel Blob |
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
npm run db:generate  # cria a migração depois de mudar src/db/schema.ts
npm run db:test      # testa migrações e produtos num Postgres em memória
```

No computador, sem `DATABASE_URL`, o site usa os produtos iniciais de
`src/data/seed-products.ts` e o painel fica desligado.

## Onde editar cada coisa

| O quê | Arquivo |
| --- | --- |
| WhatsApp, Discord, redes, e-mail, garantia, horário, números da loja | `src/config/site.ts` |
| Produtos, preços, fotos e etiquetas | Painel do site (`/painel`) |
| Produtos que entram na primeira vez | `src/data/seed-products.ts` |
| Prints de entregas (seção "Entregas") | `src/data/proofs.ts` + `public/provas/` |
| Perguntas frequentes | `src/data/faq.ts` |
| Termos e garantia | `src/app/termos/page.tsx` |
| Cores, fontes e animações globais | `src/app/globals.css` |

### Produtos

Os produtos ficam no banco (Neon) e o Freitas mexe neles pelo painel. Na
primeira vez, o banco recebe a tabela dele: dinheiro (20, 50, 100 e 500
milhões), up de level (30, 75, 150 e 500), o combo Unlock All + Corrida Modder
(por personagem) e a conta Level 120, com preço combinado no WhatsApp.

Cada produto tem um endereço (`/loja/<slug>`), uma categoria (dinheiro, level,
combo ou conta), uma cor de card, o destaque grande do card e o preço de cada
console. Hoje o preço é o mesmo nos dois.

- **Sem preço num console:** deixe o campo vazio. O site mostra "Indisponível
  no PS4" (ou PS5) e bloqueia o botão.
- **Preço no WhatsApp:** para algo sem preço fixo (como uma conta única), marque
  essa opção. No lugar do carrinho aparece um botão que pergunta o preço.
- **Esconder:** desligar "Mostrar no site" tira o produto do site sem apagar
  (bom para conta vendida).

**Endereço antigo:** a loja ficava em `/contas`. Esses links continuam
funcionando e levam para `/loja`.

**Console:** o visitante escolhe PS4 ou PS5 na barra do topo, e todos os preços
do site seguem essa escolha (ela fica salva no navegador).

**Imagens:** por padrão cada produto aparece como um painel colorido com o
destaque. Uma foto enviada pelo painel (print da conta, por exemplo) aparece
por trás do destaque. As fotos ficam no Vercel Blob.

**Entregas:** a seção com prints de clientes só aparece quando houver imagens.
Coloque os prints em `public/provas/` e liste em `src/data/proofs.ts`.

## Painel e login com Discord

O painel fica em `/painel`. Só entra quem logar com um Discord liberado. O
botão "Entrar" do site também aparece para clientes (por enquanto só mostra a
foto e o nome).

Para ligar, o projeto na Vercel precisa destas variáveis de ambiente:

| Variável | O que é |
| --- | --- |
| `DATABASE_URL` | Já vem da integração com o Neon |
| `BETTER_AUTH_SECRET` | Chave aleatória que assina as sessões |
| `DISCORD_CLIENT_ID` e `DISCORD_CLIENT_SECRET` | Do app criado no Discord Developer Portal |
| `ADMIN_DISCORD_IDS` | ID do Discord de quem pode usar o painel (vários: separe por vírgula) |

No Discord Developer Portal, em OAuth2, o endereço de retorno (Redirect) é
`https://freitas-modder.vercel.app/api/auth/callback/discord`.

Quem entra sem estar liberado vê o próprio ID do Discord na tela, e é só
colocar esse número em `ADMIN_DISCORD_IDS` e publicar de novo.

**Banco:** as migrações ficam em `drizzle/` e rodam sozinhas no começo de cada
deploy (`scripts/db-setup.ts`). O site guarda o catálogo em cache e atualiza na
hora quando alguém salva no painel.

## Logo

Os arquivos da marca ficam em `public/brand/` (também publicados em
`/brand/...` no site):

| Arquivo | Uso |
| --- | --- |
| `freitas-modder-logo.svg` | Logo principal, para fundo escuro |
| `freitas-modder-logo-fundo-claro.svg` | Logo para fundo claro |
| `freitas-modder-logo-branca.svg` | Toda branca, para usar sobre vermelho ou foto |
| `freitas-modder-logo-vertical.svg` (e `-fundo-claro`) | Versão empilhada |
| `freitas-modder-simbolo.svg` (e `-branco`) | Só o símbolo |
| `freitas-modder-icone.svg` | Ícone de app (quadrado arredondado) |
| `freitas-modder-avatar.svg` | Foto de perfil redonda (Instagram, WhatsApp, Discord) |

O símbolo é um F formado por três faixas inclinadas, como listras de carro de
corrida. O nome usa Barlow Condensed itálico, com "FREITAS" grosso e "MODDER"
mais leve, tudo convertido em contorno (não depende de fonte instalada).
Cores: vermelho `#E8182C`, preto `#09090A` e papel `#F2EFE9`.

## Efeitos

Ficam em `src/components/effects/` e respeitam a opção "reduzir movimento" do
sistema (nesse caso quase tudo fica parado):

- Abertura com a marca e uma cortina vermelha (só na primeira visita da sessão)
- Rastros de luz de carros passando no fundo do topo (canvas, pausa fora da tela)
- Cursor em forma de mira no computador, que vira "Ver" em cima dos produtos
  e "Trocar" em cima do card de trás do topo
- Cards 3D no topo (`src/components/sections/hero-cards.tsx`): cada card tem
  duas faces (PS5 vermelha, PS4 preta), espessura, camadas em alturas
  diferentes, plaquinha holográfica e reflexo que anda com o giro. Ao trocar
  o console, os dois cards giram em cascata; clicar no card de trás também
  troca. Sozinhos eles balançam devagar (animação de CSS, para o texto ficar
  nítido) e, com o mouse em cima, seguem o mouse
- Título do topo com parallax e cards de produto com inclinação 3D e reflexo
- Contador de dinheiro que gira como um odômetro
- Faixas cruzadas que aceleram e invertem com a rolagem
- Cards que entram como cartas sendo distribuídas
- Bolinha que voa do botão até o carrinho
- Seção vermelha que se abre no scroll, com passos acendendo e selo girando
- Marca gigante no rodapé e granulado de cinema em telas grandes

## Como funciona a compra

1. O cliente adiciona produtos ao carrinho (fica salvo no navegador).
2. Em "Finalizar pelo WhatsApp" o site monta a mensagem com itens, plataforma e
   total, e abre a conversa no número configurado em `src/config/site.ts`.
3. Pagamento e entrega acontecem na conversa.

Dá para trocar por pagamento automático depois (PIX via Mercado Pago, por
exemplo) usando um Route Handler do Next.js, sem mudar o visual.

## Publicando na Vercel

O projeto `freitas-modder` já existe na Vercel e o site está em
<https://freitas-modder.vercel.app>. Ele não está ligado a um repositório, então
cada atualização é publicada manualmente. Para ligar a um repositório próprio:

1. Na Vercel, clique em **Add New → Project** e importe o repositório.
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
- [ ] Preços, números e descrições dos produtos (no painel, `/painel`)
- [ ] Prazo de garantia, tempo de entrega e horário (`src/config/site.ts`)
- [ ] Texto dos termos (`src/app/termos/page.tsx`)
- [ ] Opcional: prints reais de entregas (`src/data/proofs.ts`)

## Estrutura

```
src/
├── app/                 rotas (home, /loja, /loja/[slug], /termos, 404, SEO)
├── assets/fonts/        fontes usadas nas imagens de compartilhamento
├── components/
│   ├── cart/            carrinho lateral
│   ├── catalog/         catálogo com filtros
│   ├── effects/         animações reutilizáveis (reveal, faixa rolando, scroll suave)
│   ├── icons/           ícones de marcas
│   ├── layout/          navbar, footer, botão do WhatsApp
│   ├── product/         card, painel, contador, seletor de console, bloco de compra
│   ├── sections/        seções da home
│   └── ui/              botões, logo, títulos
├── config/site.ts       dados da loja
├── data/                produtos, FAQ e prints de entregas
├── lib/                 utilitários (preço, WhatsApp, scroll, imagem OG)
└── store/               carrinho e console escolhido
```

## Créditos

- Fontes Barlow e Barlow Condensed (Google Fonts, licença SIL Open Font License).
- Ícones de marcas do [Simple Icons](https://simpleicons.org) (CC0).
- O Freitas Modder não tem vínculo com a Rockstar Games, a Take-Two
  Interactive ou a Sony. GTA, PlayStation, PS4 e PS5 são marcas dos seus
  respectivos donos.
