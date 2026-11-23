import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog, CatalogFallback } from "@/components/catalog/catalog";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Contas e serviços",
  description:
    "Catálogo completo de contas modadas de GTA V para PC, PlayStation e Xbox, além de dinheiro, Unlock All, nível e carros modificados na sua conta.",
  alternates: { canonical: "/contas" },
};

export default function CatalogPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ href: "/", label: "Início" }, { label: "Contas" }]}
        eyebrow="Catálogo"
        title="Contas &"
        highlight="serviços"
        description="Filtre pela sua plataforma, compare os pacotes e monte seu pedido. Pagamento via PIX e entrega imediata."
      />
      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6">
        <Suspense fallback={<CatalogFallback />}>
          <Catalog />
        </Suspense>
      </section>
    </>
  );
}
