import type { ReactNode } from "react";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { ButtonAnchor } from "@/components/ui/button";
import { authConfigured } from "@/lib/auth";
import { defaultWhatsappMessage, whatsappLink } from "@/lib/whatsapp";
import { getViewer } from "@/lib/viewer";
import { LoginRequired } from "./login-required";

/** Só mostra o conteúdo para quem entrou com o Discord. Fica dentro de <Suspense>. */
export async function CustomerGate({
  children,
  title,
  text,
}: {
  children: ReactNode;
  title: string;
  text: string;
}) {
  if (!authConfigured()) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-white/[0.08] bg-ink-900 p-7 sm:p-9">
        <h1 className="font-display text-4xl font-extrabold uppercase leading-none">Tickets em breve</h1>
        <p className="mt-5 text-stone-300">Enquanto isso, fale com a gente pelo WhatsApp.</p>
        <ButtonAnchor href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer" className="mt-6">
          <WhatsAppIcon size={18} /> Chamar no WhatsApp
        </ButtonAnchor>
      </div>
    );
  }
  const viewer = await getViewer();
  if (!viewer) return <LoginRequired title={title} text={text} />;
  return children;
}

export function TicketsSkeleton() {
  const block = "animate-pulse rounded-2xl bg-white/[0.04]";
  return (
    <div aria-busy="true" aria-label="Carregando">
      <div className={`${block} h-12 w-56`} />
      <div className={`${block} mt-8 h-24`} />
      <div className={`${block} mt-3 h-24`} />
      <div className={`${block} mt-3 h-40`} />
    </div>
  );
}
