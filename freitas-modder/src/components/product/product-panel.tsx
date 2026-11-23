import Image from "next/image";
import type { ReactNode } from "react";
import type { Product, Tone } from "@/data/products";
import { cn } from "@/lib/utils";

export const toneStyles: Record<
  Tone,
  { panel: string; muted: string; value: string; swatch: string }
> = {
  graphite: {
    panel: "bg-ink-700",
    muted: "text-white/55",
    value: "text-white",
    swatch: "bg-ink-600",
  },
  red: {
    panel: "bg-brand-500",
    muted: "text-white/75",
    value: "text-white",
    swatch: "bg-brand-500",
  },
  wine: {
    panel: "bg-brand-900",
    muted: "text-brand-300/80",
    value: "text-white",
    swatch: "bg-brand-800",
  },
  black: {
    panel: "bg-black ring-1 ring-inset ring-brand-500/50",
    muted: "text-white/50",
    value: "text-brand-500",
    swatch: "bg-black ring-1 ring-inset ring-brand-500",
  },
};

/** Nome curto que aparece no canto do painel. */
export function plateLabel(product: Product) {
  if (product.category === "conta") return product.name.replace(/^Conta\s+/i, "");
  return product.category === "dinheiro" ? "Dinheiro" : "Serviço";
}

/**
 * Painel colorido do produto: o número que importa, grande.
 * Se o produto tiver `image`, mostra o print por trás.
 */
export function ProductPanel({
  product,
  size = "md",
  className,
  value,
}: {
  product: Product;
  size?: "md" | "lg";
  className?: string;
  /** Substitui o número grande (ex.: contador animado). */
  value?: ReactNode;
}) {
  const tone = toneStyles[product.tone];

  return (
    <div className={cn("shine @container relative isolate overflow-hidden rounded-2xl", tone.panel, className)}>
      {product.image && (
        <>
          <Image
            src={product.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="-z-10 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/30 to-black/10" />
        </>
      )}
      <div className={cn("flex h-full flex-col justify-between", size === "lg" ? "p-6 sm:p-8" : "p-5")}>
        <div className="flex items-start justify-between gap-3">
          <span className={cn("text-[13px] font-semibold uppercase tracking-[0.08em]", tone.muted)}>
            {plateLabel(product)}
          </span>
          {product.tag && (
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink-950">
              {product.tag}
            </span>
          )}
        </div>
        <div>
          <div
            style={{
              transform:
                "translate3d(calc((var(--px, 0.5) - 0.5) * -18px), calc((var(--py, 0.5) - 0.5) * -12px), 0)",
            }}
            className={cn(
              "font-display font-extrabold italic leading-[0.85] tracking-[-0.01em] transition-transform duration-300 ease-out",
              tone.value,
              size === "lg" ? "text-[19cqw]" : "text-[20cqw]",
            )}
          >
            {value ?? product.headline.value}
          </div>
          <p className={cn("mt-2 font-medium", tone.muted, size === "lg" ? "text-base" : "text-sm")}>
            {product.headline.label}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Quadradinho na cor do produto (carrinho e listas). */
export function ProductSwatch({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const tone = toneStyles[product.tone];
  return (
    <div
      className={cn(
        "@container grid shrink-0 place-items-center overflow-hidden rounded-xl",
        tone.swatch,
        className,
      )}
    >
      <span
        className={cn(
          "font-display text-[26cqw] font-extrabold italic leading-none",
          tone.value,
        )}
      >
        {product.headline.value}
      </span>
    </div>
  );
}
