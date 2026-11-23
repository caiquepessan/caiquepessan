import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/** O banco só existe na Vercel (Production e Preview). */
export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

function connect() {
  return drizzle(neon(process.env.DATABASE_URL!), { schema });
}

let instance: ReturnType<typeof connect> | undefined;

/** Conexão com o Neon (HTTP, boa para funções serverless). */
export function getDb() {
  if (!hasDatabase()) throw new Error("DATABASE_URL não está configurada.");
  instance ??= connect();
  return instance;
}

export type Db = ReturnType<typeof getDb>;
export { schema };
