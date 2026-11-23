/**
 * Tabelas do banco (Neon / Postgres).
 * Depois de mudar algo aqui: `npm run db:generate` cria a migração em
 * `drizzle/`, e ela roda sozinha no próximo deploy.
 */
import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

// ------------------------------------------------------------------ loja

export const categoryEnum = pgEnum("category", ["dinheiro", "level", "servico", "conta"]);
export const toneEnum = pgEnum("tone", ["graphite", "red", "wine", "black"]);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    summary: text("summary").notNull().default(""),
    description: text("description").notNull().default(""),
    category: categoryEnum("category").notNull(),
    headlineValue: text("headline_value").notNull().default(""),
    headlineLabel: text("headline_label").notNull().default(""),
    /** Dinheiro do jogo, para o contador animado. */
    amount: bigint("amount", { mode: "number" }),
    specs: jsonb("specs").$type<{ label: string; value: string }[]>().notNull().default([]),
    includes: jsonb("includes").$type<string[]>().notNull().default([]),
    /** Preço em centavos. Vazio = não vende nesse console. Os dois vazios = preço no WhatsApp. */
    pricePs4: integer("price_ps4_cents"),
    pricePs5: integer("price_ps5_cents"),
    delivery: text("delivery").notNull().default("Rápida"),
    tone: toneEnum("tone").notNull().default("graphite"),
    tag: text("tag"),
    image: text("image"),
    /** Desligado = some do site (ex.: conta vendida). */
    active: boolean("active").notNull().default(true),
    sort: integer("sort").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("products_category_sort_idx").on(t.category, t.sort)],
);

export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;

// ----------------------------------------------- login (Better Auth)

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  ...timestamps,
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    /** No Discord, é o ID do usuário no Discord. */
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);
