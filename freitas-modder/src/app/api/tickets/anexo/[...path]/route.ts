import { get } from "@vercel/blob";
import { getTicketAccess } from "@/lib/tickets/repo";
import { isUuid, privateBlobToken, ticketsDb } from "@/lib/tickets/server";
import { getViewer } from "@/lib/viewer";

/**
 * Mostra um anexo privado de ticket (comprovante, QR Code, provas) só para
 * quem pode ver o ticket: o cliente dono dele ou o admin.
 */
export async function GET(_request: Request, ctx: RouteContext<"/api/tickets/anexo/[...path]">) {
  const { path } = await ctx.params;
  const [folder, ticketId] = path;
  const token = privateBlobToken();
  if (folder !== "tickets" || !isUuid(ticketId) || path.length < 3 || !token) {
    return new Response("Não encontrado", { status: 404 });
  }

  const viewer = await getViewer();
  if (!viewer) return new Response("Entre com o Discord", { status: 401 });
  const ticket = await getTicketAccess(ticketsDb(), ticketId);
  if (!ticket || (!viewer.isAdmin && ticket.userId !== viewer.id)) {
    return new Response("Não encontrado", { status: 404 });
  }

  const file = await get(path.join("/"), { access: "private", token });
  if (!file || file.statusCode !== 200) return new Response("Não encontrado", { status: 404 });

  return new Response(file.stream, {
    headers: {
      "Content-Type": file.blob.contentType,
      "Content-Length": String(file.blob.size),
      // Só no navegador de quem abriu, nunca em cache compartilhado
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
