import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Catalog, CatalogFallback } from "@/components/catalog/catalog";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/ui/page-header";
import { landings } from "@/data/landings";
import { getCatalog } from "@/lib/catalog";
import { breadcrumbLd, graph, itemListLd } from "@/lib/seo";

const description =
  "Preços do Freitas Modder para GTA 5 Online no PS4 e PS5: dinheiro, up de level, Unlock All com Corrida Modder e conta modada. Pix e sem passar senha.";

export const metadata: Metadata = {
  title: "Tabela de preços GTA 5 Online: dinheiro, level e Unlock All",
  description,
  alternates: { canonical: "/loja" },
  openGraph: {
    type: "website",
    title: "Tabela de preços GTA 5 Online",
    description,
    url: "/loja",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

async function StoreJsonLd() {
  const products = await getCatalog();
  return (
    <JsonLd
      data={graph(
        breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Loja", path: "/loja" },
        ]),
        itemListLd(products, "Tabela de preços GTA 5 Online"),
      )}
    />
  );
}

export default function CatalogPage() {
  return (
    <>
      <StoreJsonLd />
      <PageHeader
        breadcrumb={[{ href: "/", label: "Início" }, { label: "Loja" }]}
        title="Tabela de preços"
        description="O mesmo preço no PS4 e no PS5. Você pede pelo site, paga no Pix e o Freitas faz direto na sua conta."
      />
      <section className="mx-auto max-w-6xl px-5 pb-28">
        <Suspense fallback={<CatalogFallback />}>
          <Catalog />
        </Suspense>

        <nav aria-label="Por categoria" className="mt-16 border-t border-white/[0.08] pt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-500">Por categoria</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {landings.map((l) => (
              <li key={l.slug}>
                <Link
                  href={`/${l.slug}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-ink-900 px-4 py-3.5 font-semibold transition-colors hover:border-white/20 hover:text-white"
                >
                  {l.short}
                  <ArrowRight className="size-4 text-stone-500" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </>
  );
}
