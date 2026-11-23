import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog, CatalogFallback } from "@/components/catalog/catalog";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Contas e serviços para PS4 e PS5",
  description:
    "Todas as contas modadas de GTA V para PS4 e PS5, além de dinheiro, Unlock All, nível e carros modificados na sua própria conta.",
  alternates: { canonical: "/contas" },
};

export default function CatalogPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ href: "/", label: "Início" }, { label: "Contas" }]}
        title="Contas e serviços"
        description="Escolha o console pra ver o preço certo. Tudo é pago no Pix e entregue pelo WhatsApp."
      />
      <section className="mx-auto max-w-6xl px-5 pb-28">
        <Suspense fallback={<CatalogFallback />}>
          <Catalog />
        </Suspense>
      </section>
    </>
  );
}
