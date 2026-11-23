import { Suspense } from "react";
import { AdminGate, PanelSkeleton } from "@/components/admin/admin-gate";
import { Dashboard } from "@/components/admin/dashboard";

export default function PainelPage({ searchParams }: PageProps<"/painel">) {
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <AdminGate>
        <Dashboard searchParams={searchParams} />
      </AdminGate>
    </Suspense>
  );
}
