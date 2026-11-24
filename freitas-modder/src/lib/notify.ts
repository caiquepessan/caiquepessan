import "server-only";
import { siteConfig } from "@/config/site";
import { adminDiscordIds } from "@/lib/auth";

/**
 * Avisos dos tickets pelo Discord. Os dois são opcionais (variáveis na Vercel):
 * - DISCORD_BOT_TOKEN: o bot manda mensagem no privado (para o Freitas quando
 *   o cliente escreve, e para o cliente quando o Freitas responde).
 * - DISCORD_TICKETS_WEBHOOK_URL: posta num canal (ex.: #tickets).
 * Se falhar (DM fechada, por exemplo), o ticket segue normal.
 */

const RED = 0xe8182c;
const API = "https://discord.com/api/v10";

interface Notice {
  title: string;
  description: string;
  /** Caminho no site, ex.: /painel/tickets/1001 */
  path: string;
}

function embed({ title, description, path }: Notice) {
  return {
    title: title.slice(0, 250),
    description: description.slice(0, 1500),
    url: `${siteConfig.url}${path}`,
    color: RED,
    timestamp: new Date().toISOString(),
  };
}

async function dm(discordId: string, notice: Notice) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token || !/^\d{15,22}$/.test(discordId)) return;
  const headers = { Authorization: `Bot ${token}`, "Content-Type": "application/json" };
  const channel = await fetch(`${API}/users/@me/channels`, {
    method: "POST",
    headers,
    body: JSON.stringify({ recipient_id: discordId }),
    signal: AbortSignal.timeout(5000),
  });
  if (!channel.ok) return;
  const { id } = (await channel.json()) as { id: string };
  await fetch(`${API}/channels/${id}/messages`, {
    method: "POST",
    headers,
    body: JSON.stringify({ embeds: [embed(notice)] }),
    signal: AbortSignal.timeout(5000),
  });
}

async function webhook(notice: Notice) {
  const url = process.env.DISCORD_TICKETS_WEBHOOK_URL;
  if (!url || !/^https:\/\/(?:\w+\.)?discord(?:app)?\.com\/api\/webhooks\//.test(url)) return;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: `${siteConfig.name} · Tickets`, embeds: [embed(notice)] }),
    signal: AbortSignal.timeout(5000),
  });
}

async function safely(task: () => Promise<unknown>) {
  try {
    await task();
  } catch (error) {
    console.error("[tickets] aviso no Discord falhou", error);
  }
}

/** Cliente abriu ou respondeu: avisa o Freitas. */
export async function notifyAdmins(notice: Notice) {
  await Promise.all([
    safely(() => webhook(notice)),
    ...adminDiscordIds().map((id) => safely(() => dm(id, notice))),
  ]);
}

/** Freitas respondeu ou mudou o andamento: avisa o cliente. */
export async function notifyCustomer(discordId: string | null, notice: Notice) {
  if (!discordId) return;
  await safely(() => dm(discordId, notice));
}
