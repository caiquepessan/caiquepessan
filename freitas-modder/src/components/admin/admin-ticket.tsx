import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { adminReply, adminSetStatus } from "@/app/painel/tickets/actions";
import { PanelTabs } from "@/components/admin/panel-tabs";
import { Conversation } from "@/components/tickets/conversation";
import { AutoRefresh, MarkSeen } from "@/components/tickets/live";
import { ReplyForm, type ReplyTemplate } from "@/components/tickets/reply-form";
import { StatusBadge } from "@/components/tickets/status-badge";
import { TicketItems } from "@/components/tickets/ticket-items";
import { TicketProgress } from "@/components/tickets/ticket-progress";
import { CopyText } from "@/components/ui/copy-text";
import { siteConfig } from "@/config/site";
import { formatCents, formatWhen } from "@/lib/tickets/format";
import type { FullTicket } from "@/lib/tickets/repo";
import { statusInfo, TICKET_STATUSES } from "@/lib/tickets/status";
import { cn } from "@/lib/utils";

function templatesFor(ticket: FullTicket): ReplyTemplate[] {
  const value = ticket.total !== null ? formatCents(ticket.total) : "(valor)";
  const pix = siteConfig.business.pixKey || "(sua chave Pix)";
  const forAccount = ticket.kind !== "conta";
  return [
    {
      label: "Valor e Pix",
      text: `Fechado! Fica ${value} no Pix.\nChave Pix: ${pix}\nDepois de pagar, manda o comprovante aqui.`,
      status: "aguardando_pagamento",
    },
    {
      label: "Pagamento ok",
      text: forAccount
        ? "Pagamento confirmado! Agora vou te mandar o QR Code para liberar o acesso à sua conta."
        : "Pagamento confirmado! Já vou te mandar os dados da conta.",
      status: "pago",
    },
    ...(forAccount
      ? ([
          {
            label: "QR Code",
            text: "Escaneie este QR Code com o app da PlayStation no seu celular para liberar meu acesso à sua conta. Você não precisa me passar sua senha. Se expirar, me avisa que eu mando outro.",
            status: "aguardando_acesso",
          },
          {
            label: "Comecei",
            text: "Entrei na sua conta e já estou fazendo. Evite entrar no jogo até eu avisar que terminei.",
            status: "em_andamento",
          },
        ] satisfies ReplyTemplate[])
      : []),
    {
      label: "Entregue",
      text: forAccount
        ? "Pronto! Seguem as provas. Pode entrar no jogo e conferir. Qualquer coisa é só chamar aqui."
        : "Pronto! Os dados da conta estão acima. Troque o e-mail e a senha assim que entrar.",
      status: "entregue",
    },
  ];
}

/** Ticket aberto no painel: conversa, resposta e andamento. */
export function AdminTicketView({ ticket, attention }: { ticket: FullTicket; attention: number }) {
  return (
    <>
      <PanelTabs active="tickets" attention={attention} />
      <Link href="/painel/tickets" className="inline-flex items-center gap-1.5 text-[15px] text-stone-400 hover:text-white">
        <ArrowLeft className="size-4" /> Tickets
      </Link>

      <header className="mt-3 border-b border-white/[0.08] pb-6">
        <p className="font-display text-2xl font-extrabold text-stone-500">#{ticket.number}</p>
        <h1 className="mt-1 font-display text-4xl font-extrabold uppercase leading-none sm:text-5xl">{ticket.subject}</h1>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-stone-500">
          <StatusBadge status={ticket.status} admin />
          Aberto em {formatWhen(ticket.createdAt)} · última mensagem {formatWhen(ticket.lastMessageAt)}
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="min-w-0">
          <TicketProgress kind={ticket.kind} status={ticket.status} />
          <section className="mt-8" aria-label="Conversa com o cliente">
            <Conversation messages={ticket.messages} perspective="freitas" customer={ticket.customer} />
          </section>
          <div className="mt-8">
            <ReplyForm
              ticketId={ticket.id}
              action={adminReply}
              placeholder="Responda o cliente. Para o QR Code ou as provas, anexe a imagem (dá pra colar print com Ctrl+V)."
              templates={templatesFor(ticket)}
              withStatus
            />
          </div>
        </div>

        <aside className="grid gap-4 lg:sticky lg:top-28">
          <section className="rounded-2xl border border-white/[0.08] bg-ink-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-stone-500">Cliente</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-ink-700 font-semibold">
                {ticket.customer.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- avatar do Discord
                  <img src={ticket.customer.image} alt="" className="size-full object-cover" />
                ) : (
                  ticket.customer.name.slice(0, 1).toUpperCase()
                )}
              </span>
              <p className="min-w-0 truncate font-semibold">{ticket.customer.name}</p>
            </div>
            {ticket.customer.discordId && (
              <div className="mt-3">
                <p className="mb-1 text-xs text-stone-500">ID do Discord</p>
                <CopyText value={ticket.customer.discordId} />
              </div>
            )}
          </section>

          <TicketItems items={ticket.items} total={ticket.total} psnId={ticket.psnId} />

          <section className="rounded-2xl border border-white/[0.08] bg-ink-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-stone-500">Andamento</p>
            <form action={adminSetStatus} className="mt-3 grid gap-1.5">
              <input type="hidden" name="ticket" value={ticket.id} />
              {TICKET_STATUSES.map((status) => {
                const current = status === ticket.status;
                return (
                  <button
                    key={status}
                    type="submit"
                    name="status"
                    value={status}
                    disabled={current}
                    className={cn(
                      "flex h-10 items-center justify-between rounded-xl px-3 text-left text-[15px] font-semibold transition-colors",
                      current
                        ? "bg-white/[0.08] text-white ring-1 ring-inset ring-white/15"
                        : "text-stone-400 hover:bg-white/[0.05] hover:text-white",
                      status === "fechado" && !current && "text-stone-500",
                    )}
                  >
                    {statusInfo[status].adminLabel}
                    {current && <span className="text-xs font-medium text-stone-400">atual</span>}
                  </button>
                );
              })}
            </form>
            <p className="mt-3 text-xs leading-relaxed text-stone-500">
              Mudar o andamento fica registrado na conversa e avisa o cliente.
            </p>
          </section>
        </aside>
      </div>

      <AutoRefresh every={10000} />
      <MarkSeen ticketId={ticket.id} side="freitas" unread={ticket.unreadByAdmin} />
    </>
  );
}
