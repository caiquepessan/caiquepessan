/**
 * Teste local do banco com PGlite (Postgres em memória, sem internet):
 * aplica as migrações, cadastra os produtos iniciais e confere a volta.
 * Uso: npm run db:test
 */
import { PGlite } from "@electric-sql/pglite";
import { asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { seedProducts } from "../src/data/seed-products";
import { productToRow, rowToProduct } from "../src/db/mappers";
import { products } from "../src/db/schema";

async function main() {
  const db = drizzle(new PGlite());
  await migrate(db, { migrationsFolder: "drizzle" });
  await db.insert(products).values(seedProducts.map((p, i) => productToRow(p, i)));
  const rows = await db.select().from(products).orderBy(asc(products.sort));
  const back = rows.map(rowToProduct).map(({ id, ...rest }) => {
    if (!id) throw new Error("produto sem id");
    return rest;
  });
  const clean = (p: object) => JSON.parse(JSON.stringify(p));
  const expected = seedProducts.map(clean);
  const got = back.map(clean);
  if (JSON.stringify(expected) !== JSON.stringify(got)) {
    console.error("Diferença entre o que entrou e o que voltou do banco.");
    for (let i = 0; i < expected.length; i++) {
      if (JSON.stringify(expected[i]) !== JSON.stringify(got[i])) {
        console.error("esperado:", expected[i]);
        console.error("veio:", got[i]);
        break;
      }
    }
    process.exit(1);
  }
  console.log(`OK: ${rows.length} produtos foram e voltaram do banco iguais.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
