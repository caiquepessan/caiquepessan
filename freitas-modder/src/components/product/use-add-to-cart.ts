"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { platforms, type Platform, type Product } from "@/data/products";
import { flyToCart } from "@/lib/fly-to-cart";
import { useCart } from "@/store/cart";

/**
 * Adiciona ao carrinho. Se receber o botão de origem, faz a bolinha voar
 * até o ícone do carrinho e só conta o item quando ela chega.
 */
export function useAddToCart() {
  const add = useCart((s) => s.add);
  const open = useCart((s) => s.open);

  return useCallback(
    (product: Product, platform: Platform, source?: HTMLElement | null) => {
      const duration = source ? flyToCart(source) : 0;
      window.setTimeout(() => {
        add(product.slug, platform);
        toast(`${product.name} (${platforms[platform].label}) no carrinho`, {
          action: { label: "Ver carrinho", onClick: () => open() },
        });
      }, duration * 0.9);
    },
    [add, open],
  );
}
