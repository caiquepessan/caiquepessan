/**
 * Tickets no banco. As funções recebem o banco por parâmetro: no site é o
 * Neon, no teste (scripts/test-tickets.ts) é um Postgres em memória.
 */
import { and, asc, count, desc, eq, inArray, ne, notInArray } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "@/db/schema";
import {
  account,
  ticketMessages,
  tickets,
  user,
  type TicketAttachment,
  type TicketItem,
} from "@/db/schema";
import { statusInfo, type TicketKind, type TicketStatus } from "./status";

export type TicketsDb = PgDatabase<PgQueryResultHKT, typeof schema>;
export type MessageRole = "cliente" | "freitas" | "sistema";

const ACTIVE: TicketStatus[] = ["aberto", "aguardando_pagamento", "pago", "aguardando_acesso", "em_andamento"];

export interface NewTicket {
  userId: string;
  kind: TicketKind;
  subject: string;
  platform: "ps4" | "ps5" | null;
  psnId: string | null;
  items: TicketItem[];
  total: number | null;
  message: string;
}

/** Abre o ticket com uma mensagem de sistema e, se houver, a do cliente. */
export async function createTicket(db: TicketsDb, input: NewTicket) {
  const [created] = await db
    .insert(tickets)
    .values({
      userId: input.userId,
      kind: input.kind,
      subject: input.subject,
      platform: input.platform,
      psnId: input.psnId,
      items: input.items,
      total: input.total,
      status: "aberto",
      unreadByAdmin: true,
      unreadByCustomer: false,
    })
    .returning({ id: tickets.id, number: tickets.number });

  await db.insert(ticketMessages).values({
    ticketId: created.id,
    role: "sistema",
    body: "Ticket aberto. O Freitas responde por aqui.",
  });
  if (input.message) {
    await db.insert(ticketMessages).values({
      ticketId: created.id,
      authorId: input.userId,
      role: "cliente",
      body: input.message,
    });
  }
  return created;
}

/** Quantos tickets a pessoa tem andando (para limitar abusos). */
export async function countActiveForUser(db: TicketsDb, userId: string) {
  const [row] = await db
    .select({ n: count() })
    .from(tickets)
    .where(and(eq(tickets.userId, userId), inArray(tickets.status, ACTIVE)));
  return row?.n ?? 0;
}

export async function listTicketsForUser(db: TicketsDb, userId: string) {
  return db
    .select({
      id: tickets.id,
      number: tickets.number,
      kind: tickets.kind,
      subject: tickets.subject,
      status: tickets.status,
      total: tickets.total,
      platform: tickets.platform,
      unread: tickets.unreadByCustomer,
      lastMessageAt: tickets.lastMessageAt,
      createdAt: tickets.createdAt,
    })
    .from(tickets)
    .where(eq(tickets.userId, userId))
    .orderBy(desc(tickets.lastMessageAt))
    .limit(100);
}

export type CustomerTicketSummary = Awaited<ReturnType<typeof listTicketsForUser>>[number];

/** Ticket completo: dados, cliente (com ID do Discord) e mensagens em ordem. */
export async function getTicketByNumber(db: TicketsDb, number: number) {
  if (!Number.isSafeInteger(number) || number <= 0) return null;
  const [row] = await db
    .select({
      ticket: tickets,
      customer: { id: user.id, name: user.name, image: user.image },
    })
    .from(tickets)
    .innerJoin(user, eq(user.id, tickets.userId))
    .where(eq(tickets.number, number))
    .limit(1);
  if (!row) return null;

  const [messages, [discord]] = await Promise.all([
    db
      .select()
      .from(ticketMessages)
      .where(eq(ticketMessages.ticketId, row.ticket.id))
      .orderBy(asc(ticketMessages.createdAt)),
    db
      .select({ id: account.accountId })
      .from(account)
      .where(and(eq(account.userId, row.ticket.userId), eq(account.providerId, "discord")))
      .limit(1),
  ]);

  return {
    ...row.ticket,
    customer: { ...row.customer, discordId: discord?.id ?? null },
    messages,
  };
}

export type FullTicket = NonNullable<Awaited<ReturnType<typeof getTicketByNumber>>>;

/** Dono e situação do ticket (para checar permissão antes de mexer). */
export async function getTicketAccess(db: TicketsDb, ticketId: string) {
  const [row] = await db
    .select({ id: tickets.id, number: tickets.number, userId: tickets.userId, status: tickets.status })
    .from(tickets)
    .where(eq(tickets.id, ticketId))
    .limit(1);
  return row ?? null;
}

