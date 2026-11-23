/**
 * ============================================================
 *  CATÁLOGO: adicione, remova ou edite produtos aqui
 * ============================================================
 *  - `slug` vira a URL do produto: /contas/<slug>
 *  - `variants` define em quais plataformas o produto existe e o preço
 *    de cada uma (oldPrice é opcional e aparece riscado).
 *  - Preços, quantidades e descrições abaixo são EXEMPLOS.
 */

export type Platform = "pc" | "playstation" | "xbox";
export type Category = "conta" | "dinheiro" | "servico";
export type Tier = "starter" | "pro" | "elite" | "lendaria";
export type StatIcon =
  | "level"
  | "money"
  | "cars"
  | "unlock"
  | "outfit"
  | "property"
  | "weapon"
  | "speed";

export interface ProductVariant {
  platform: Platform;
  price: number;
  oldPrice?: number;
}

export interface ProductStat {
  icon: StatIcon;
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: Category;
  tier: Tier;
  badge?: "MAIS VENDIDA" | "PROMO" | "NOVO" | "TOP";
  variants: ProductVariant[];
  stats: ProductStat[];
  features: string[];
  delivery: string;
  /** Opcional: deixe sem valor para não mostrar o aviso de estoque. */
  stock?: number;
  /** Opcional: imagem em /public (ex.: "/produtos/conta-elite.jpg"). */
  image?: string;
}

export const platforms: Record<
  Platform,
  { label: string; long: string; short: string }
> = {
  pc: { label: "PC", long: "PC (Steam, Epic e Rockstar)", short: "PC" },
  playstation: { label: "PlayStation", long: "PS4 e PS5", short: "PS" },
  xbox: { label: "Xbox", long: "Xbox One e Series X|S", short: "XB" },
};

export const platformOrder: Platform[] = ["pc", "playstation", "xbox"];

export const categories: Record<Category, { label: string; short: string }> = {
  conta: { label: "Contas modadas", short: "Contas" },
  dinheiro: { label: "Dinheiro na sua conta", short: "Dinheiro" },
  servico: { label: "Serviços", short: "Serviços" },
};

export const tiers: Record<
  Tier,
  { label: string; accent: string; glow: string; gradient: string }
> = {
  starter: {
    label: "Starter",
    accent: "#ff7a8a",
    glow: "rgba(255, 95, 115, 0.35)",
    gradient: "from-[#3a0a14] via-[#1c0a0e] to-[#0b0607]",
  },
  pro: {
    label: "Pro",
    accent: "#ff2a47",
    glow: "rgba(255, 42, 71, 0.45)",
    gradient: "from-[#5c0718] via-[#250910] to-[#0b0607]",
  },
  elite: {
    label: "Elite",
    accent: "#ff6a2b",
    glow: "rgba(255, 94, 31, 0.45)",
    gradient: "from-[#6b1208] via-[#2a0b0a] to-[#0b0607]",
  },
  lendaria: {
    label: "Lendária",
    accent: "#ffc94d",
    glow: "rgba(255, 201, 77, 0.4)",
    gradient: "from-[#5a3306] via-[#2a0d0a] to-[#0b0607]",
  },
};

