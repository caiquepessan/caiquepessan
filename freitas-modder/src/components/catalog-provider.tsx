"use client";

import { createContext, use, type ReactNode } from "react";
import type { Product } from "@/data/products";

const CatalogContext = createContext<Product[]>([]);

/** Catálogo (vindo do banco) disponível para os componentes do navegador. */
export function CatalogProvider({
  catalog,
  children,
}: {
  catalog: Product[];
  children: ReactNode;
}) {
  return <CatalogContext value={catalog}>{children}</CatalogContext>;
}

export function useCatalog() {
  return use(CatalogContext);
}
