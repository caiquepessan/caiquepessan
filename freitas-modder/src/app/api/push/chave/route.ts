import { connection } from "next/server";
import { pushEnabled } from "@/lib/push";
import { vapidKeys } from "@/lib/vapid";

/** Chave pública das notificações (o navegador precisa dela para ativar). */
export async function GET() {
  await connection();
  const publicKey = pushEnabled() ? (vapidKeys()?.publicKey ?? null) : null;
  return Response.json({ publicKey }, { headers: { "Cache-Control": "public, max-age=3600" } });
}
