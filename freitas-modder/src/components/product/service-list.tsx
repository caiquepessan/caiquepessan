"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/effects/reveal";
import { findVariant, platforms, priceOnRequest, type Product } from "@/data/products";
import { useConsole } from "@/store/console";
import { AddButton } from "./add-button";
import { AnimatedPrice } from "./animated-price";
import { ProductSwatch } from "./product-panel";
import { QuoteButton } from "./quote-button";

/** Lista de preços (dinheiro e serviços na conta do cliente). */
export function ServiceList({ items }: { items: Product[] }) {
  const platform = useConsole((s) => s.platform);

  return (
    <RevealGroup className="overflow-hidden rounded-3xl border border-white/[0.07] bg-ink-900">
      {items.map((product, i) => {
        const variant = findVariant(product, platform);
        const onRequest = priceOnRequest(product);
        return (
          <RevealItem key={product.slug}>
            <div
              className={
                "group relative isolate grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-4 overflow-hidden p-4 sm:p-5 md:grid-cols-[auto_1fr_auto_auto] md:gap-x-6" +
                (i > 0 ? " border-t border-white/[0.07]" : "")
              }
            >
              {/* Destaque de seleção, como num menu de jogo */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 origin-left scale-x-0 bg-linear-to-r from-brand-500/[0.16] via-brand-500/[0.05] to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-4 left-0 -z-10 w-1 scale-y-0 rounded-r-full bg-brand-500 transition-transform duration-300 ease-out group-hover:scale-y-100"
              />
              <ProductSwatch
                product={product}
                className="size-16 transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-105 sm:size-[72px]"
              />
              <div className="min-w-0">
                <h3 className="text-lg font-semibold leading-tight">
                  <Link
                    href={`/loja/${product.slug}`}
                    prefetch
                    className="inline-flex items-center gap-1 outline-none after:absolute after:inset-0 after:content-['']"
                  >
                    {product.name}
                    <ArrowUpRight className="size-4 text-stone-500 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </Link>
                </h3>
                {product.summary && (
                  <p className="mt-1 text-[15px] leading-snug text-stone-400">{product.summary}</p>
                )}
              </div>
              <p className="col-span-2 text-sm text-stone-500 md:col-span-1 md:text-right">
                Entrega: <span className="text-stone-300">{product.delivery.toLowerCase()}</span>
              </p>
              <div className="col-span-2 flex items-center justify-between gap-4 md:col-span-1 md:justify-end">
                {onRequest ? (
                  <span className="font-display text-2xl font-extrabold leading-none">
                    Preço no WhatsApp
                  </span>
                ) : variant ? (
                  <AnimatedPrice
                    value={variant.price}
                    className="font-display text-[1.75rem] font-extrabold leading-none"
                  />
                ) : (
                  <span className="text-sm text-stone-500">
                    Indisponível no {platforms[platform].label}
                  </span>
                )}
                {onRequest ? <QuoteButton product={product} label="Perguntar" /> : <AddButton product={product} />}
              </div>
            </div>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
