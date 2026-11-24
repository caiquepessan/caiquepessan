/**
 * Aparelhos com notificação ativada. Recebe o banco por parâmetro (no site
 * é o Neon; no teste, PGlite).
 */
import { and, eq, inArray } from "drizzle-orm";
import { account, pushSubscriptions } from "@/db/schema";
import type { TicketsDb } from "@/lib/tickets/repo";

export interface PushTarget {
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent: string | null;
}

/** Salva (ou atualiza) o aparelho. O mesmo endereço passa para quem ativou por último. */
export async function savePushSubscription(db: TicketsDb, target: PushTarget) {
  await db
    .insert(pushSubscriptions)
    .values(target)
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: { userId: target.userId, p256dh: target.p256dh, auth: target.auth, userAgent: target.userAgent },
    });
}

export async function deletePushSubscription(db: TicketsDb, endpoint: string, userId?: string) {
  await db
    .delete(pushSubscriptions)
    .where(
      userId
        ? and(eq(pushSubscriptions.endpoint, endpoint), eq(pushSubscriptions.userId, userId))
        : eq(pushSubscriptions.endpoint, endpoint),
    );
}

export async function subscriptionsForUsers(db: TicketsDb, userIds: string[]) {
  if (userIds.length === 0) return [];
  return db.select().from(pushSubscriptions).where(inArray(pushSubscriptions.userId, userIds));
}

/** Contas do site dos admins (pelos IDs do Discord de ADMIN_DISCORD_IDS). */
export async function adminUserIds(db: TicketsDb, discordIds: string[]) {
  if (discordIds.length === 0) return [];
  const rows = await db
    .select({ userId: account.userId })
    .from(account)
    .where(and(eq(account.providerId, "discord"), inArray(account.accountId, discordIds)));
  return rows.map((r) => r.userId);
}
