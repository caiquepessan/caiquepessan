import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { CustomerGate, TicketsSkeleton } from "@/components/tickets/customer-gate";
import { CustomerTicketView } from "@/components/tickets/customer-ticket";
import { getTicketByNumber } from "@/lib/tickets/repo";
import { ticketsDb } from "@/lib/tickets/server";
import { getViewer } from "@/lib/viewer";

export default function TicketPage({ params, searchParams }: PageProps<"/tickets/[numero]">) {
  return (
    <Suspense fallback={<TicketsSkeleton />}>
      <CustomerGate title="Seu ticket" text="Entre com o Discord para ver este ticket.">
        <TicketDetail params={params} searchParams={searchParams} />
      </CustomerGate>
    </Suspense>
  );
}

async function TicketDetail({
  params,
  searchParams,
}: {
  params: PageProps<"/tickets/[numero]">["params"];
  searchParams: PageProps<"/tickets/[numero]">["searchParams"];
}) {
  const [{ numero }, query, viewer] = await Promise.all([params, searchParams, getViewer()]);
  if (!viewer) return null;
  const ticket = await getTicketByNumber(ticketsDb(), Number(numero));
  if (!ticket) notFound();
  if (ticket.userId !== viewer.id) {
    // O Freitas usa a versão do painel
    if (viewer.isAdmin) redirect(`/painel/tickets/${ticket.number}`);
    notFound();
  }

  return <CustomerTicketView ticket={ticket} justOpened={query.novo === "1"} fromCart={query.de === "carrinho"} />;
}
