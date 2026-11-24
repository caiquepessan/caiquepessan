"use server";

import { refresh } from "next/cache";
import { after } from "next/server";
import type { FormState } from "@/app/tickets/actions";
import { notifyCustomer } from "@/lib/notify";
import { addMessage, discordIdOf, getTicketAccess, markSeen, setStatus } from "@/lib/tickets/repo";
import { isUuid, parseAttachments, ticketsDb } from "@/lib/tickets/server";
import { isTicketStatus, LIMITS, statusInfo } from "@/lib/tickets/status";
import { requireAdmin } from "@/lib/viewer";

async function loadTicket(formData: FormData) {
  const ticketId = String(formData.get("ticket") ?? "");
  if (!isUuid(ticketId)) return null;
  return getTicketAccess(ticketsDb(), ticketId);
}

/**
 * Resposta do Freitas: texto e/ou imagens (QR Code, provas) e, se escolher,
 * já muda o andamento junto.
 */
export async function adminReply(_prev: FormState, formData: FormData): Promise<FormState> {
  let viewer;
  try {
    viewer = await requireAdmin();
  } catch {
    return { error: "Sua sessão expirou. Entre de novo com o Discord." };
  }
  const ticket = await loadTicket(formData);
  if (!ticket) return { error: "Ticket não encontrado." };

  const body = String(formData.get("mensagem") ?? "").trim().slice(0, LIMITS.message);
  const attachments = parseAttachments(formData.get("anexos"), ticket.id);
  if (attachments === null) return { error: "Algum anexo não deu certo. Tente enviar de novo." };
  const statusField = formData.get("status");
  const status = isTicketStatus(statusField) ? statusField : null;
  if (!body && attachments.length === 0 && !status) {
    return { error: "Escreva uma mensagem, anexe uma imagem ou escolha um andamento." };
  }

  const db = ticketsDb();
  if (body || attachments.length > 0) {
    await addMessage(db, { ticketId: ticket.id, authorId: viewer.id, role: "freitas", body, attachments });
  }
  const changed = status ? await setStatus(db, { ticketId: ticket.id, status, authorId: viewer.id }) : false;
  await markSeen(db, ticket.id, "freitas");

  after(async () =>
    notifyCustomer({ userId: ticket.userId, discordId: await discordIdOf(db, ticket.userId) }, {
      title: `Ticket #${ticket.number}: ${changed && status ? statusInfo[status].label : "o Freitas respondeu"}`,
      description: body || (attachments.length > 0 ? "Mandou imagem na conversa." : status ? statusInfo[status].hint : ""),
      path: `/tickets/${ticket.number}`,
    }),
  );
  refresh();
  return { sent: Date.now() };
}

/** Só muda o andamento (botões do painel). */
export async function adminSetStatus(formData: FormData) {
  const viewer = await requireAdmin();
  const ticket = await loadTicket(formData);
  const status = formData.get("status");
  if (!ticket || !isTicketStatus(status)) return;

  const db = ticketsDb();
  const changed = await setStatus(db, { ticketId: ticket.id, status, authorId: viewer.id });
  await markSeen(db, ticket.id, "freitas");
  if (changed) {
    after(async () =>
      notifyCustomer({ userId: ticket.userId, discordId: await discordIdOf(db, ticket.userId) }, {
        title: `Ticket #${ticket.number}: ${statusInfo[status].label}`,
        description: statusInfo[status].hint,
        path: `/tickets/${ticket.number}`,
      }),
    );
  }
  refresh();
}
