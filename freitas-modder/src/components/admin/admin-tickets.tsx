import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { PanelTabs } from "@/components/admin/panel-tabs";
import { AutoRefresh } from "@/components/tickets/live";
import { PushToggle } from "@/components/tickets/push-toggle";
import { StatusBadge } from "@/components/tickets/status-badge";
import { formatCents, formatWhen } from "@/lib/tickets/format";
import type { AdminFilter, AdminTicketSummary } from "@/lib/tickets/repo";
import { cn } from "@/lib/utils";

const FILTER_LABELS: Record<AdminFilter, string> = {
  andamento: "Em andamento",
  atencao: "Precisam de resposta",
  entregues: "Entregues",
  fechados: "Fechados",
  todos: "Todos",
};

/** A tela em si (sem buscar nada), para dar para testar com dados de exemplo. */
export function AdminTicketsView({
  tickets,
  counts,
  filter,
}: {
  tickets: AdminTicketSummary[];
  counts: { attention: number; active: number };
  filter: AdminFilter;
}) {
  const order: AdminFilter[] = ["andamento", "atencao", "entregues", "fechados", "todos"];
  return (
    <>
      <PanelTabs active="tickets" attention={counts.attention} />
      <header className="border-b border-white/[0.08] pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-400">Painel do Freitas</p>
        <h1 className="mt-2 font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">Tickets</h1>
        <p className="mt-3 text-stone-400">
          {counts.active} em andamento
          {counts.attention > 0 && (
            <>
              {" "}· <span className="font-semibold text-brand-300">{counts.attention} esperando resposta</span>
            </>
          )}
        </p>
      </header>

      <PushToggle audience="admin" className="mt-6" />

      <nav aria-label="Filtrar tickets" className="mt-6 flex flex-wrap gap-2">
        {order.map((f) => (
          <Link
            key={f}
            href={f === "andamento" ? "/painel/tickets" : `/painel/tickets?filtro=${f}`}
            aria-current={f === filter ? "page" : undefined}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1 ring-inset transition-colors",
              f === filter ? "bg-brand-500 text-white ring-brand-500" : "text-stone-300 ring-white/10 hover:bg-white/[0.06]",
            )}
          >
            {FILTER_LABELS[f]}
            {f === "atencao" && counts.attention > 0 && <span className="tabular-nums">({counts.attention})</span>}
          </Link>
        ))}
      </nav>

      {tickets.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center text-stone-500">
          Nenhum ticket aqui.
        </p>
      ) : (
        <ul className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900">
          {tickets.map((t) => (
            <li key={t.id} className="[&:not(:first-child)]:border-t [&:not(:first-child)]:border-white/[0.07]">
              <Link
                href={`/painel/tickets/${t.number}`}
                className={cn("flex items-center gap-4 p-4 transition-colors hover:bg-white/[0.03]", t.unread && "bg-brand-500/[0.05]")}
              >
                <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-ink-700 font-semibold">
                  {t.customer.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- avatar do Discord
                    <img src={t.customer.image} alt="" className="size-full object-cover" />
                  ) : (
                    t.customer.name.slice(0, 1).toUpperCase()
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-display text-lg font-extrabold tabular-nums text-stone-500">#{t.number}</span>
                    <span className="truncate font-semibold">{t.subject}</span>
                    {t.unread && (
                      <span className="size-2 shrink-0 rounded-full bg-brand-500">
                        <span className="sr-only">Mensagem nova</span>
                      </span>
                    )}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-2 text-sm text-stone-500">
                    <StatusBadge status={t.status} admin />
                    <span>{t.customer.name}</span>
                    <span>· {formatWhen(t.lastMessageAt)}</span>
                    {t.total !== null && <span>· {formatCents(t.total)}</span>}
                  </span>
                </span>
                <ChevronRight className="size-5 shrink-0 text-stone-600" />
              </Link>
            </li>
          ))}
        </ul>
      )}
      <AutoRefresh every={20000} />
    </>
  );
}
