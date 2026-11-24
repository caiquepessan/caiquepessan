import "server-only";
import { getDb } from "@/db";
import type { TicketAttachment } from "@/db/schema";
import { ATTACHMENT_TYPES, LIMITS } from "./status";
import type { TicketsDb } from "./repo";

export function ticketsDb(): TicketsDb {
  return getDb() as unknown as TicketsDb;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

/** Armazenamento privado dos anexos (se estiver ligado ao projeto). */
export function privateBlobToken() {
  return process.env.TICKETS_BLOB_READ_WRITE_TOKEN || undefined;
}

/**
 * Confere os anexos que o navegador mandou: só imagem, do Vercel Blob e
 * dentro da pasta deste ticket. null = algo errado.
 */
export function parseAttachments(raw: FormDataEntryValue | null, ticketId: string): TicketAttachment[] | null {
  if (!raw) return [];
  let list: unknown;
  try {
    list = JSON.parse(String(raw));
  } catch {
    return null;
  }
  if (!Array.isArray(list) || list.length > LIMITS.attachmentsPerMessage) return null;

  const out: TicketAttachment[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") return null;
    const { url, pathname, contentType, size, name } = item as Record<string, unknown>;
    if (typeof url !== "string" || typeof pathname !== "string") return null;
    if (typeof contentType !== "string" || !ATTACHMENT_TYPES.includes(contentType)) return null;
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return null;
    }
    if (parsed.protocol !== "https:" || !parsed.hostname.endsWith(".blob.vercel-storage.com")) return null;
    if (!pathname.startsWith(`tickets/${ticketId}/`) || decodeURIComponent(parsed.pathname) !== `/${pathname}`) {
      return null;
    }
    out.push({
      url,
      pathname,
      contentType,
      size: typeof size === "number" && size > 0 ? Math.min(size, LIMITS.attachmentBytes) : 0,
      name: typeof name === "string" ? name.slice(0, 120) : "imagem",
      private: parsed.hostname.includes(".private."),
    });
  }
  return out;
}
