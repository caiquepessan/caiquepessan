/**
 * Produtos que entram no banco na primeira vez (tabela vazia) e que o
 * site usa quando roda sem banco (no computador, sem DATABASE_URL).
 * Depois disso, quem manda é o painel do Freitas (/painel).
 */
import { platformOrder, type Product, type ProductVariant } from "./products";

/** Mesmo preço no PS4 e no PS5. */
function both(price: number): ProductVariant[] {
  return platformOrder.map((platform) => ({ platform, price }));
}

const PIX_E_CONSOLE = "No PS4 ou no PS5, pelo mesmo preço";

export const seedProducts: Product[] = [
  // ------------------------- DINHEIRO NA SUA CONTA -------------------------
  {
    slug: "dinheiro-20-milhoes",
    name: "$20 milhões",
    summary: "Pra comprar aquele carro ou começar um negócio.",
    description:
      "A gente coloca 20 milhões direto no seu personagem do GTA Online, sem você precisar farmar. Sai a R$ 0,50 o milhão.",
    category: "dinheiro",
    headline: { value: "$20 MI", label: "na sua conta" },
    amount: 20_000_000,
    specs: [
      { label: "Dinheiro", value: "$20 milhões" },
      { label: "Sai a", value: "R$ 0,50 o milhão" },
      { label: "Entrega", value: "Rápida" },
    ],
    includes: ["$20 milhões no seu personagem", PIX_E_CONSOLE, "Pagamento no Pix"],
    variants: both(10),
    delivery: "Rápida",
    tone: "graphite",
  },
  {
    slug: "dinheiro-50-milhoes",
    name: "$50 milhões",
    summary: "Dá pra montar a garagem e ainda sobra.",
    description:
      "A gente coloca 50 milhões direto no seu personagem do GTA Online, sem você precisar farmar. Sai a R$ 0,40 o milhão.",
    category: "dinheiro",
    headline: { value: "$50 MI", label: "na sua conta" },
    amount: 50_000_000,
    specs: [
      { label: "Dinheiro", value: "$50 milhões" },
      { label: "Sai a", value: "R$ 0,40 o milhão" },
      { label: "Entrega", value: "Rápida" },
    ],
    includes: ["$50 milhões no seu personagem", PIX_E_CONSOLE, "Pagamento no Pix"],
    variants: both(20),
    delivery: "Rápida",
    tone: "wine",
  },
  {
    slug: "dinheiro-100-milhoes",
    name: "$100 milhões",
    summary: "Pra comprar os negócios e começar a lucrar.",
    description:
      "A gente coloca 100 milhões direto no seu personagem do GTA Online, sem você precisar farmar. Sai a R$ 0,35 o milhão.",
    category: "dinheiro",
    headline: { value: "$100 MI", label: "na sua conta" },
    amount: 100_000_000,
    specs: [
      { label: "Dinheiro", value: "$100 milhões" },
      { label: "Sai a", value: "R$ 0,35 o milhão" },
      { label: "Entrega", value: "Rápida" },
    ],
    includes: ["$100 milhões no seu personagem", PIX_E_CONSOLE, "Pagamento no Pix"],
    variants: both(35),
    delivery: "Rápida",
    tone: "black",
  },
  {
    slug: "dinheiro-500-milhoes",
    name: "$500 milhões",
    summary: "O pacote que mais compensa: sai a R$ 0,24 o milhão.",
    description:
      "A gente coloca 500 milhões direto no seu personagem do GTA Online, sem você precisar farmar. É o pacote com o menor preço por milhão: R$ 0,24.",
    category: "dinheiro",
    headline: { value: "$500 MI", label: "na sua conta" },
    amount: 500_000_000,
    specs: [
      { label: "Dinheiro", value: "$500 milhões" },
      { label: "Sai a", value: "R$ 0,24 o milhão" },
      { label: "Entrega", value: "Rápida" },
    ],
    includes: ["$500 milhões no seu personagem", PIX_E_CONSOLE, "Pagamento no Pix"],
    variants: both(120),
    delivery: "Rápida",
    tone: "red",
    tag: "Melhor preço",
  },

  // ---------------------------- UP DE LEVEL / RP ----------------------------
  {
    slug: "level-30",
    name: "30 levels",
    summary: "Pra sair do começo sem ficar repetindo missão.",
    description:
      "Sobe 30 levels (RP) no seu personagem sem você precisar farmar. Sai a R$ 0,33 o level.",
    category: "level",
    headline: { value: "+30", label: "levels" },
    specs: [
      { label: "Levels", value: "+30" },
      { label: "Sai a", value: "R$ 0,33 o level" },
      { label: "Entrega", value: "Rápida" },
    ],
    includes: ["+30 levels (RP) no seu personagem", PIX_E_CONSOLE, "Pagamento no Pix"],
    variants: both(10),
    delivery: "Rápida",
    tone: "graphite",
  },
  {
    slug: "level-75",
    name: "75 levels",
    summary: "Libera mais armas, roupas e veículos de rank.",
    description:
      "Sobe 75 levels (RP) no seu personagem sem você precisar farmar. Sai a R$ 0,26 o level.",
    category: "level",
    headline: { value: "+75", label: "levels" },
    specs: [
      { label: "Levels", value: "+75" },
      { label: "Sai a", value: "R$ 0,26 o level" },
      { label: "Entrega", value: "Rápida" },
    ],
    includes: ["+75 levels (RP) no seu personagem", PIX_E_CONSOLE, "Pagamento no Pix"],
    variants: both(20),
    delivery: "Rápida",
    tone: "wine",
  },
  {
    slug: "level-150",
    name: "150 levels",
    summary: "Um salto grande de level de uma vez.",
    description:
      "Sobe 150 levels (RP) no seu personagem sem você precisar farmar. Sai a R$ 0,23 o level.",
    category: "level",
    headline: { value: "+150", label: "levels" },
    specs: [
      { label: "Levels", value: "+150" },
      { label: "Sai a", value: "R$ 0,23 o level" },
      { label: "Entrega", value: "Rápida" },
    ],
    includes: ["+150 levels (RP) no seu personagem", PIX_E_CONSOLE, "Pagamento no Pix"],
    variants: both(35),
    delivery: "Rápida",
    tone: "black",
  },
  {
    slug: "level-500",
    name: "500 levels",
    summary: "O que mais compensa: sai a R$ 0,18 o level.",
    description:
      "Sobe 500 levels (RP) no seu personagem sem você precisar farmar. É o pacote com o menor preço por level: R$ 0,18.",
    category: "level",
    headline: { value: "+500", label: "levels" },
    specs: [
      { label: "Levels", value: "+500" },
      { label: "Sai a", value: "R$ 0,18 o level" },
      { label: "Entrega", value: "Rápida" },
    ],
    includes: ["+500 levels (RP) no seu personagem", PIX_E_CONSOLE, "Pagamento no Pix"],
    variants: both(90),
    delivery: "Rápida",
    tone: "red",
    tag: "Melhor custo-benefício",
  },

  // ------------------------ UNLOCK ALL + CORRIDA MODDER ------------------------
  {
    slug: "unlock-all-corrida-modder",
    name: "Unlock All + Corrida Modder",
    summary: "Tudo liberado e o personagem correndo muito mais rápido.",
    description:
      "Desbloqueio completo do personagem com a Corrida Modder ativada: ele corre muito mais rápido e fica mais ágil no PvP. O preço é por personagem.",
    category: "servico",
    headline: { value: "100%", label: "liberado + corrida modder" },
    specs: [
      { label: "Unlock All", value: "Completo" },
      { label: "Corrida Modder", value: "Ativada" },
      { label: "Preço", value: "Por personagem" },
    ],
    includes: [
      "Desbloqueio completo (Unlock All)",
      "Todas as tatuagens",
      "Todas as estampas de armas",
      "Tudo liberado na Los Santos Customs",
      "Skills e habilidades no máximo",
      "Corrida Modder: o personagem corre muito mais rápido",
      "Movimentação mais ágil no PvP",
      "Desbloqueio definitivo",
    ],
    variants: both(35),
    delivery: "Rápida",
    tone: "wine",
    tag: "Combo",
  },

  // ------------------------------ CONTA PRONTA ------------------------------
  {
    slug: "conta-level-120",
    name: "Conta Level 120",
    summary: "Level 120, mais de $466 milhões no banco e K/D 10.",
    description:
      "Conta pronta com personagem level 120, mais de 466 milhões no banco, K/D 10.00, habilidades no máximo e trajes modder. É unidade única: chama no WhatsApp pra saber o preço e o console.",
    category: "conta",
    headline: { value: "$466 MI", label: "no banco · level 120" },
    amount: 466_000_000,
    specs: [
      { label: "Level", value: "120" },
      { label: "Dinheiro", value: "+$466 milhões" },
      { label: "K/D", value: "10.00" },
      { label: "Habilidades", value: "No máximo" },
      { label: "Trajes", value: "Modder" },
    ],
    includes: [
      "Personagem level 120",
      "Mais de $466 milhões no banco",
      "K/D 10.00",
      "Habilidades no máximo",
      "Trajes modder",
    ],
    variants: [],
    delivery: "Logo após o pagamento",
    tone: "black",
    tag: "Oportunidade",
  },
];

