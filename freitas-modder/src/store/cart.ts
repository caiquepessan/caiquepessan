"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { findVariant, platforms, type Platform, type Product } from "@/data/products";

export interface CartItem {
  slug: string;
  platform: Platform;
  qty: number;
}

export interface ResolvedCartItem extends CartItem {
  product: Product;
  unitPrice: number;
  platformLabel: string;
}

const MAX_QTY = 10;

/** localStorage só existe no navegador; no servidor fica sem armazenamento. */
export const browserStorage = createJSONStorage(() => {
  if (typeof window === "undefined") throw new Error("sem localStorage");
  return window.localStorage;
});

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  /** Incrementa a cada item adicionado (usado para animar o ícone). */
  bump: number;
  add: (slug: string, platform: Platform) => void;
  remove: (slug: string, platform: Platform) => void;
  setQty: (slug: string, platform: Platform, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const sameItem = (a: CartItem, slug: string, platform: Platform) =>
  a.slug === slug && a.platform === platform;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      bump: 0,
      add: (slug, platform) =>
        set((state) => {
          const existing = state.items.find((i) => sameItem(i, slug, platform));
          const items = existing
            ? state.items.map((i) =>
                sameItem(i, slug, platform)
                  ? { ...i, qty: Math.min(MAX_QTY, i.qty + 1) }
                  : i,
              )
            : [...state.items, { slug, platform, qty: 1 }];
          return { items, bump: state.bump + 1 };
        }),
      remove: (slug, platform) =>
        set((state) => ({
          items: state.items.filter((i) => !sameItem(i, slug, platform)),
        })),
      setQty: (slug, platform, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => !sameItem(i, slug, platform))
              : state.items.map((i) =>
                  sameItem(i, slug, platform)
                    ? { ...i, qty: Math.min(MAX_QTY, qty) }
                    : i,
                ),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "freitas-modder-carrinho",
      storage: browserStorage,
      partialize: (state) => ({ items: state.items }),
      // Hidratado no cliente (ver Providers) para o HTML do servidor
      // e o do navegador começarem iguais.
      skipHydration: true,
    },
  ),
);

/** Junta os itens do carrinho com os dados atuais do catálogo. */
export function resolveCartItems(items: CartItem[], catalog: Product[]): ResolvedCartItem[] {
  return items.flatMap((item) => {
    const product = catalog.find((p) => p.slug === item.slug);
    const variant = product && findVariant(product, item.platform);
    if (!product || !variant) return [];
    return [
      {
        ...item,
        product,
        unitPrice: variant.price,
        platformLabel: platforms[item.platform].label,
      },
    ];
  });
}

export function cartTotals(items: ResolvedCartItem[]) {
  return items.reduce(
    (acc, i) => ({
      count: acc.count + i.qty,
      total: acc.total + i.unitPrice * i.qty,
    }),
    { count: 0, total: 0 },
  );
}
