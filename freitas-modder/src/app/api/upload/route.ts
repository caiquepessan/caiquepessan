import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getTicketAccess } from "@/lib/tickets/repo";
import { isUuid, privateBlobToken, ticketsDb } from "@/lib/tickets/server";
import { ATTACHMENT_TYPES, LIMITS } from "@/lib/tickets/status";
import { getViewer } from "@/lib/viewer";

/**
 * Envio de arquivos direto do navegador para o Vercel Blob. Este endereço
 * só gera a autorização:
 * - fotos de produto: só o admin (armazenamento público);
 * - anexos de ticket: o dono do ticket ou o admin (armazenamento privado,
 *   quando ligado), sempre dentro da pasta tickets/<id do ticket>/.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  let ticketId: string | null = null;
  if (body.type === "blob.generate-client-token") {
    try {
      const payload = JSON.parse(body.payload.clientPayload ?? "null") as { kind?: string; ticket?: string } | null;
      if (payload?.kind === "ticket") ticketId = typeof payload.ticket === "string" ? payload.ticket : "";
    } catch {
      // payload inválido: trata como foto de produto (só admin passa)
    }
  }

  try {
    const result = await handleUpload({
      body,
      request,
      token: ticketId !== null ? privateBlobToken() : undefined,
      onBeforeGenerateToken: async (pathname) => {
        const viewer = await getViewer();

        if (ticketId !== null) {
          if (!viewer) throw new Error("Entre com o Discord para enviar arquivos.");
          if (!isUuid(ticketId)) throw new Error("Ticket inválido.");
          const ticket = await getTicketAccess(ticketsDb(), ticketId);
          if (!ticket || (!viewer.isAdmin && ticket.userId !== viewer.id)) {
            throw new Error("Ticket não encontrado.");
          }
          if (ticket.status === "fechado" && !viewer.isAdmin) throw new Error("Este ticket está fechado.");
          if (!pathname.startsWith(`tickets/${ticketId}/`)) throw new Error("Pasta inválida.");
          return {
            allowedContentTypes: ATTACHMENT_TYPES,
            maximumSizeInBytes: LIMITS.attachmentBytes,
            addRandomSuffix: true,
          };
        }

        if (!viewer?.isAdmin) throw new Error("Sem permissão para enviar fotos.");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Falha no envio." },
      { status: 400 },
    );
  }
}
