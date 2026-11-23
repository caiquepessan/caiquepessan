import { CircleCheck, Headset, MessageCircle, ShieldCheck, Wallet, PackageCheck, Star, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/effects/reveal";
import { Tilt } from "@/components/effects/tilt";
import { statIcons } from "@/components/product/icons";
import { ProductCard } from "@/components/product/product-card";
import { ProductCover } from "@/components/product/product-cover";
import { ProductPurchase } from "@/components/product/product-purchase";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import {
  categories,
  getProduct,
  getRelatedProducts,
  platforms,
  products,
  tiers,
} from "@/data/products";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/contas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const title = `${product.name}: ${product.tagline}`;
  return {
    title,
    description: product.description,
    alternates: { canonical: `/contas/${product.slug}` },
    openGraph: { title, description: product.description, url: `/contas/${product.slug}` },
  };
}

const { business } = siteConfig;

/** Esqueleto exibido na hora do clique, enquanto o produto carrega. */
function ProductSkeleton() {
  const block = "animate-pulse rounded-xl bg-white/[0.04]";
  return (
    <section aria-busy="true" aria-label="Carregando produto" className="pb-20 pt-28 sm:pt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className={cn(block, "mb-8 h-4 w-56")} />
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <div className={cn(block, "aspect-[4/3] rounded-3xl")} />
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className={cn(block, "h-24")} />
              ))}
            </div>
          </div>
          <div>
            <div className={cn(block, "h-8 w-48")} />
            <div className={cn(block, "mt-5 h-20 w-4/5")} />
            <div className={cn(block, "mt-4 h-6 w-2/3")} />
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className={cn(block, "h-28")} />
              ))}
            </div>
            <div className={cn(block, "mt-8 h-72 rounded-2xl")} />
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

  const tier = tiers[product.tier];
  const related = getRelatedProducts(product, 3);
  const deliverySteps = [
    { icon: MessageCircle, title: "Finalize o pedido", text: "Pelo carrinho ou direto no WhatsApp, em um clique." },
    { icon: Wallet, title: "Pague via PIX", text: "Aprovação na hora. Também aceitamos cartão." },
    { icon: PackageCheck, title: "Receba e jogue", text: `Entrega: ${product.delivery.toLowerCase()}, com suporte acompanhando.` },
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

      <section className="relative isolate overflow-hidden pb-20 pt-28 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-[10%] top-[5%] size-[620px] rounded-full opacity-60 blur-[140px]"
            style={{ background: tier.glow }}
          />
          <div className="grid-lines fade-mask-radial absolute inset-0 opacity-60" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav aria-label="Você está em" className="mb-8 animate-fade-up">
            <ol className="flex flex-wrap items-center gap-2 font-tech text-xs font-semibold uppercase tracking-[0.15em] text-bone-500">
              <li><Link href="/" className="hover:text-blood-400">Início</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/contas" className="hover:text-blood-400">Contas</Link></li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-bone-200">{product.name}</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            {/* Visual */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="animate-fade-up [animation-delay:100ms]">
                <Tilt max={7} className="rounded-3xl">
                  <div
                    className="overflow-hidden rounded-3xl border border-white/10 shadow-[0_40px_100px_-30px_var(--g)]"
                    style={{ ["--g" as string]: tier.glow }}
                  >
                    <ProductCover product={product} priority className="aspect-[4/3]" />
                  </div>
                </Tilt>
              </div>
              <div className="mt-5 grid animate-fade-up grid-cols-3 gap-3 [animation-delay:250ms]">
                {[
                  { icon: Zap, label: "Entrega", value: product.delivery },
                  { icon: ShieldCheck, label: "Garantia", value: `${business.warrantyDays} dias` },
                  { icon: Headset, label: "Suporte", value: "Humano" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl border border-white/[0.07] bg-ink-850/70 p-3 text-center sm:p-4">
                    <Icon className="mx-auto size-5 text-blood-500" />
                    <p className="mt-2 font-tech text-[10px] font-semibold uppercase tracking-[0.2em] text-bone-500">{label}</p>
                    <p className="mt-0.5 font-tech text-sm font-bold text-bone-100">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Informações */}
            <div>
              <div className="flex animate-fade-up flex-wrap items-center gap-2 [animation-delay:150ms]">
                <Eyebrow>{categories[product.category].label}</Eyebrow>
                {product.category === "conta" && (
                  <span
                    className="clip-corner px-3 py-1.5 font-tech text-[11px] font-bold uppercase tracking-[0.25em] [--cut:7px]"
                    style={{ color: tier.accent, background: tier.glow.replace(/[\d.]+\)$/, "0.15)") }}
                  >
                    Tier {tier.label}
                  </span>
                )}
                {product.badge && (
                  <span className="clip-corner bg-blood-500 px-3 py-1.5 font-tech text-[11px] font-bold uppercase tracking-[0.25em] text-white [--cut:7px]">
                    {product.badge}
                  </span>
                )}
              </div>

              <h1 className="mt-5 font-display text-6xl uppercase leading-[0.9] tracking-wide sm:text-7xl">
                <span className="block overflow-hidden pt-[0.2em] -mt-[0.2em]">
                  <span className="block animate-rise [animation-delay:200ms]">{product.name}</span>
                </span>
              </h1>
              <p className="mt-4 animate-fade-up text-lg text-bone-300 [animation-delay:300ms]">{product.tagline}</p>

              <div className="mt-4 flex animate-fade-up items-center gap-2 text-sm text-bone-400 [animation-delay:350ms]">
                <span className="flex text-gold-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </span>
                <span>
                  {siteConfig.stats.rating.toLocaleString("pt-BR")} de média na loja
                </span>
              </div>

              <div
                className={cn(
                  "mt-8 grid animate-fade-up gap-3 [animation-delay:400ms]",
                  product.stats.length >= 3 ? "grid-cols-3" : "grid-cols-2",
                )}
              >
                {product.stats.map((stat) => {
                  const Icon = statIcons[stat.icon];
                  return (
                    <div
                      key={stat.label}
                      className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-ink-850/70 p-4"
                    >
                      <Icon className="size-5" style={{ color: tier.accent }} />
                      <p className="mt-3 font-display text-3xl leading-none">{stat.value}</p>
                      <p className="mt-1 font-tech text-[10px] font-semibold uppercase tracking-[0.2em] text-bone-500">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 animate-fade-up [animation-delay:500ms]">
                <ProductPurchase product={product} />
              </div>

              <Reveal className="mt-10">
                <h2 className="font-display text-3xl uppercase tracking-wide">O que está incluso</h2>
                <ul className="mt-5 grid gap-3">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-bone-200">
                      <CircleCheck className="mt-0.5 size-5 shrink-0 text-blood-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="mt-10">
                <h2 className="font-display text-3xl uppercase tracking-wide">Sobre o produto</h2>
                <p className="mt-4 leading-relaxed text-bone-400">{product.description}</p>
              </Reveal>

              <Reveal className="mt-10">
                <h2 className="font-display text-3xl uppercase tracking-wide">Como você recebe</h2>
                <ol className="mt-5 grid gap-3 sm:grid-cols-3">
                  {deliverySteps.map(({ icon: Icon, title, text }, i) => (
                    <li key={title} className="relative rounded-xl border border-white/[0.07] bg-ink-850/70 p-4">
                      <span className="absolute right-4 top-3 font-display text-3xl text-white/[0.06]">0{i + 1}</span>
                      <Icon className="size-5 text-blood-500" />
                      <p className="mt-3 font-tech font-semibold text-bone-100">{title}</p>
                      <p className="mt-1 text-sm text-bone-400">{text}</p>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="relative pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading align="left" eyebrow="Veja também" title="Quem levou essa," highlight="curtiu também" />
            <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <RevealItem key={p.slug} className="h-full">
                  <ProductCard product={p} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}
    </>
  );
}
