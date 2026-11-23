/**
 * ============================================================
 *  TIPOS E REGRAS DO CATÁLOGO
 * ============================================================
 *  Os produtos ficam no banco e são editados no painel (/painel).
 *  A carga inicial está em `seed-products.ts`.
 *  - `slug` vira a URL do produto: /loja/<slug>
 *  - `variants` tem o preço de cada console. Sem variante = não vende
 *    nesse console. Sem nenhuma = preço combinado no WhatsApp.
 */

export type Platform = "ps4" | "ps5";
export type Category = "dinheiro" | "level" | "servico" | "conta";
/** Cor do painel do produto. */
export type Tone = "graphite" | "red" | "wine" | "black";

export interface ProductVariant {
  platform: Platform;
  price: number;
  /** Opcional: preço antigo, aparece riscado. */
  oldPrice?: number;
}

export interface Product {
  /** ID no banco (só existe quando vem do banco). */
  id?: string;
  slug: string;
  name: string;
  /** Uma frase curta para o card. */
  summary: string;
  /** Texto da página do produto. */
  description: string;
  category: Category;
  /** Destaque grande do painel, ex.: { value: "$500 MI", label: "na sua conta" }. */
  headline: { value: string; label: string };
  /** Valor em dinheiro do jogo, para o contador animado (opcional). */
  amount?: number;
  specs: { label: string; value: string }[];
  includes: string[];
  /** Vazio = preço combinado no WhatsApp. */
  variants: ProductVariant[];
  delivery: string;
  tone: Tone;
  /** Etiqueta opcional, ex.: "Melhor preço". */
  tag?: string;
  /** Opcional: print real do produto em /public (ex.: "/produtos/conta-level-120.jpg"). */
  image?: string;
}

export const platforms: Record<Platform, { label: string; long: string }> = {
  ps4: { label: "PS4", long: "PlayStation 4" },
  ps5: { label: "PS5", long: "PlayStation 5" },
};

export const platformOrder: Platform[] = ["ps4", "ps5"];

export const categories: Record<Category, { label: string; short: string }> = {
  dinheiro: { label: "Dinheiro na sua conta", short: "Dinheiro" },
  level: { label: "Up de level / RP", short: "Level" },
  servico: { label: "Combo promocional", short: "Unlock All" },
  conta: { label: "Conta pronta", short: "Contas" },
};

/** Ordem das categorias no site. */
export const categoryOrder: Category[] = ["dinheiro", "level", "servico", "conta"];

// ------------------------------- helpers -------------------------------

/** Variante do console escolhido, ou undefined se não existir. */
export function findVariant(product: Product, platform: Platform) {
  return product.variants.find((v) => v.platform === platform);
}

/** Sem preço fixo: combinado no WhatsApp. */
export function priceOnRequest(product: Product) {
  return product.variants.length === 0;
}

/** O mesmo preço em todos os consoles. */
export function samePriceEverywhere(product: Product) {
  return (
    product.variants.length === platformOrder.length &&
    new Set(product.variants.map((v) => v.price)).size === 1
  );
}

export function getRelatedProducts(catalog: Product[], product: Product, limit = 3) {
  const sameCategory = catalog.filter(
    (p) => p.slug !== product.slug && p.category === product.category,
  );
  const others = catalog.filter(
    (p) => p.slug !== product.slug && p.category !== product.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
