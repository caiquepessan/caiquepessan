"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Search, SearchX, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { EASE_OUT_EXPO } from "@/components/effects/reveal";
import { ProductCard } from "@/components/product/product-card";
import { PlatformTabs } from "@/components/sections/featured-grid";
import {
  categories,
  getStartingPrice,
  getVariant,
  platforms,
  products,
  type Category,
  type Platform,
} from "@/data/products";
import { cn } from "@/lib/utils";

type PlatformFilter = Platform | "all";
type CategoryFilter = Category | "all";
type SortOrder = "relevancia" | "menor-preco" | "maior-preco";

const categoryOptions: CategoryFilter[] = ["all", "conta", "dinheiro", "servico"];

function parsePlatform(value: string | null): PlatformFilter {
  return value && value in platforms ? (value as Platform) : "all";
}

function parseCategory(value: string | null): CategoryFilter {
  return value && value in categories ? (value as Category) : "all";
}

/** Minúsculas, sem acentos e sem plural simples ("bilhões" -> "bilhao"). */
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/oes\b/g, "ao")
    .replace(/(\w{3,})s\b/g, "$1");
}

interface CatalogViewProps {
  platform: PlatformFilter;
  category: CategoryFilter;
  onPlatformChange?: (value: PlatformFilter) => void;
  onCategoryChange?: (value: CategoryFilter) => void;
}

function CatalogView({ platform, category, onPlatformChange, onCategoryChange }: CatalogViewProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("relevancia");

  const results = useMemo(() => {
    const q = normalize(query.trim());
    const priceOf = (p: (typeof products)[number]) =>
      platform === "all" ? getStartingPrice(p) : getVariant(p, platform).price;

    const filtered = products.filter((p) => {
      if (platform !== "all" && !p.variants.some((v) => v.platform === platform)) return false;
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      const haystack = normalize(
        [p.name, p.tagline, categories[p.category].label, ...p.stats.map((s) => `${s.value} ${s.label}`)].join(" "),
      );
      return q.split(/\s+/).every((term) => haystack.includes(term));
    });

    if (sort === "menor-preco") return [...filtered].sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === "maior-preco") return [...filtered].sort((a, b) => priceOf(b) - priceOf(a));
    return filtered;
  }, [platform, category, query, sort]);

  const hasFilters = platform !== "all" || category !== "all" || query !== "";

  function resetFilters() {
    setQuery("");
    onPlatformChange?.("all");
    onCategoryChange?.("all");
  }

  return (
    <div>
      {/* Barra de filtros */}
      <div className="sticky top-[84px] z-30 -mx-4 mb-10 px-4 sm:mx-0 sm:px-0">
        <div className="glass flex flex-col gap-4 rounded-2xl border border-white/[0.08] p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <PlatformTabs
              includeAll
              value={platform}
              onChange={(v) => onPlatformChange?.(v)}
              className="self-start"
            />
            <label className="relative flex w-full items-center lg:max-w-xs">
              <span className="sr-only">Buscar produtos</span>
              <Search className="pointer-events-none absolute left-3.5 size-4 text-bone-500" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar: bilhão, unlock, nível…"
                className="h-12 w-full rounded-xl border border-white/10 bg-ink-950/70 pl-10 pr-10 text-sm text-bone-50 outline-none transition-colors placeholder:text-bone-600 focus:border-blood-500/60 [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Limpar busca"
                  className="absolute right-3 grid size-6 place-items-center rounded-md text-bone-500 hover:text-white"
                >
                  <X className="size-4" />
                </button>
              )}
            </label>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:pb-0" role="group" aria-label="Categoria">
              {categoryOptions.map((option) => {
                const active = option === category;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onCategoryChange?.(option)}
                    className={cn(
                      "relative shrink-0 rounded-lg px-2.5 py-2 font-tech text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors sm:px-3.5 sm:text-xs sm:tracking-[0.12em]",
                      active ? "text-white" : "text-bone-500 hover:text-bone-200",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="category-pill"
                        className="absolute inset-0 -z-10 rounded-lg border border-blood-500/50 bg-blood-500/15"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    {option === "all" ? "Tudo" : categories[option].short}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <p className="font-tech text-xs font-semibold uppercase tracking-[0.15em] text-bone-500" aria-live="polite">
                <motion.span
                  key={results.length}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block text-blood-400"
                >
                  {results.length}
                </motion.span>{" "}
                {results.length === 1 ? "produto" : "produtos"}
              </p>
              <label className="relative">
                <span className="sr-only">Ordenar por</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOrder)}
                  className="h-10 appearance-none rounded-lg border border-white/10 bg-ink-950/70 pl-3 pr-9 font-tech text-xs font-semibold uppercase tracking-[0.1em] text-bone-200 outline-none transition-colors focus:border-blood-500/60"
                >
                  <option value="relevancia">Relevância</option>
                  <option value="menor-preco">Menor preço</option>
                  <option value="maior-preco">Maior preço</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-bone-500" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Grade de produtos */}
      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {results.map((product, i) => (
            <motion.div
              key={product.slug}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: i * 0.035, duration: 0.5, ease: EASE_OUT_EXPO } }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
              className="h-full"
            >
              <ProductCard product={product} platform={platform === "all" ? undefined : platform} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 px-6 py-20 text-center"
          >
            <SearchX className="size-12 text-blood-500" strokeWidth={1.5} />
            <p className="mt-5 font-display text-3xl uppercase tracking-wide">Nada encontrado</p>
            <p className="mt-2 max-w-sm text-sm text-bone-400">
              Tente outra busca ou limpe os filtros. Se não achar o que procura, chama no WhatsApp que a gente monta.
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 font-tech text-sm font-semibold uppercase tracking-[0.15em] text-blood-400 hover:text-blood-300"
              >
                Limpar filtros
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Catálogo com filtros sincronizados com a URL (?plataforma=pc&categoria=conta). */
export function Catalog() {
  const searchParams = useSearchParams();
  const platform = parsePlatform(searchParams.get("plataforma"));
  const category = parseCategory(searchParams.get("categoria"));

  function update(key: "plataforma" | "categoria", value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value === "all") params.delete(key);
    else params.set(key, value);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }

  return (
    <CatalogView
      platform={platform}
      category={category}
      onPlatformChange={(v) => update("plataforma", v)}
      onCategoryChange={(v) => update("categoria", v)}
    />
  );
}

/** Versão sem leitura da URL, usada no HTML estático (fallback do Suspense). */
export function CatalogFallback() {
  return <CatalogView platform="all" category="all" />;
}
