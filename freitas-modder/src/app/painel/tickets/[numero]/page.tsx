import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminGate, PanelSkeleton } from "@/components/admin/admin-gate";
import { AdminTicketView } from "@/components/admin/admin-ticket";
import { adminCounts, getTicketByNumber } from "@/lib/tickets/repo";
import { ticketsDb } from "@/lib/tickets/server";

export default function PainelTicketPage({ params }: PageProps<"/painel/tickets/[numero]">) {
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <AdminGate>
        <AdminTicket params={params} />
      </AdminGate>
    </Suspense>
  );
}

async function AdminTicket({ params }: { params: PageProps<"/painel/tickets/[numero]">["params"] }) {
  const { numero } = await params;
  const db = ticketsDb();
  const [ticket, counts] = await Promise.all([getTicketByNumber(db, Number(numero)), adminCounts(db)]);
  if (!ticket) notFound();
  return <AdminTicketView ticket={ticket} attention={counts.attention} />;
}
