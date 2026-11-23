import "server-only";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import type { Product } from "@/data/products";
import { seedProducts } from "@/data/seed-products";
import { getDb, hasDatabase } from "@/db";
import { rowToProduct, sortCatalog } from "@/db/mappers";
import { products } from "@/db/schema";

/** Tag do cache do catálogo: o painel chama updateTag(CATALOG_TAG) ao salvar. */
export const CATALOG_TAG = "catalog";

/**
 * Produtos à venda (ativos), na ordem do site. Fica em cache até o
 * Freitas mudar algo no painel. Sem banco (no computador), usa os
 * produtos iniciais.
 */
export async function getCatalog(): Promise<Product[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("max");
  if (!hasDatabase()) return seedProducts;
  const rows = await getDb().select().from(products).where(eq(products.active, true));
  return sortCatalog(rows).map(rowToProduct);
}

export async function getCatalogProduct(slug: string) {
  return (await getCatalog()).find((p) => p.slug === slug);
}

/** Pacote do card 3D do topo: o maior pacote de dinheiro. */
export function pickFeatured(catalog: Product[]) {
  const money = catalog
    .filter((p) => p.category === "dinheiro" && p.variants.length > 0)
    .sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0));
  return money[0] ?? catalog.find((p) => p.variants.length > 0) ?? catalog[0];
}
