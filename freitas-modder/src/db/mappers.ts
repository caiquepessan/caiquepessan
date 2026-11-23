/**
 * Conversão entre a linha do banco e o `Product` que o site usa.
 * Sem "server-only" de propósito: o script de deploy também usa.
 */
import { categoryOrder, type Product, type ProductVariant } from "@/data/products";
import type { NewProductRow, ProductRow } from "./schema";

export const toCents = (value: number) => Math.round(value * 100);

export function rowToProduct(row: ProductRow): Product {
  const variants: ProductVariant[] = [];
  if (row.pricePs4 !== null) variants.push({ platform: "ps4", price: row.pricePs4 / 100 });
  if (row.pricePs5 !== null) variants.push({ platform: "ps5", price: row.pricePs5 / 100 });
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    summary: row.summary,
    description: row.description,
    category: row.category,
    headline: { value: row.headlineValue, label: row.headlineLabel },
    amount: row.amount ?? undefined,
    specs: row.specs,
    includes: row.includes,
    variants,
    delivery: row.delivery,
    tone: row.tone,
    tag: row.tag ?? undefined,
    image: row.image ?? undefined,
  };
}

export function productToRow(product: Product, sort: number): NewProductRow {
  const price = (platform: "ps4" | "ps5") => {
    const variant = product.variants.find((v) => v.platform === platform);
    return variant ? toCents(variant.price) : null;
  };
  return {
    slug: product.slug,
    name: product.name,
    summary: product.summary,
    description: product.description,
    category: product.category,
    headlineValue: product.headline.value,
    headlineLabel: product.headline.label,
    amount: product.amount ?? null,
    specs: product.specs,
    includes: product.includes,
    pricePs4: price("ps4"),
    pricePs5: price("ps5"),
    delivery: product.delivery,
    tone: product.tone,
    tag: product.tag ?? null,
    image: product.image ?? null,
    active: true,
    sort,
  };
}

/** Ordem do site: categoria (dinheiro, level, combo, conta) e depois `sort`. */
export function sortCatalog<T extends { category: Product["category"] }>(
  rows: (T & { sort?: number })[],
) {
  return [...rows].sort(
    (a, b) =>
      categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) ||
      (a.sort ?? 0) - (b.sort ?? 0),
  );
}
