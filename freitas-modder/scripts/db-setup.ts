/**
 * Roda antes do `next build` (ver package.json):
 * 1. aplica as migrações de `drizzle/` no Neon;
 * 2. se a tabela de produtos estiver vazia, coloca os produtos iniciais.
 * Sem DATABASE_URL (build no computador), não faz nada.
 */
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { seedProducts } from "../src/data/seed-products";
import { productToRow } from "../src/db/mappers";
import { products } from "../src/db/schema";

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) {
    console.log("[db] Sem DATABASE_URL: pulando migração (build local).");
    return;
  }
  const db = drizzle(neon(url));
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("[db] Migrações aplicadas.");

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(products);
  if (count === 0) {
    await db.insert(products).values(seedProducts.map((p, i) => productToRow(p, i)));
    console.log(`[db] Tabela vazia: ${seedProducts.length} produtos iniciais cadastrados.`);
  } else {
    console.log(`[db] ${count} produtos no banco. Nada a cadastrar.`);
  }
}

main().catch((error) => {
  console.error("[db] Falhou:", error);
  process.exit(1);
});
