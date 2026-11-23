import type { ReactNode } from "react";
import { authConfigured } from "@/lib/auth";
import { getViewer } from "@/lib/viewer";
import { LoginCard, NoAccessCard, SetupCard } from "./gate-cards";

/**
 * Só mostra o conteúdo para o admin. Lê o cookie da sessão, então fica
 * sempre dentro de um <Suspense>.
 */
export async function AdminGate({ children }: { children: ReactNode }) {
  if (!authConfigured()) return <SetupCard />;
  const viewer = await getViewer();
  if (!viewer) return <LoginCard />;
  if (!viewer.isAdmin) return <NoAccessCard name={viewer.name} discordId={viewer.discordId} />;
  return children;
}

export function PanelSkeleton() {
  const block = "animate-pulse rounded-2xl bg-white/[0.04]";
  return (
    <div aria-busy="true" aria-label="Carregando o painel">
      <div className={`${block} h-14 w-64`} />
      <div className={`${block} mt-10 h-24`} />
      <div className={`${block} mt-3 h-24`} />
      <div className={`${block} mt-3 h-24`} />
    </div>
  );
}
