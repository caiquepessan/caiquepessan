import { Plus } from "lucide-react";
import { Suspense } from "react";
import { CustomerGate, TicketsSkeleton } from "@/components/tickets/customer-gate";
import { TicketList } from "@/components/tickets/ticket-list";
import { ButtonLink } from "@/components/ui/button";
import { listTicketsForUser } from "@/lib/tickets/repo";
import { ticketsDb } from "@/lib/tickets/server";
import { getViewer } from "@/lib/viewer";
import { AutoRefresh } from "@/components/tickets/live";

export default function MeusTicketsPage() {
  return (
    <Suspense fallback={<TicketsSkeleton />}>
      <CustomerGate
        title="Seus tickets"
        text="Entre com o Discord para ver seus pedidos e conversar com o Freitas."
      >
        <MyTickets />
      </CustomerGate>
    </Suspense>
  );
}

async function MyTickets() {
  const viewer = await getViewer();
  if (!viewer) return null;
  const tickets = await listTicketsForUser(ticketsDb(), viewer.id);
  return (
    <>
      <header className="flex flex-col gap-5 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-400">Atendimento</p>
          <h1 className="mt-2 font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">
            Seus tickets
          </h1>
          <p className="mt-3 max-w-lg text-stone-400">
            Cada pedido vira um ticket. É nele que o Freitas responde, manda o QR Code para
            liberar o acesso à sua conta e as provas da entrega.
          </p>
        </div>
        <ButtonLink href="/tickets/novo" variant="secondary" className="self-start sm:self-auto">
          <Plus className="size-4" /> Outro assunto
        </ButtonLink>
      </header>
      <TicketList tickets={tickets} />
      <AutoRefresh every={30000} />
    </>
  );
}
