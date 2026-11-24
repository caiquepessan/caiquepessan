"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { getCatalog } from "@/lib/catalog";
import { notifyAdmins } from "@/lib/notify";
import { formatCents } from "@/lib/tickets/format";
import { parseOrder } from "@/lib/tickets/order";
import { addMessage, countActiveForUser, createTicket, getTicketAccess, markSeen } from "@/lib/tickets/repo";
import { isUuid, parseAttachments, ticketsDb } from "@/lib/tickets/server";
import { LIMITS } from "@/lib/tickets/status";
import { getViewer } from "@/lib/viewer";

export interface FormState {
  error?: string;
  /** Muda a cada envio que deu certo (o formulário usa para se limpar). */
  sent?: number;
}

/** Abre um ticket (pedido do carrinho, de um produto ou assunto livre). */
export async function openTicket(_prev: FormState, formData: FormData): Promise<FormState> {
  const viewer = await getViewer();
  if (!viewer) return { error: "Entre com o Discord para abrir o ticket." };

  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("pedido") ?? ""));
  } catch {
    return { error: "Não consegui ler o pedido. Recarregue a página." };
  }
  const order = parseOrder(raw, await getCatalog());
  if ("error" in order) return { error: order.error };

  const db = ticketsDb();
  if ((await countActiveForUser(db, viewer.id)) >= LIMITS.openPerCustomer) {
    return {
      error: `Você já tem ${LIMITS.openPerCustomer} tickets em andamento. Responda por lá ou espere algum ser entregue.`,
    };
  }

  const created = await createTicket(db, {
    userId: viewer.id,
    kind: order.kind,
    subject: order.subject,
    platform: order.platform,
    psnId: order.psnId,
    items: order.items,
    total: order.total,
    message: order.message,
  });

  after(() =>
    notifyAdmins({
      title: `Ticket #${created.number} aberto`,
      description: [
        `**${viewer.name}**: ${order.subject}`,
        order.total !== null ? `Total: ${formatCents(order.total)}` : "Preço a combinar",
        order.psnId ? `PSN: ${order.psnId}` : "",
        order.message,
      ]
        .filter(Boolean)
        .join("\n"),
      path: `/painel/tickets/${created.number}`,
    }),
  );

  redirect(`/tickets/${created.number}?novo=1${order.fromCart ? "&de=carrinho" : ""}`);
}

/** Mensagem do cliente no próprio ticket. */
export async function sendCustomerMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const viewer = await getViewer();
  if (!viewer) return { error: "Sua sessão acabou. Entre de novo com o Discord." };

  const ticketId = String(formData.get("ticket") ?? "");
  if (!isUuid(ticketId)) return { error: "Ticket não encontrado." };
  const db = ticketsDb();
  const ticket = await getTicketAccess(db, ticketId);
  if (!ticket || ticket.userId !== viewer.id) return { error: "Ticket não encontrado." };
  if (ticket.status === "fechado") return { error: "Este ticket está fechado. Se precisar, abra um novo." };

  const body = String(formData.get("mensagem") ?? "").trim().slice(0, LIMITS.message);
  const attachments = parseAttachments(formData.get("anexos"), ticketId);
  if (attachments === null) return { error: "Algum anexo não deu certo. Tente enviar de novo." };
  if (!body && attachments.length === 0) return { error: "Escreva uma mensagem ou anexe uma imagem." };

  await addMessage(db, { ticketId, authorId: viewer.id, role: "cliente", body, attachments });

  after(() =>
    notifyAdmins({
      title: `Ticket #${ticket.number}: ${viewer.name} respondeu`,
      description: body || `Mandou ${attachments.length === 1 ? "uma imagem" : `${attachments.length} imagens`}.`,
      path: `/painel/tickets/${ticket.number}`,
    }),
  );
  refresh();
  return { sent: Date.now() };
}

/** Marca o ticket como lido (pelo cliente na página dele, ou pelo Freitas no painel). */
export async function markTicketSeen(ticketId: string, side: "cliente" | "freitas") {
  const viewer = await getViewer();
  if (!viewer || !isUuid(ticketId)) return;
  const db = ticketsDb();
  const ticket = await getTicketAccess(db, ticketId);
  if (!ticket) return;
  if (side === "cliente" && ticket.userId === viewer.id) await markSeen(db, ticketId, "cliente");
  if (side === "freitas" && viewer.isAdmin) await markSeen(db, ticketId, "freitas");
}
