import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DealGroup, DealItem, Reveal } from "@/components/effects/reveal";
import { Tilt } from "@/components/effects/tilt";
import { Odometer } from "@/components/product/odometer";
import { ProductCard } from "@/components/product/product-card";
import { ProductPanel } from "@/components/product/product-panel";
import { ProductPurchase } from "@/components/product/product-purchase";
import { siteConfig } from "@/config/site";
import {
  categories,
  getProduct,
  getRelatedProducts,
  platforms,
  products,
} from "@/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/contas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const title = `${product.name} para PS4 e PS5`;
  return {
    title,
    description: `${product.summary} ${product.description}`,
    alternates: { canonical: `/contas/${product.slug}` },
    openGraph: { title, description: product.summary, url: `/contas/${product.slug}` },
  };
}

/** Esqueleto mostrado na hora do clique, enquanto o produto carrega. */
function ProductSkeleton() {
  const block = "animate-pulse rounded-2xl bg-white/[0.04]";
  return (
    <section aria-busy="true" aria-label="Carregando produto" className="pb-24 pt-28 sm:pt-36">
      <div className="mx-auto max-w-6xl px-5">
        <div className={`${block} mb-8 h-4 w-48`} />
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className={`${block} aspect-[5/4] rounded-3xl`} />
          <div>
            <div className={`${block} h-16 w-3/4`} />
            <div className={`${block} mt-4 h-6 w-2/3`} />
            <div className={`${block} mt-8 h-72 rounded-3xl`} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProductPage({ params }: PageProps<"/contas/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: { params: PageProps<"/contas/[slug]">["params"] }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 3);
  const isAccount = product.category === "conta";
  const steps = isAccount
    ? [
        "Você finaliza o pedido pelo carrinho ou direto no WhatsApp.",
        "Paga no Pix (ou cartão) e a gente confirma.",
        `O e-mail e a senha da conta chegam no seu WhatsApp em até ${siteConfig.business.avgDeliveryMinutes} minutos.`,
        "Você troca o e-mail e a senha, e a conta é sua.",
      ]
    : [
        "Você finaliza o pedido pelo carrinho ou direto no WhatsApp.",
        "Paga no Pix (ou cartão) e passa o acesso da sua PSN no chat.",
        `A gente faz o serviço no prazo combinado (${product.delivery.toLowerCase()}).`,
        "Quando terminar, a gente avisa e você troca a senha.",
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: categories[product.category].label,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      name: `${product.name} (${platforms[v.platform].label})`,
      price: v.price.toFixed(2),
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/contas/${product.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <section className="pb-20 pt-28 sm:pt-36">
        <div className="mx-auto max-w-6xl px-5">
          <nav aria-label="Você está em" className="mb-8 animate-fade-up">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
              <li>
                <Link href="/" className="transition-colors hover:text-white">Início</Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/contas" className="transition-colors hover:text-white">Contas</Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-stone-300">{product.name}</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="animate-fade-up lg:sticky lg:top-28 lg:self-start">
              <Tilt max={6} className="rounded-3xl">
              <ProductPanel
                product={product}
                size="lg"
                className="aspect-[5/4] rounded-3xl"
                value={
                  product.amount ? (
                    <Odometer value={product.amount} delay={0.3} className="text-[0.62em]" />
                  ) : undefined
                }
              />
              </Tilt>
            </div>

            <div className="animate-fade-up [animation-delay:120ms]">
              <p className="text-[15px] font-medium text-stone-400">
                {categories[product.category].label} · PS4 e PS5
              </p>
              <h1 className="mt-3 font-display text-6xl font-extrabold uppercase leading-[0.9] sm:text-7xl">
                {product.name}
              </h1>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-stone-300">
                {product.description}
              </p>

              <div className="mt-8">
                <ProductPurchase product={product} />
              </div>

              <Reveal className="mt-12">
                <h2 className="text-xl font-semibold">Ficha</h2>
                <dl className="mt-4 border-t border-white/[0.08]">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex items-baseline justify-between gap-6 border-b border-white/[0.08] py-3 text-[17px]">
                      <dt className="text-stone-400">{spec.label}</dt>
                      <dd className="text-right font-medium">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal className="mt-12">
                <h2 className="text-xl font-semibold">O que vem</h2>
                <ul className="mt-4 grid gap-3">
                  {product.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[17px] text-stone-200">
                      <Check className="mt-1 size-4 shrink-0 text-brand-500" strokeWidth={3} />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="mt-12">
                <h2 className="text-xl font-semibold">Como você recebe</h2>
                <ol className="mt-4 grid gap-3">
                  {steps.map((step, i) => (
                    <li key={step} className="flex gap-4 text-[17px] text-stone-300">
                      <span className="font-display text-2xl font-extrabold italic leading-none text-brand-500">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-white/[0.06] py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.9] sm:text-5xl">
              Veja também
            </h2>
            <DealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <DealItem key={p.slug} index={i} className="h-full">
                  <ProductCard product={p} />
                </DealItem>
              ))}
            </DealGroup>
          </div>
        </section>
      )}
    </>
  );
}
