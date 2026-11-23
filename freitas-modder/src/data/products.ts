/**
 * ============================================================
 *  CATÁLOGO: adicione, remova ou edite produtos aqui
 * ============================================================
 *  - `slug` vira a URL do produto: /contas/<slug>
 *  - `variants` tem o preço de cada console. Se o produto não existir
 *    para um console, é só não colocar a variante dele.
 *  - Preços, números e textos abaixo são EXEMPLOS.
 */

export type Platform = "ps4" | "ps5";
export type Category = "conta" | "dinheiro" | "servico";
/** Cor do painel do produto. */
export type Tone = "graphite" | "red" | "wine" | "black";

export interface ProductVariant {
  platform: Platform;
  price: number;
  /** Opcional: preço antigo, aparece riscado. */
  oldPrice?: number;
}

export interface Product {
  slug: string;
  name: string;
  /** Uma frase curta para o card. */
  summary: string;
  /** Texto da página do produto. */
  description: string;
  category: Category;
  /** Destaque grande do painel, ex.: { value: "$1 BI", label: "no banco" }. */
  headline: { value: string; label: string };
  /** Valor em dinheiro do jogo, para o contador animado (opcional). */
  amount?: number;
  specs: { label: string; value: string }[];
  includes: string[];
  variants: ProductVariant[];
  delivery: string;
  tone: Tone;
  /** Etiqueta opcional, ex.: "Mais pedida". */
  tag?: string;
  /** Opcional: print real do produto em /public (ex.: "/produtos/conta-pro.jpg"). */
  image?: string;
}

export const platforms: Record<Platform, { label: string; long: string }> = {
  ps4: { label: "PS4", long: "PlayStation 4" },
  ps5: { label: "PS5", long: "PlayStation 5" },
};

export const platformOrder: Platform[] = ["ps4", "ps5"];

export const categories: Record<Category, { label: string; short: string }> = {
  conta: { label: "Contas prontas", short: "Contas" },
  dinheiro: { label: "Dinheiro na sua conta", short: "Dinheiro" },
  servico: { label: "Serviços na sua conta", short: "Serviços" },
};

