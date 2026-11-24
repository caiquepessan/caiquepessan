import { connection } from "next/server";
import { hasDatabase } from "@/db";
import { adminCounts, unreadCountForUser } from "@/lib/tickets/repo";
import { ticketsDb } from "@/lib/tickets/server";
import { getViewer } from "@/lib/viewer";

/** Quantos tickets têm novidade para quem está logado (bolinha no menu). */
export async function GET() {
  // Sempre na hora (depende de quem está logado), nunca gerado no build
  await connection();
  const viewer = hasDatabase() ? await getViewer() : null;
  if (!viewer) return Response.json({ customer: 0, admin: 0 });
  const db = ticketsDb();
  const [customer, admin] = await Promise.all([
    unreadCountForUser(db, viewer.id),
    viewer.isAdmin ? adminCounts(db).then((c) => c.attention) : Promise.resolve(0),
  ]);
  return Response.json(
    { customer, admin },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
