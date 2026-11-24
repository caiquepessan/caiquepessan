import "server-only";
import webpush from "web-push";
import { siteConfig } from "@/config/site";
import { hasDatabase } from "@/db";
import { adminDiscordIds } from "@/lib/auth";
import { adminUserIds, deletePushSubscription, subscriptionsForUsers } from "@/lib/push-repo";
import { ticketsDb } from "@/lib/tickets/server";
import { vapidKeys } from "@/lib/vapid";

/** Serviços de push dos navegadores (Chrome/Android, Firefox, Edge, Safari/iPhone). */
const PUSH_HOSTS = ["fcm.googleapis.com", "android.googleapis.com", "push.services.mozilla.com", "notify.windows.com", "push.apple.com"];

export function isPushEndpoint(endpoint: unknown): endpoint is string {
  if (typeof endpoint !== "string" || endpoint.length > 1000) return false;
  try {
    const url = new URL(endpoint);
    return url.protocol === "https:" && PUSH_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export function pushEnabled() {
  return hasDatabase() && vapidKeys() !== null;
}

export interface PushMessage {
  title: string;
  body: string;
  /** Caminho aberto ao tocar na notificação, ex.: /tickets/1001 */
  url: string;
  /** Notificações com a mesma tag se substituem (ex.: ticket-1001). */
  tag?: string;
}

/** Manda a notificação para todos os aparelhos dessas pessoas. Aparelho que sumiu é apagado. */
export async function sendPush(userIds: string[], message: PushMessage) {
  const keys = vapidKeys();
  if (!keys || !hasDatabase() || userIds.length === 0) return;
  const db = ticketsDb();
  const targets = await subscriptionsForUsers(db, userIds);
  if (targets.length === 0) return;

  const payload = JSON.stringify({
    ...message,
    body: message.body.replace(/\*\*/g, "").slice(0, 240),
    icon: "/notificacao-icone.png",
    badge: "/notificacao-badge.png",
  });

  await Promise.all(
    targets.map(async (target) => {
      try {
        await webpush.sendNotification(
          { endpoint: target.endpoint, keys: { p256dh: target.p256dh, auth: target.auth } },
          payload,
          {
            vapidDetails: { subject: siteConfig.url, publicKey: keys.publicKey, privateKey: keys.privateKey },
            TTL: 60 * 60 * 24,
            urgency: "high",
            timeout: 5000,
          },
        );
      } catch (error) {
        const status = (error as { statusCode?: number }).statusCode;
        // 404/410: o navegador desativou essa inscrição
        if (status === 404 || status === 410) await deletePushSubscription(db, target.endpoint);
        else console.error("[push] não consegui enviar", status ?? error);
      }
    }),
  );
}

/** Todos os aparelhos dos admins (ADMIN_DISCORD_IDS). */
export async function sendPushToAdmins(message: PushMessage) {
  if (!pushEnabled()) return;
  const ids = await adminUserIds(ticketsDb(), adminDiscordIds());
  await sendPush(ids, message);
}
