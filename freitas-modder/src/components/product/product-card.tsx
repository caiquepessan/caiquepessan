"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import {
  categories,
  getDiscount,
  getVariant,
  tiers,
  type Platform,
  type Product,
} from "@/data/products";
import { cn, formatBRL } from "@/lib/utils";
import { AnimatedPrice } from "./animated-price";
import { statIcons } from "./icons";
import { PlatformSwitch } from "./platform-switch";
import { ProductCover } from "./product-cover";
import { useAddToCart } from "./use-add-to-cart";

const badgeStyles: Record<NonNullable<Product["badge"]>, string> = {
  "MAIS VENDIDA": "bg-blood-500 text-white shadow-[0_0_16px_rgba(255,42,71,0.7)]",
  PROMO: "bg-ember-500 text-white shadow-[0_0_16px_rgba(255,94,31,0.7)]",
  NOVO: "bg-bone-50 text-ink-950",
  TOP: "bg-gold-400 text-ink-950 shadow-[0_0_16px_rgba(255,201,77,0.6)]",
};

export function ProductCard({
  product,
  platform,
  className,
}: {
  product: Product;
  /** Plataforma vinda de um filtro externo (opcional). */
  platform?: Platform;
  className?: string;
}) {
  const options = product.variants.map((v) => v.platform);
  const fallback = platform && options.includes(platform) ? platform : options[0];
  const [pick, setPick] = useState<{ source?: Platform; value: Platform } | null>(null);
  const selected = pick && pick.source === platform ? pick.value : fallback;

  const variant = getVariant(product, selected);
  const discount = getDiscount(variant);
  const tier = tiers[product.tier];
  const addToCart = useAddToCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product, selected);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <SpotlightCard
      spotColor={tier.glow.replace(/[\d.]+\)$/, "0.7)")}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-850/80 transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1.5 hover:border-white/[0.12] hover:shadow-[0_30px_60px_-25px_var(--card-glow)]",
        className,
      )}
      style={{ "--card-glow": tier.glow } as CSSProperties}
    >
      <div className="relative">
        <ProductCover product={product} className="aspect-[16/11]" />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          {product.badge ? (
            <span
              className={cn(
                "clip-corner px-2.5 py-1 font-tech text-[10px] font-bold uppercase tracking-[0.2em] [--cut:6px]",
                badgeStyles[product.badge],
              )}
            >
              {product.badge}
            </span>
          ) : (
            <span />
          )}
          {discount > 0 && (
            <span className="rounded-md bg-ink-950/80 px-2 py-1 font-tech text-[11px] font-bold text-blood-400 backdrop-blur">
              -{discount}%
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="mb-1 font-tech text-[10px] font-semibold uppercase tracking-[0.28em] text-bone-500">
            {categories[product.category].label}
          </p>
          <h3 className="font-tech text-xl font-bold text-bone-50">
            <Link
              href={`/contas/${product.slug}`}
              prefetch
              className="outline-none after:absolute after:inset-0 after:z-0 after:content-['']"
            >
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-bone-400">{product.tagline}</p>
        </div>

        <ul className="flex flex-wrap gap-1.5">
          {product.stats.map((stat) => {
            const Icon = statIcons[stat.icon];
            return (
              <li
                key={stat.label}
                className="flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[11px] text-bone-300"
              >
                <Icon className="size-3.5" style={{ color: tier.accent }} />
                <span className="font-semibold text-bone-100">{stat.value}</span>
                <span className="text-bone-500">{stat.label}</span>
              </li>
            );
          })}
        </ul>

        <div className="relative z-10 mt-auto flex flex-col gap-4">
          {options.length > 1 && (
            <PlatformSwitch
              options={options}
              value={selected}
              onChange={(value) => setPick({ source: platform, value })}
              className="self-start"
            />
          )}

          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col">
              {variant.oldPrice ? (
                <span className="text-xs text-bone-600 line-through">
                  {formatBRL(variant.oldPrice)}
                </span>
              ) : (
                <span className="text-xs text-bone-600">à vista no PIX</span>
              )}
              <AnimatedPrice
                value={variant.price}
                className="font-display text-[2rem] leading-none tracking-wide text-bone-50"
              />
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/contas/${product.slug}`}
                prefetch
                aria-label={`Ver detalhes de ${product.name}`}
                className="grid size-11 place-items-center rounded-lg border border-white/10 text-bone-300 transition-colors hover:border-white/25 hover:text-white"
              >
                <ArrowUpRight className="size-5" />
              </Link>
              <button
                type="button"
                onClick={handleAdd}
                aria-label={`Adicionar ${product.name} ao carrinho`}
                className="clip-corner relative grid h-11 min-w-11 place-items-center overflow-hidden bg-linear-to-br from-blood-600 to-blood-500 px-3 text-white transition-[filter,transform] [--cut:8px] hover:brightness-110 active:scale-95"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span
                      key="ok"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      className="grid place-items-center"
                    >
                      <Check className="size-5" strokeWidth={2.5} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0, rotate: 90 }}
                      className="grid place-items-center"
                    >
                      <Plus className="size-5" strokeWidth={2.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