export async function addMessage(
  db: TicketsDb,
  input: {
    ticketId: string;
    authorId: string | null;
    role: MessageRole;
    body: string;
    attachments?: TicketAttachment[];
  },
) {
  await db.insert(ticketMessages).values({
    ticketId: input.ticketId,
    authorId: input.authorId,
    role: input.role,
    body: input.body,
    attachments: input.attachments ?? [],
  });
  await db
    .update(tickets)
    .set({
      lastMessageAt: new Date(),
      ...(input.role === "cliente" ? { unreadByAdmin: true } : { unreadByCustomer: true }),
    })
    .where(eq(tickets.id, input.ticketId));
}

/** Muda o andamento e deixa registrado na conversa. Mesmo status: não faz nada. */
export async function setStatus(
  db: TicketsDb,
  input: { ticketId: string; status: TicketStatus; authorId: string | null },
) {
  const [changed] = await db
    .update(tickets)
    .set({
      status: input.status,
      closedAt: input.status === "fechado" ? new Date() : null,
      lastMessageAt: new Date(),
      unreadByCustomer: true,
    })
    .where(and(eq(tickets.id, input.ticketId), ne(tickets.status, input.status)))
    .returning({ id: tickets.id });
  if (!changed) return false;

  await db.insert(ticketMessages).values({
    ticketId: input.ticketId,
    authorId: input.authorId,
    role: "sistema",
    body: `Andamento: ${statusInfo[input.status].label}.`,
  });
  return true;
}

/** Marca como lido pelo cliente ou pelo Freitas. */
export async function markSeen(db: TicketsDb, ticketId: string, side: "cliente" | "freitas") {
  await db
    .update(tickets)
    .set(side === "cliente" ? { unreadByCustomer: false } : { unreadByAdmin: false })
    .where(eq(tickets.id, ticketId));
}

export async function unreadCountForUser(db: TicketsDb, userId: string) {
  const [row] = await db
    .select({ n: count() })
    .from(tickets)
    .where(and(eq(tickets.userId, userId), eq(tickets.unreadByCustomer, true)));
  return row?.n ?? 0;
}

export const ADMIN_FILTERS = ["atencao", "andamento", "entregues", "fechados", "todos"] as const;
export type AdminFilter = (typeof ADMIN_FILTERS)[number];

function adminWhere(filter: AdminFilter) {
  switch (filter) {
    case "atencao":
      return and(eq(tickets.unreadByAdmin, true), ne(tickets.status, "fechado"));
    case "andamento":
      return inArray(tickets.status, ACTIVE);
    case "entregues":
      return eq(tickets.status, "entregue");
    case "fechados":
      return eq(tickets.status, "fechado");
    default:
      return undefined;
  }
}

export async function listTicketsForAdmin(db: TicketsDb, filter: AdminFilter) {
  return db
    .select({
      id: tickets.id,
      number: tickets.number,
      kind: tickets.kind,
      subject: tickets.subject,
      status: tickets.status,
      total: tickets.total,
      platform: tickets.platform,
      unread: tickets.unreadByAdmin,
      lastMessageAt: tickets.lastMessageAt,
      customer: { name: user.name, image: user.image },
    })
    .from(tickets)
    .innerJoin(user, eq(user.id, tickets.userId))
    .where(adminWhere(filter))
    .orderBy(desc(tickets.unreadByAdmin), desc(tickets.lastMessageAt))
    .limit(200);
}

export type AdminTicketSummary = Awaited<ReturnType<typeof listTicketsForAdmin>>[number];

/** Números para as abas do painel. */
export async function adminCounts(db: TicketsDb) {
  const [[attention], [active]] = await Promise.all([
    db
      .select({ n: count() })
      .from(tickets)
      .where(and(eq(tickets.unreadByAdmin, true), ne(tickets.status, "fechado"))),
    db
      .select({ n: count() })
      .from(tickets)
      .where(notInArray(tickets.status, ["entregue", "fechado"])),
  ]);
  return { attention: attention?.n ?? 0, active: active?.n ?? 0 };
}

/** ID do Discord do dono do ticket (para o bot avisar). */
export async function discordIdOf(db: TicketsDb, userId: string) {
  const [row] = await db
    .select({ id: account.accountId })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, "discord")))
    .limit(1);
  return row?.id ?? null;
}
