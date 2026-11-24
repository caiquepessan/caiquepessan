import { ChevronRight, MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { formatCents, formatWhen } from "@/lib/tickets/format";
import type { CustomerTicketSummary } from "@/lib/tickets/repo";
import { StatusBadge } from "./status-badge";

/** Lista de tickets do cliente. */
export function TicketList({ tickets }: { tickets: CustomerTicketSummary[] }) {
  if (tickets.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 px-6 py-12 text-center">
        <MessageSquarePlus className="mx-auto size-10 text-stone-600" strokeWidth={1.5} />
        <p className="mt-4 text-lg font-semibold">Você ainda não abriu nenhum ticket</p>
        <p className="mx-auto mt-1 max-w-sm text-[15px] text-stone-400">
          Escolha um pacote na loja e clique em pedir. O ticket é onde você e o Freitas combinam tudo.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/loja">Ver preços</ButtonLink>
          <ButtonLink href="/tickets/novo" variant="secondary">
            Outro assunto
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <ul className="overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900">
      {tickets.map((t) => (
        <li key={t.id} className="[&:not(:first-child)]:border-t [&:not(:first-child)]:border-white/[0.07]">
          <Link
            href={`/tickets/${t.number}`}
            className="flex items-center gap-4 p-4 transition-colors hover:bg-white/[0.03] sm:p-5"
          >
            <span className="relative font-display text-2xl font-extrabold tabular-nums text-stone-500">
              #{t.number}
              {t.unread && (
                <span className="absolute -right-2.5 top-0.5 size-2.5 rounded-full bg-brand-500 ring-2 ring-ink-900">
                  <span className="sr-only">Resposta nova</span>
                </span>
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">{t.subject}</span>
              <span className="mt-1 flex flex-wrap items-center gap-2 text-sm text-stone-500">
                <StatusBadge status={t.status} />
                <span>{formatWhen(t.lastMessageAt)}</span>
                {t.total !== null && <span>· {formatCents(t.total)}</span>}
              </span>
            </span>
            <ChevronRight className="size-5 shrink-0 text-stone-600" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
