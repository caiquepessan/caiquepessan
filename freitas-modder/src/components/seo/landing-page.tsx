import { ArrowRight, BadgeCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { Faq } from "@/components/sections/faq";
import { AccessExplainer } from "@/components/tickets/access-explainer";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { siteConfig } from "@/config/site";
import { getLanding, landings } from "@/data/landings";
import type { Product } from "@/data/products";
import { getCatalog } from "@/lib/catalog";
import { breadcrumbLd, faqLd, graph, itemListLd } from "@/lib/seo";
import { formatBRL } from "@/lib/utils";
import { JsonLd } from "./json-ld";

function lowestPrice(products: Product[]) {
  const prices = products.flatMap((p) => p.variants.map((v) => v.price));
  return prices.length > 0 ? Math.min(...prices) : null;
}

export async function landingMetadata(slug: string): Promise<Metadata> {
  const landing = getLanding(slug);
  if (!landing) return {};
  const products = (await getCatalog()).filter((p) => p.category === landing.category);
  const from = lowestPrice(products);
  // Preço no resumo do Google ajuda a pessoa a clicar
  const description = from !== null ? `${landing.description} A partir de ${formatBRL(from)}.` : landing.description;
  return {
    title: landing.title,
    description,
    keywords: landing.keywords,
    alternates: { canonical: `/${landing.slug}` },
    openGraph: { type: "website", title: landing.title, description, url: `/${landing.slug}` },
    twitter: { card: "summary_large_image", title: landing.title, description },
  };
}


/** Página de uma categoria, feita para aparecer no Google. */
export async function LandingPage({ slug }: { slug: string }) {
  const landing = getLanding(slug);
  if (!landing) notFound();
  const products = (await getCatalog()).filter((p) => p.category === landing.category);
  const from = lowestPrice(products);
  const others = landings.filter((l) => l.slug !== landing.slug);

  return (
    <>
      <JsonLd
        data={graph(
          {
            "@type": "CollectionPage",
            name: landing.title,
            description: landing.description,
            url: `${siteConfig.url}/${landing.slug}`,
            inLanguage: "pt-BR",
          },
          breadcrumbLd([
            { name: "Início", path: "/" },
            { name: "Loja", path: "/loja" },
            { name: landing.short, path: `/${landing.slug}` },
          ]),
          itemListLd(products, landing.h1),
          faqLd(landing.faq),
        )}
      />

      <PageHeader
        breadcrumb={[{ href: "/", label: "Início" }, { href: "/loja", label: "Loja" }, { label: landing.short }]}
        title={landing.h1}
        description={landing.kicker}
      />

      <section className="mx-auto max-w-6xl px-5">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div className="grid gap-4 text-pretty text-lg leading-relaxed text-stone-300">
            {landing.intro.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          {from !== null && (
            <div className="rounded-3xl border border-white/[0.08] bg-ink-900 p-6">
              <p className="text-sm text-stone-500">A partir de</p>
              <p className="font-display text-5xl font-extrabold leading-none">{formatBRL(from)}</p>
              <p className="mt-2 text-[15px] text-stone-400">No Pix · mesmo preço no PS4 e no PS5</p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-14" aria-label="Preços">
        {products.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 px-6 py-10 text-center">
            <p className="text-lg font-semibold">Nada disponível agora</p>
            <p className="mx-auto mt-1 max-w-md text-stone-400">
              Abra um ticket contando o que você procura que o Freitas avisa quando tiver.
            </p>
            <ButtonLink href="/tickets/novo" className="mt-5">
              Abrir ticket
            </ButtonLink>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-14">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {landing.highlights.map((h) => (
            <li key={h.title} className="rounded-3xl border border-white/[0.08] bg-ink-900 p-5">
              <BadgeCheck className="size-6 text-brand-400" />
              <h2 className="mt-3 text-lg font-semibold">{h.title}</h2>
              <p className="mt-1 text-[15px] leading-relaxed text-stone-400">{h.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {landing.category !== "conta" && (
        <section className="mx-auto max-w-6xl px-5 pt-14">
          <AccessExplainer />
        </section>
      )}

      <Faq items={landing.faq} title="Dúvidas" />

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="flex flex-col gap-6 rounded-3xl border border-white/[0.08] bg-ink-900 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-400">Veja também</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {others.map((l) => (
                <li key={l.slug}>
                  <Link href={`/${l.slug}`} className="inline-flex items-center gap-1.5 font-semibold hover:text-brand-300">
                    {l.short} <ArrowRight className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <ButtonLink href="/loja" variant="secondary" className="self-start md:self-auto">
            Tabela completa de preços
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
