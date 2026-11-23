"use client";

import Link from "next/link";
import { findVariant, platforms, type Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { useConsole } from "@/store/console";
import { AddButton } from "./add-button";
import { AnimatedPrice } from "./animated-price";
import { ProductPanel } from "./product-panel";

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const platform = useConsole((s) => s.platform);
  const variant = findVariant(product, platform);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-3xl border border-white/[0.07] bg-ink-850 p-2 transition-[border-color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-white/[0.16]",
        className,
      )}
    >
      <ProductPanel product={product} className="aspect-[5/4]" />

      <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
        <h3 className="text-xl font-semibold leading-tight">
          <Link
            href={`/contas/${product.slug}`}
            prefetch
            className="outline-none after:absolute after:inset-0 after:rounded-3xl after:content-['']"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-[15px] leading-snug text-stone-400">{product.summary}</p>

        <dl className="mt-5 border-t border-white/[0.07] text-[15px]">
          {product.specs.slice(0, 3).map((spec) => (
            <div key={spec.label} className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] py-2.5">
              <dt className="text-stone-400">{spec.label}</dt>
              <dd className="text-right font-medium">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div className="min-w-0">
            <p className="text-[13px] text-stone-500">{platforms[platform].label} · no Pix</p>
            {variant ? (
              <AnimatedPrice
                value={variant.price}
                className="font-display text-[2rem] font-extrabold leading-none"
              />
            ) : (
              <p className="pt-1 text-[15px] font-medium text-stone-500">
                Indisponível no {platforms[platform].label}
              </p>
            )}
          </div>
          <AddButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
