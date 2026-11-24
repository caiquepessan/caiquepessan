import { Suspense } from "react";
import { AdminGate, PanelSkeleton } from "@/components/admin/admin-gate";
import { AdminTicketsView } from "@/components/admin/admin-tickets";
import { ADMIN_FILTERS, adminCounts, listTicketsForAdmin } from "@/lib/tickets/repo";
import { ticketsDb } from "@/lib/tickets/server";

export default function PainelTicketsPage({ searchParams }: PageProps<"/painel/tickets">) {
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <AdminGate>
        <AdminTickets searchParams={searchParams} />
      </AdminGate>
    </Suspense>
  );
}

async function AdminTickets({ searchParams }: { searchParams: PageProps<"/painel/tickets">["searchParams"] }) {
  const { filtro } = await searchParams;
  const filter = ADMIN_FILTERS.find((f) => f === filtro) ?? "andamento";
  const db = ticketsDb();
  const [tickets, counts] = await Promise.all([listTicketsForAdmin(db, filter), adminCounts(db)]);
  return <AdminTicketsView tickets={tickets} counts={counts} filter={filter} />;
}
