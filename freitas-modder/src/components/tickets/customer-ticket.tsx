import { ArrowLeft, CheckCircle2, Info } from "lucide-react";
import Link from "next/link";
import { sendCustomerMessage } from "@/app/tickets/actions";
import { ButtonLink } from "@/components/ui/button";
import { formatWhen } from "@/lib/tickets/format";
import type { FullTicket } from "@/lib/tickets/repo";
import { statusInfo } from "@/lib/tickets/status";
import { cn } from "@/lib/utils";
import { Conversation } from "./conversation";
import { AutoRefresh, ClearCartAfterOrder, MarkSeen } from "./live";
import { PushToggle } from "./push-toggle";
import { ReplyForm } from "./reply-form";
import { StatusBadge } from "./status-badge";
import { TicketItems } from "./ticket-items";
import { TicketProgress } from "./ticket-progress";

/** Ticket visto pelo cliente: andamento, o que fazer agora e a conversa. */
export function CustomerTicketView({
  ticket,
  justOpened = false,
  fromCart = false,
}: {
  ticket: FullTicket;
  justOpened?: boolean;
  fromCart?: boolean;
}) {
  const info = statusInfo[ticket.status];
  const closed = ticket.status === "fechado";

  return (
    <>
      <Link href="/tickets" className="inline-flex items-center gap-1.5 text-[15px] text-stone-400 hover:text-white">
        <ArrowLeft className="size-4" /> Seus tickets
      </Link>

      <header className="mt-3">
        <p className="font-display text-2xl font-extrabold text-stone-500">#{ticket.number}</p>
        <h1 className="mt-1 font-display text-4xl font-extrabold uppercase leading-none sm:text-5xl">
          {ticket.subject}
        </h1>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-stone-500">
          <StatusBadge status={ticket.status} />
          Aberto em {formatWhen(ticket.createdAt)}
        </p>
      </header>

      {justOpened && (
        <p className="mt-6 flex items-center gap-2.5 rounded-2xl bg-emerald-500/10 px-4 py-3 text-[15px] text-emerald-300 ring-1 ring-inset ring-emerald-500/25">
          <CheckCircle2 className="size-5 shrink-0" />
          Ticket aberto! O Freitas foi avisado e responde por aqui.
        </p>
      )}

      <div className="mt-8 grid gap-4">
        <TicketProgress kind={ticket.kind} status={ticket.status} />
        <div
          className={cn(
            "flex gap-3 rounded-2xl px-4 py-3.5 text-[15px] leading-relaxed ring-1 ring-inset",
            closed ? "bg-white/[0.03] text-stone-400 ring-white/10" : "bg-brand-500/[0.08] text-stone-200 ring-brand-500/25",
          )}
        >
          <Info className={cn("mt-0.5 size-5 shrink-0", closed ? "text-stone-500" : "text-brand-400")} />
          <p>
            <span className="font-semibold text-white">Agora: </span>
            {info.hint}
            {ticket.status === "aguardando_acesso" &&
              " Dica: abra este ticket em outra tela (computador, tablet ou outro celular) para escanear com o celular. Se o QR Code expirar, avise aqui que ele manda outro."}
          </p>
        </div>
        <TicketItems items={ticket.items} total={ticket.total} psnId={ticket.psnId} />
        {!closed && <PushToggle audience="cliente" />}
      </div>

      <section className="mt-10" aria-label="Conversa com o Freitas">
        <Conversation messages={ticket.messages} perspective="cliente" customer={ticket.customer} />
      </section>

      <div className="mt-8">
        {closed ? (
          <div className="flex flex-col items-start gap-4 rounded-3xl border border-white/[0.08] bg-ink-900 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-stone-400">Este ticket foi fechado. Precisa de algo mais?</p>
            <ButtonLink href="/tickets/novo" variant="secondary">
              Abrir ticket novo
            </ButtonLink>
          </div>
        ) : (
          <ReplyForm
            ticketId={ticket.id}
            action={sendCustomerMessage}
            placeholder="Escreva para o Freitas. Dá pra anexar o comprovante do Pix ou um print."
          />
        )}
      </div>

      <AutoRefresh every={12000} />
      <MarkSeen ticketId={ticket.id} side="cliente" unread={ticket.unreadByCustomer} />
      {fromCart && <ClearCartAfterOrder />}
    </>
  );
}
