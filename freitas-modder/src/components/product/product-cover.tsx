import Image from "next/image";
import type { CSSProperties } from "react";
import { tiers, type Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { productIconKey, productIcons } from "./icons";

/**
 * "Capa" gerada do produto (gradiente do tier + emblema + destaque).
 * Se o produto tiver `image`, mostra a foto com um degradê por cima.
 */
export function ProductCover({
  product,
  className,
  priority = false,
  showStats = true,
}: {
  product: Product;
  className?: string;
  priority?: boolean;
  showStats?: boolean;
}) {
  const tier = tiers[product.tier];
  const Icon = productIcons[productIconKey(product)];
  const [primary, secondary] = product.stats;

  return (
    <div
      className={cn(
        "@container relative isolate overflow-hidden bg-linear-to-br",
        tier.gradient,
        className,
      )}
      style={{ "--accent": tier.accent, "--glow": tier.glow } as CSSProperties}
    >
      {product.image ? (
        <>
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/30 to-transparent" />
        </>
      ) : (
        <>
          <div aria-hidden className="grid-lines fade-mask-radial absolute inset-0 opacity-80" />
          <div
            aria-hidden
            className="absolute left-1/2 top-[44%] aspect-square w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
            style={{ background: "var(--glow)" }}
          />
          <div
            aria-hidden
            className="absolute -inset-x-1/4 top-[30%] h-px -rotate-12 bg-linear-to-r from-transparent via-white/30 to-transparent"
          />
          <div
            aria-hidden
            className="absolute -inset-x-1/4 top-[62%] h-px rotate-[8deg] bg-linear-to-r from-transparent via-white/10 to-transparent"
          />

          {/* Anel giratório */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[44%] aspect-square w-[44%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full [background:conic-gradient(from_0deg,transparent_0%,var(--accent)_12%,transparent_32%,transparent_60%,var(--accent)_70%,transparent_85%)] [mask:radial-gradient(circle,transparent_63%,#000_64%,#000_67%,transparent_68%)]"
          />

          {/* Emblema hexagonal */}
          <div className="absolute left-1/2 top-[44%] grid aspect-square w-[30%] -translate-x-1/2 -translate-y-1/2 place-items-center transition-transform duration-700 ease-out group-hover:scale-110">
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
              <path
                d="M50 3 91 26.5v47L50 97 9 73.5v-47Z"
                fill="rgba(6,3,4,0.72)"
                stroke="var(--accent)"
                strokeWidth="2.5"
              />
              <path
                d="M50 12 83 31v38L50 88 17 69V31Z"
                fill="none"
                stroke="var(--accent)"
                strokeOpacity="0.3"
                strokeWidth="1.2"
              />
            </svg>
            <Icon
              aria-hidden
              strokeWidth={1.6}
              className="relative size-[44%] text-(color:--accent) drop-shadow-[0_0_14px_var(--accent)]"
            />
          </div>

          {showStats && primary && (
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-[6%]">
              <div className="min-w-0">
                <p className="font-tech text-[9px] font-semibold uppercase tracking-[0.3em] text-white/50 @xs:text-[10px] @md:text-xs">
                  {primary.label}
                </p>
                <p className="font-display text-2xl leading-none text-white @xs:text-3xl @md:text-5xl">
                  {primary.value}
                </p>
              </div>
              {secondary && (
                <div className="text-right">
                  <p className="font-tech text-[9px] font-semibold uppercase tracking-[0.3em] text-white/50 @xs:text-[10px] @md:text-xs">
                    {secondary.label}
                  </p>
                  <p
                    className="font-display text-xl leading-none @xs:text-2xl @md:text-4xl"
                    style={{ color: "var(--accent)" }}
                  >
                    {secondary.value}
                  </p>
                </div>
              )}
            </div>
          )}

        </>
      )}
      <div aria-hidden className="noise pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" />
    </div>
  );
}
