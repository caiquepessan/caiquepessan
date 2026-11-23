"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { findVariant, platforms, type Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { useConsole } from "@/store/console";
import { useAddToCart } from "./use-add-to-cart";

/** Botão "Adicionar" que usa o console escolhido no site. */
export function AddButton({
  product,
  className,
  label = "Adicionar",
  compact = false,
}: {
  product: Product;
  className?: string;
  label?: string;
  /** Só o ícone (cards estreitos). */
  compact?: boolean;
}) {
  const platform = useConsole((s) => s.platform);
  const addToCart = useAddToCart();
  const [added, setAdded] = useState(false);
  const available = Boolean(findVariant(product, platform));

  function handleClick() {
    addToCart(product, platform);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!available}
      aria-label={
        compact
          ? `Adicionar ${product.name} (${platforms[platform].label}) ao carrinho`
          : undefined
      }
      className={cn(
        "relative z-10 inline-flex h-11 shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-brand-500 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-brand-400 active:scale-[0.97] disabled:pointer-events-none disabled:bg-white/10 disabled:text-stone-500",
        compact ? "w-11" : "px-4",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={added ? "ok" : "add"}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="inline-flex items-center gap-1.5"
        >
          {added ? (
            <Check className={compact ? "size-5" : "size-4"} strokeWidth={2.5} />
          ) : (
            <Plus className={compact ? "size-5" : "size-4"} strokeWidth={2.5} />
          )}
          {!compact && (added ? "Adicionado" : label)}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
