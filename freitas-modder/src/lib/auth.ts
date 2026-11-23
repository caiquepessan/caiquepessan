import "server-only";
import { and, eq } from "drizzle-orm";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";
import { siteConfig } from "@/config/site";
import { getDb, schema } from "@/db";

/**
 * Login com Discord (Better Auth). Precisa de quatro variáveis na Vercel:
 * DATABASE_URL (já vem do Neon), BETTER_AUTH_SECRET, DISCORD_CLIENT_ID e
 * DISCORD_CLIENT_SECRET. Sem elas, o site funciona normal e só o login
 * fica desligado.
 */
export function authConfigured() {
  return Boolean(
    process.env.DATABASE_URL &&
      process.env.BETTER_AUTH_SECRET &&
      process.env.DISCORD_CLIENT_ID &&
      process.env.DISCORD_CLIENT_SECRET,
  );
}

/** IDs do Discord com acesso ao painel (variável ADMIN_DISCORD_IDS, separados por vírgula). */
export function adminDiscordIds() {
  return (process.env.ADMIN_DISCORD_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export function isAdminDiscordId(discordId: string | null | undefined) {
  return Boolean(discordId) && adminDiscordIds().includes(discordId!);
}

/**
 * ID do Discord da pessoa. Vem da tabela de contas, que só o login com o
 * Discord preenche (ninguém consegue editar pelo site).
 */
async function findDiscordId(userId: string) {
  const [row] = await getDb()
    .select({ id: schema.account.accountId })
    .from(schema.account)
    .where(and(eq(schema.account.userId, userId), eq(schema.account.providerId, "discord")))
    .limit(1);
  return row?.id ?? null;
}

function createAuth() {
  const options = {
    appName: siteConfig.name,
    baseURL: siteConfig.url,
    secret: process.env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDb(), {
      provider: "pg",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    socialProviders: {
      discord: {
        clientId: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      },
    },
    // Guarda a sessão num cookie assinado por 5 minutos: menos idas ao banco.
    session: { cookieCache: { enabled: true, maxAge: 5 * 60 } },
  } satisfies BetterAuthOptions;

  return betterAuth({
    ...options,
    plugins: [
      // Diz na sessão se a pessoa é admin (o botão Painel usa isso).
      customSession(async ({ user, session }) => {
        const discordId = await findDiscordId(user.id);
        return { user: { ...user, discordId, isAdmin: isAdminDiscordId(discordId) }, session };
      }, options),
      nextCookies(),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;

let instance: Auth | undefined;

export function getAuth() {
  instance ??= createAuth();
  return instance;
}
