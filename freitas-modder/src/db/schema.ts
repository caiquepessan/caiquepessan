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

// ------------------------------------------------------------------ tickets

/**
 * Andamento de um ticket. A maior parte dos serviços é feita pelo Freitas
 * dentro da conta do jogador: paga, libera o acesso (QR Code no app da
 * PlayStation), ele faz, manda as provas e marca como entregue.
 */
export const ticketStatusEnum = pgEnum("ticket_status", [
  "aberto",
  "aguardando_pagamento",
  "pago",
  "aguardando_acesso",
  "em_andamento",
  "entregue",
  "fechado",
]);

/** servico = feito na conta do jogador; conta = compra de conta pronta; outro = dúvida/pedido livre. */
export const ticketKindEnum = pgEnum("ticket_kind", ["servico", "conta", "outro"]);

export const ticketRoleEnum = pgEnum("ticket_message_role", ["cliente", "freitas", "sistema"]);

export interface TicketItem {
  slug: string;
  name: string;
  platform: "ps4" | "ps5";
  qty: number;
  /** Preço unitário em centavos na hora do pedido; null = preço a combinar. */
  unitPrice: number | null;
}

export interface TicketAttachment {
  /** Endereço no Vercel Blob. */
  url: string;
  pathname: string;
  contentType: string;
  size: number;
  name: string;
  /** No armazenamento privado: só abre pelo site, para quem pode ver o ticket. */
  private: boolean;
}

export const tickets = pgTable(
  "tickets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Número que as pessoas veem (#1001). */
    number: integer("number").generatedAlwaysAsIdentity({ startWith: 1001 }).notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    kind: ticketKindEnum("kind").notNull().default("servico"),
    subject: text("subject").notNull(),
    /** "ps4" | "ps5" (vazio em assunto livre). */
    platform: text("platform"),
    /** ID da PSN informado pelo cliente (opcional). */
    psnId: text("psn_id"),
    items: jsonb("items").$type<TicketItem[]>().notNull().default([]),
    /** Total em centavos dos itens com preço; null quando é a combinar. */
    total: integer("total_cents"),
    status: ticketStatusEnum("status").notNull().default("aberto"),
    /** Tem resposta nova que o cliente ainda não viu. */
    unreadByCustomer: boolean("unread_by_customer").notNull().default(false),
    /** Tem mensagem nova do cliente que o Freitas ainda não viu. */
    unreadByAdmin: boolean("unread_by_admin").notNull().default(true),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }).notNull().defaultNow(),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("tickets_user_idx").on(t.userId, t.lastMessageAt),
    index("tickets_status_idx").on(t.status, t.lastMessageAt),
  ],
);

export const ticketMessages = pgTable(
  "ticket_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ticketId: uuid("ticket_id")
      .notNull()
      .references(() => tickets.id, { onDelete: "cascade" }),
    authorId: text("author_id").references(() => user.id, { onDelete: "set null" }),
    role: ticketRoleEnum("role").notNull(),
    body: text("body").notNull().default(""),
    attachments: jsonb("attachments").$type<TicketAttachment[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("ticket_messages_ticket_idx").on(t.ticketId, t.createdAt)],
);

export type TicketRow = typeof tickets.$inferSelect;
export type TicketMessageRow = typeof ticketMessages.$inferSelect;

// ------------------------------------------------- avisos no celular

/** Aparelhos que ativaram notificações (Web Push). Um por navegador. */
export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    endpoint: text("endpoint").notNull().unique(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    userAgent: text("user_agent"),
    ...timestamps,
  },
  (t) => [index("push_subscriptions_user_idx").on(t.userId)],
);
