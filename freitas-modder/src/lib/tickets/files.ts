import type { TicketAttachment } from "@/db/schema";

/** O site foi publicado com o armazenamento privado dos anexos ligado. */
export const PRIVATE_UPLOADS = process.env.NEXT_PUBLIC_TICKETS_PRIVATE === "1";

/** Endereço para mostrar o anexo: os privados passam pelo site (com login). */
export function attachmentSrc(attachment: TicketAttachment) {
  return attachment.private ? `/api/tickets/anexo/${attachment.pathname}` : attachment.url;
}