export const products: Product[] = [
  // ----------------------------- CONTAS -----------------------------
  {
    slug: "conta-starter",
    name: "Conta Starter",
    summary: "Pra começar o online sem farmar do zero.",
    description:
      "Personagem criado, dinheiro pra montar a garagem e alguns carros já no máximo. É a forma mais barata de entrar no online com tudo andando.",
    category: "conta",
    headline: { value: "$300 MI", label: "no banco" },
    amount: 300_000_000,
    specs: [
      { label: "Nível", value: "120+" },
      { label: "Dinheiro", value: "$300 milhões" },
      { label: "Carros", value: "15 modificados" },
    ],
    includes: [
      "Conta PSN com e-mail e senha que você troca",
      "Personagem pronto no online",
      "15 carros com melhorias no máximo",
      "Apartamento com garagem",
    ],
    variants: [
      { platform: "ps4", price: 39.9 },
      { platform: "ps5", price: 49.9 },
    ],
    delivery: "Imediata",
    tone: "graphite",
  },
  {
    slug: "conta-pro",
    name: "Conta Pro",
    summary: "Um bilhão no banco e garagem cheia.",
    description:
      "Nível 350, um bilhão de dinheiro, 40 carros modificados e as armas liberadas. Dá pra comprar os negócios principais e começar a lucrar no primeiro dia.",
    category: "conta",
    headline: { value: "$1 BI", label: "no banco" },
    amount: 1_000_000_000,
    specs: [
      { label: "Nível", value: "350+" },
      { label: "Dinheiro", value: "$1 bilhão" },
      { label: "Carros", value: "40 modificados" },
      { label: "Armas", value: "Todas liberadas" },
    ],
    includes: [
      "Conta PSN com e-mail e senha que você troca",
      "$1 bilhão no banco",
      "40 carros modificados",
      "Armas liberadas com melhorias",
      "Negócios principais comprados",
    ],
    variants: [
      { platform: "ps4", price: 79.9 },
      { platform: "ps5", price: 89.9 },
    ],
    delivery: "Imediata",
    tone: "red",
    tag: "Mais pedida",
  },
  {
    slug: "conta-elite",
    name: "Conta Elite",
    summary: "Tudo desbloqueado, roupas modadas e $3 bi.",
    description:
      "Unlock All completo, roupas modadas, 80 carros e três bilhões no banco. Pra quem quer chegar no online com tudo que o jogo tem.",
    category: "conta",
    headline: { value: "$3 BI", label: "no banco" },
    amount: 3_000_000_000,
    specs: [
      { label: "Nível", value: "800+" },
      { label: "Dinheiro", value: "$3 bilhões" },
      { label: "Carros", value: "80 modificados" },
      { label: "Unlock All", value: "Completo" },
    ],
    includes: [
      "Conta PSN com e-mail e senha que você troca",
      "$3 bilhões no banco",
      "80 carros modificados",
      "Unlock All: troféus, tatuagens, roupas e pinturas",
      "Roupas modadas",
    ],
    variants: [
      { platform: "ps4", price: 149.9 },
      { platform: "ps5", price: 169.9 },
    ],
    delivery: "Imediata",
    tone: "wine",
  },
  {
    slug: "conta-lendaria",
    name: "Conta Lendária",
    summary: "A conta mais completa da loja.",
    description:
      "Nível 8000, dez bilhões no banco, mais de 150 carros modificados, roupas raras e tudo desbloqueado. Não falta nada.",
    category: "conta",
    headline: { value: "$10 BI", label: "no banco" },
    amount: 10_000_000_000,
    specs: [
      { label: "Nível", value: "8000" },
      { label: "Dinheiro", value: "$10 bilhões" },
      { label: "Carros", value: "150+ modificados" },
      { label: "Unlock All", value: "Completo" },
    ],
    includes: [
      "Conta PSN com e-mail e senha que você troca",
      "$10 bilhões no banco",
      "Mais de 150 carros modificados",
      "Unlock All e habilidades no máximo",
      "Roupas modadas raras",
      "Todas as propriedades e negócios",
    ],
    variants: [
      { platform: "ps4", price: 299.9 },
      { platform: "ps5", price: 349.9 },
    ],
    delivery: "Imediata",
    tone: "black",
  },

  // ------------------------- DINHEIRO NA CONTA -------------------------
  {
    slug: "dinheiro-500-milhoes",
    name: "$500 milhões",
    summary: "Meio bilhão direto no seu personagem.",
    description:
      "A gente coloca $500 milhões na sua própria conta, sem você precisar começar outra. Bom pra comprar aquele carro, a cobertura ou o negócio que você tá de olho.",
    category: "dinheiro",
    headline: { value: "$500 MI", label: "na sua conta" },
    amount: 500_000_000,
    specs: [
      { label: "Valor", value: "$500 milhões" },
      { label: "Onde", value: "Na sua conta" },
      { label: "Prazo", value: "Até 1 hora" },
    ],
    includes: [
      "Dinheiro depositado no seu personagem",
      "Acompanhamento pelo WhatsApp",
      "Garantia de reposição",
    ],
    variants: [
      { platform: "ps4", price: 29.9 },
      { platform: "ps5", price: 34.9 },
    ],
    delivery: "Até 1 hora",
    tone: "graphite",
  },
  {
    slug: "dinheiro-2-bilhoes",
    name: "$2 bilhões",
    summary: "Dois bilhões direto no seu personagem.",
    description:
      "Dois bilhões na sua própria conta pra montar o império inteiro: carros, propriedades e todos os negócios.",
    category: "dinheiro",
    headline: { value: "$2 BI", label: "na sua conta" },
    amount: 2_000_000_000,
    specs: [
      { label: "Valor", value: "$2 bilhões" },
      { label: "Onde", value: "Na sua conta" },
      { label: "Prazo", value: "Até 2 horas" },
    ],
    includes: [
      "Dinheiro depositado no seu personagem",
      "Acompanhamento pelo WhatsApp",
      "Garantia de reposição",
    ],
    variants: [
      { platform: "ps4", price: 69.9 },
      { platform: "ps5", price: 79.9 },
    ],
    delivery: "Até 2 horas",
    tone: "red",
  },

  // ------------------------------ SERVIÇOS ------------------------------
  {
    slug: "unlock-all",
    name: "Unlock All",
    summary: "Libera troféus, tatuagens, roupas e melhorias de armas.",
    description:
      "Desbloqueia de uma vez o que levaria meses: troféus, tatuagens, roupas, pinturas, melhorias de armas e habilidades no máximo.",
    category: "servico",
    headline: { value: "100%", label: "desbloqueado" },
    specs: [
      { label: "O que libera", value: "Tudo" },
      { label: "Onde", value: "Na sua conta" },
      { label: "Prazo", value: "Até 1 hora" },
    ],
    includes: [
      "Troféus, tatuagens e roupas",
      "Pinturas e melhorias de armas",
      "Habilidades do personagem no máximo",
    ],
    variants: [
      { platform: "ps4", price: 39.9 },
      { platform: "ps5", price: 44.9 },
    ],
    delivery: "Até 1 hora",
    tone: "wine",
  },
  {
    slug: "upar-nivel",
    name: "Upar nível",
    summary: "Sobe seu personagem até o nível 500.",
    description:
      "Leva seu personagem do nível atual até o 500, com os desbloqueios de rank que vêm junto. Sem horas repetindo missão.",
    category: "servico",
    headline: { value: "500", label: "de nível" },
    specs: [
      { label: "Até o nível", value: "500" },
      { label: "Onde", value: "Na sua conta" },
      { label: "Prazo", value: "Até 1 hora" },
    ],
    includes: [
      "Qualquer nível até o 500",
      "Desbloqueios de rank inclusos",
      "Garantia de reposição",
    ],
    variants: [
      { platform: "ps4", price: 34.9 },
      { platform: "ps5", price: 39.9 },
    ],
    delivery: "Até 1 hora",
    tone: "graphite",
  },
  {
    slug: "pack-carros-modificados",
    name: "Pack de carros",
    summary: "10 carros com rodas e pinturas fora do padrão.",
    description:
      "Dez carros com modificações que não existem na loja do jogo: rodas especiais, pinturas cromadas e combinações exclusivas. Você escolhe os modelos.",
    category: "servico",
    headline: { value: "10", label: "carros modificados" },
    specs: [
      { label: "Carros", value: "10" },
      { label: "Modelos", value: "Você escolhe" },
      { label: "Prazo", value: "Até 2 horas" },
    ],
    includes: [
      "10 carros modificados na sua garagem",
      "Rodas e pinturas especiais",
      "Modelos à sua escolha",
    ],
    variants: [
      { platform: "ps4", price: 44.9 },
      { platform: "ps5", price: 49.9 },
    ],
    delivery: "Até 2 horas",
    tone: "black",
  },
];

// ------------------------------- helpers -------------------------------

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

/** Variante do console escolhido, ou undefined se não existir. */
export function findVariant(product: Product, platform: Platform) {
  return product.variants.find((v) => v.platform === platform);
}

export function getRelatedProducts(product: Product, limit = 3) {
  const sameCategory = products.filter(
    (p) => p.slug !== product.slug && p.category === product.category,
  );
  const others = products.filter(
    (p) => p.slug !== product.slug && p.category !== product.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
