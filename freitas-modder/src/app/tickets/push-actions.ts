"use server";

import { headers } from "next/headers";
import { deletePushSubscription, savePushSubscription } from "@/lib/push-repo";
import { isPushEndpoint, pushEnabled, sendPush } from "@/lib/push";
import { ticketsDb } from "@/lib/tickets/server";
import { getViewer } from "@/lib/viewer";

const KEY = /^[A-Za-z0-9_-]{16,200}$/;

/** Guarda o aparelho para receber avisos de tickets. */
export async function savePush(subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}): Promise<{ ok: boolean; error?: string }> {
  const viewer = await getViewer();
  if (!viewer) return { ok: false, error: "Entre com o Discord primeiro." };
  if (!pushEnabled()) return { ok: false, error: "As notificações ainda não estão ligadas no site." };
  const { endpoint, keys } = subscription ?? {};
  if (!isPushEndpoint(endpoint) || !KEY.test(keys?.p256dh ?? "") || !KEY.test(keys?.auth ?? "")) {
    return { ok: false, error: "Este navegador mandou um endereço de aviso inválido." };
  }
  const userAgent = (await headers()).get("user-agent")?.slice(0, 200) ?? null;
  await savePushSubscription(ticketsDb(), {
    userId: viewer.id,
    endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
    userAgent,
  });
  return { ok: true };
}

export async function removePush(endpoint: string) {
  const viewer = await getViewer();
  if (!viewer || typeof endpoint !== "string") return;
  await deletePushSubscription(ticketsDb(), endpoint, viewer.id);
}

/** Notificação de teste logo depois de ativar. */
export async function testPush() {
  const viewer = await getViewer();
  if (!viewer) return;
  await sendPush([viewer.id], {
    title: "Avisos ligados neste aparelho",
    body: viewer.isAdmin
      ? "Você vai receber aviso de ticket novo e de resposta de cliente."
      : "Você vai receber aviso quando o Freitas responder seus tickets.",
    url: viewer.isAdmin ? "/painel/tickets" : "/tickets",
    tag: "teste",
  });
}
