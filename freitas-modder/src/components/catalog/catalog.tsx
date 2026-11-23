"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { ConsoleSwitch } from "@/components/product/console-switch";
import { ProductCard } from "@/components/product/product-card";
import { useCatalog } from "@/components/catalog-provider";
import { categories, categoryOrder, type Category } from "@/data/products";
import { cn } from "@/lib/utils";

type CategoryFilter = Category | "all";

const options: CategoryFilter[] = ["all", ...categoryOrder];

function parseCategory(value: string | null): CategoryFilter {
  return value && value in categories ? (value as Category) : "all";
}

function CatalogView({
  category,
  onCategoryChange,
}: {
  category: CategoryFilter;
  onCategoryChange?: (value: CategoryFilter) => void;
}) {
  const products = useCatalog();
  const results =
    category === "all" ? products : products.filter((p) => p.category === category);

  return (
    <div>
      <div className="mb-10 flex flex-col-reverse gap-5 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1" role="group" aria-label="Categoria">
          {options.map((option) => {
            const active = option === category;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => onCategoryChange?.(option)}
                className={cn(
                  "relative z-10 shrink-0 rounded-full px-4 py-2 text-[15px] font-semibold transition-colors duration-200",
                  active ? "text-ink-950" : "text-stone-400 hover:text-white",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="category-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-paper"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                {option === "all" ? "Tudo" : categories[option].short}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[15px] text-stone-400">Seu console</span>
          <ConsoleSwitch />
        </div>
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {results.map((product, i) => (
            <motion.div
              key={product.slug}
              layout
              initial={{ opacity: 0, y: 70, rotate: (i % 3) * 3 - 3, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: 0,
                scale: 1,
                transition: { delay: i * 0.05, type: "spring", stiffness: 150, damping: 19 },
              }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/** Catálogo com a categoria salva na URL (?categoria=dinheiro). */
export function Catalog() {
  const searchParams = useSearchParams();
  const category = parseCategory(searchParams.get("categoria"));

  function handleChange(value: CategoryFilter) {
    const params = new URLSearchParams(window.location.search);
    if (value === "all") params.delete("categoria");
    else params.set("categoria", value);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }

  return <CatalogView category={category} onCategoryChange={handleChange} />;
}

/** Versão sem leitura da URL, usada no HTML estático (fallback do Suspense). */
export function CatalogFallback() {
  return <CatalogView category="all" />;
}
