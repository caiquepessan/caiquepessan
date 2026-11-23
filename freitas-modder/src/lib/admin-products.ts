import "server-only";
import { eq } from "drizzle-orm";
import type { Product } from "@/data/products";
import { getDb } from "@/db";
import { rowToProduct, sortCatalog } from "@/db/mappers";
import { products } from "@/db/schema";

export interface AdminProduct {
  product: Product & { id: string };
  active: boolean;
  sort: number;
  updatedAt: Date;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isProductId(id: string) {
  return UUID.test(id);
}

function toAdmin(row: typeof products.$inferSelect): AdminProduct {
  return {
    product: { ...rowToProduct(row), id: row.id },
    active: row.active,
    sort: row.sort,
    updatedAt: row.updatedAt,
  };
}

/** Todos os produtos, inclusive os escondidos. Sem cache: o painel vê sempre o atual. */
export async function listAllProducts(): Promise<AdminProduct[]> {
  const rows = await getDb().select().from(products);
  return sortCatalog(rows).map(toAdmin);
}

export async function getAdminProduct(id: string): Promise<AdminProduct | null> {
  if (!isProductId(id)) return null;
  const [row] = await getDb().select().from(products).where(eq(products.id, id)).limit(1);
  return row ? toAdmin(row) : null;
}