export const products: Product[] = [
  // ----------------------------- CONTAS -----------------------------
  {
    slug: "conta-starter",
    name: "Conta Starter",
    tagline: "O jeito mais barato de sair do zero",
    description:
      "Ideal pra quem quer começar o online sem perder semanas farmando. Personagem pronto, dinheiro pra montar a garagem e carros já tunados.",
    category: "conta",
    tier: "starter",
    variants: [
      { platform: "pc", price: 39.9, oldPrice: 59.9 },
      { platform: "playstation", price: 49.9, oldPrice: 69.9 },
      { platform: "xbox", price: 49.9, oldPrice: 69.9 },
    ],
    stats: [
      { icon: "level", label: "Nível", value: "120+" },
      { icon: "money", label: "Dinheiro", value: "$300 mi" },
      { icon: "cars", label: "Carros modded", value: "15" },
    ],
    features: [
      "Acesso completo: você troca e-mail e senha",
      "Personagem criado e pronto pra jogar",
      "15 carros com upgrades no máximo",
      "Apartamento de luxo com garagem",
      "Entrega imediata após o pagamento",
    ],
    delivery: "Imediata",
  },
  {
    slug: "conta-pro",
    name: "Conta Pro",
    tagline: "O equilíbrio perfeito entre preço e poder",
    description:
      "A mais vendida da loja. Bilhão na conta, garagem cheia de carros modificados e as principais propriedades já compradas pra você lucrar desde o primeiro dia.",
    category: "conta",
    tier: "pro",
    badge: "MAIS VENDIDA",
    variants: [
      { platform: "pc", price: 79.9, oldPrice: 119.9 },
      { platform: "playstation", price: 89.9, oldPrice: 129.9 },
      { platform: "xbox", price: 89.9, oldPrice: 129.9 },
    ],
    stats: [
      { icon: "level", label: "Nível", value: "350+" },
      { icon: "money", label: "Dinheiro", value: "$1 bi" },
      { icon: "cars", label: "Carros modded", value: "40" },
    ],
    features: [
      "Acesso completo: você troca e-mail e senha",
      "$1 bilhão em dinheiro na conta",
      "40 carros modificados e raros",
      "Principais negócios e propriedades comprados",
      "Armas desbloqueadas com melhorias",
      "Entrega imediata após o pagamento",
    ],
    delivery: "Imediata",
    stock: 7,
  },
  {
    slug: "conta-elite",
    name: "Conta Elite",
    tagline: "Tudo desbloqueado, sem limite de diversão",
    description:
      "Pra quem quer chegar chegando. Unlock All completo, roupas modadas, bilhões na conta e uma garagem que faz inveja em qualquer sessão.",
    category: "conta",
    tier: "elite",
    variants: [
      { platform: "pc", price: 149.9, oldPrice: 219.9 },
      { platform: "playstation", price: 169.9, oldPrice: 239.9 },
      { platform: "xbox", price: 169.9, oldPrice: 239.9 },
    ],
    stats: [
      { icon: "level", label: "Nível", value: "800+" },
      { icon: "money", label: "Dinheiro", value: "$3 bi" },
      { icon: "cars", label: "Carros modded", value: "80" },
    ],
    features: [
      "Acesso completo: você troca e-mail e senha",
      "$3 bilhões em dinheiro na conta",
      "80 carros modificados e raros",
      "Unlock All: troféus, tatuagens, roupas e pinturas",
      "Roupas modadas exclusivas",
      "Todas as propriedades principais",
      "Suporte prioritário",
    ],
    delivery: "Imediata",
    stock: 4,
  },
  {
    slug: "conta-lendaria",
    name: "Conta Lendária",
    tagline: "O topo da cadeia alimentar do online",
    description:
      "A conta mais completa da Freitas Modder. Nível absurdo, dez bilhões na conta, mais de 150 carros modificados, outfits raríssimos e absolutamente tudo desbloqueado.",
    category: "conta",
    tier: "lendaria",
    badge: "TOP",
    variants: [
      { platform: "pc", price: 299.9, oldPrice: 449.9 },
      { platform: "playstation", price: 349.9, oldPrice: 499.9 },
      { platform: "xbox", price: 349.9, oldPrice: 499.9 },
    ],
    stats: [
      { icon: "level", label: "Nível", value: "8000" },
      { icon: "money", label: "Dinheiro", value: "$10 bi" },
      { icon: "cars", label: "Carros modded", value: "150+" },
    ],
    features: [
      "Acesso completo: você troca e-mail e senha",
      "$10 bilhões em dinheiro na conta",
      "Mais de 150 carros modificados e raros",
      "Unlock All completo + habilidades no máximo",
      "Outfits modados raríssimos",
      "Todas as propriedades e negócios",
      "Suporte VIP direto com o Freitas",
    ],
    delivery: "Imediata",
    stock: 2,
  },

  // ------------------------- DINHEIRO NA CONTA -------------------------
  {
    slug: "dinheiro-500-milhoes",
    name: "$500 Milhões",
    tagline: "Meio bilhão direto na sua conta",
    description:
      "Coloque meio bilhão na sua própria conta, sem precisar criar outra. Perfeito pra comprar aquele carro, a cobertura ou o negócio que você está de olho.",
    category: "dinheiro",
    tier: "pro",
    variants: [
      { platform: "pc", price: 29.9 },
      { platform: "playstation", price: 34.9 },
      { platform: "xbox", price: 34.9 },
    ],
    stats: [
      { icon: "money", label: "Dinheiro", value: "$500 mi" },
      { icon: "speed", label: "Entrega", value: "Até 1h" },
    ],
    features: [
      "Dinheiro depositado na SUA conta",
      "Sem precisar começar do zero",
      "Atendimento acompanhando o serviço",
      "Garantia de reposição",
    ],
    delivery: "Até 1 hora",
  },
  {
    slug: "dinheiro-2-bilhoes",
    name: "$2 Bilhões",
    tagline: "Compre tudo que quiser, quantas vezes quiser",
    description:
      "Dois bilhões na sua conta pra montar o império completo: carros, propriedades, negócios e tudo que a cidade tem pra oferecer.",
    category: "dinheiro",
    tier: "elite",
    badge: "PROMO",
    variants: [
      { platform: "pc", price: 69.9, oldPrice: 99.9 },
      { platform: "playstation", price: 79.9, oldPrice: 109.9 },
      { platform: "xbox", price: 79.9, oldPrice: 109.9 },
    ],
    stats: [
      { icon: "money", label: "Dinheiro", value: "$2 bi" },
      { icon: "speed", label: "Entrega", value: "Até 2h" },
    ],
    features: [
      "Dinheiro depositado na SUA conta",
      "Quantia ideal pra comprar tudo",
      "Atendimento acompanhando o serviço",
      "Garantia de reposição",
    ],
    delivery: "Até 2 horas",
  },

  // ------------------------------ SERVIÇOS ------------------------------
  {
    slug: "unlock-all",
    name: "Unlock All",
    tagline: "Tudo desbloqueado na sua conta",
    description:
      "Desbloqueie de uma vez tudo aquilo que levaria meses: troféus, tatuagens, roupas, pinturas, melhorias de armas e habilidades no máximo.",
    category: "servico",
    tier: "elite",
    variants: [
      { platform: "pc", price: 39.9 },
      { platform: "playstation", price: 44.9 },
      { platform: "xbox", price: 44.9 },
    ],
    stats: [
      { icon: "unlock", label: "Desbloqueios", value: "100%" },
      { icon: "speed", label: "Entrega", value: "Até 1h" },
    ],
    features: [
      "Troféus, tatuagens e roupas exclusivas",
      "Pinturas e melhorias de armas",
      "Habilidades do personagem no máximo",
      "Feito na sua própria conta",
    ],
    delivery: "Até 1 hora",
  },
  {
    slug: "upar-nivel",
    name: "Upar Nível",
    tagline: "Suba até o nível 500 sem farmar",
    description:
      "Seu personagem do nível atual até o nível 500, com todos os desbloqueios de rank que vêm junto. Chega de horas repetindo missão.",
    category: "servico",
    tier: "starter",
    variants: [
      { platform: "pc", price: 34.9 },
      { platform: "playstation", price: 39.9 },
      { platform: "xbox", price: 39.9 },
    ],
    stats: [
      { icon: "level", label: "Até o nível", value: "500" },
      { icon: "speed", label: "Entrega", value: "Até 1h" },
    ],
    features: [
      "Qualquer nível até o 500",
      "Desbloqueios de rank inclusos",
      "Feito na sua própria conta",
      "Garantia de reposição",
    ],
    delivery: "Até 1 hora",
  },
  {
    slug: "pack-carros-modded",
    name: "Pack Carros Modded",
    tagline: "10 carros modificados na sua garagem",
    description:
      "Dez carros com modificações que não existem no jogo normal: rodas especiais, pinturas cromadas e combinações exclusivas pra você chamar atenção em qualquer sessão.",
    category: "servico",
    tier: "pro",
    badge: "NOVO",
    variants: [
      { platform: "pc", price: 44.9 },
      { platform: "playstation", price: 49.9 },
      { platform: "xbox", price: 49.9 },
    ],
    stats: [
      { icon: "cars", label: "Carros modded", value: "10" },
      { icon: "speed", label: "Entrega", value: "Até 2h" },
    ],
    features: [
      "10 carros com modificações exclusivas",
      "Rodas e pinturas especiais",
      "Você escolhe os modelos",
      "Feito na sua própria conta",
    ],
    delivery: "Até 2 horas",
  },
];

// ------------------------------- helpers -------------------------------

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getVariant(product: Product, platform?: Platform) {
  return (
    product.variants.find((v) => v.platform === platform) ?? product.variants[0]
  );
}

export function getStartingPrice(product: Product) {
  return Math.min(...product.variants.map((v) => v.price));
}

export function getDiscount(variant: ProductVariant) {
  if (!variant.oldPrice || variant.oldPrice <= variant.price) return 0;
  return Math.round((1 - variant.price / variant.oldPrice) * 100);
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
