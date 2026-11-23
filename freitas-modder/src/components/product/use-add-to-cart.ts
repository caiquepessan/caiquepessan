"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { platforms, type Platform, type Product } from "@/data/products";
import { useCart } from "@/store/cart";

/** Adiciona ao carrinho e mostra um aviso com atalho para abrir o carrinho. */
export function useAddToCart() {
  const add = useCart((s) => s.add);
  const open = useCart((s) => s.open);

  return useCallback(
    (product: Product, platform: Platform, options?: { openCart?: boolean }) => {
      add(product.slug, platform);
      if (options?.openCart) {
        open();
        return;
      }
      toast.success(`${product.name} no carrinho`, {
        description: `Plataforma: ${platforms[platform].label}`,
        action: { label: "Ver carrinho", onClick: () => open() },
      });
    },
    [add, open],
  );
}
