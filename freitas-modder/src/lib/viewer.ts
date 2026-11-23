import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { authConfigured, getAuth } from "./auth";

export interface Viewer {
  id: string;
  name: string;
  image: string | null;
  discordId: string | null;
  isAdmin: boolean;
}

/**
 * Quem está logado agora (ou null). Lê o cookie: use dentro de <Suspense>.
 * `cache` faz a leitura acontecer uma vez só por requisição.
 */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  if (!authConfigured()) return null;
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) return null;
  return {
    id: session.user.id,
    name: session.user.name,
    image: session.user.image ?? null,
    discordId: session.user.discordId ?? null,
    isAdmin: session.user.isAdmin,
  };
});

/** Para Server Actions e rotas: barra quem não é admin. */
export async function requireAdmin() {
  const viewer = await getViewer();
  if (!viewer?.isAdmin) throw new Error("Sem permissão para mexer no painel.");
  return viewer;
}
