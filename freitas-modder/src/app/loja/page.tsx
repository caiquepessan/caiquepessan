import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog, CatalogFallback } from "@/components/catalog/catalog";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Tabela de preços: dinheiro, level e Unlock All",
  description:
    "Preços do Freitas Modder para GTA V Online no PS4 e no PS5: dinheiro na sua conta, up de level, Unlock All com Corrida Modder e conta pronta.",
  alternates: { canonical: "/loja" },
};

export default function CatalogPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ href: "/", label: "Início" }, { label: "Loja" }]}
        title="Tabela de preços"
        description="O mesmo preço no PS4 e no PS5. Tudo é pago no Pix e combinado pelo WhatsApp."
      />
      <section className="mx-auto max-w-6xl px-5 pb-28">
        <Suspense fallback={<CatalogFallback />}>
          <Catalog />
        </Suspense>
      </section>
    </>
  );
}
