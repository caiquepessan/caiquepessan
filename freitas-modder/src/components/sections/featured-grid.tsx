"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RevealGroup, RevealItem } from "@/components/effects/reveal";
import { platformIcons } from "@/components/product/icons";
import { ProductCard } from "@/components/product/product-card";
import { platformOrder, platforms, type Platform, type Product } from "@/data/products";
import { cn } from "@/lib/utils";

export function PlatformTabs({
  value,
  onChange,
  includeAll = false,
  className,
}: {
  value: Platform | "all";
  onChange: (value: Platform | "all") => void;
  includeAll?: boolean;
  className?: string;
}) {
  const options: (Platform | "all")[] = includeAll ? ["all", ...platformOrder] : platformOrder;

  return (
    <div
      role="tablist"
      aria-label="Escolha a plataforma"
      className={cn(
        "relative inline-flex max-w-full overflow-x-auto rounded-xl border border-white/10 bg-ink-900/80 p-1.5 backdrop-blur",
        className,
      )}
    >
      {options.map((option) => {
        const active = option === value;
        const Icon = option === "all" ? null : platformIcons[option];
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option)}
            className={cn(
              "relative z-10 flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 font-tech text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 xs:px-4 xs:text-xs sm:px-5 sm:text-[13px] sm:tracking-[0.14em]",
              active ? "text-white" : "text-bone-500 hover:text-bone-200",
            )}
          >
            {active && (
              <motion.span
                layoutId={`platform-tab-${includeAll ? "all" : "only"}`}
                className="absolute inset-0 -z-10 rounded-lg bg-linear-to-r from-blood-700 to-blood-500 shadow-[0_0_20px_rgba(255,42,71,0.55)]"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            {Icon && <Icon className="hidden size-4 sm:block" />}
            {option === "all" ? "Todas" : platforms[option].label}
          </button>
        );
      })}
    </div>
  );
}

export function FeaturedGrid({ items }: { items: Product[] }) {
  const [platform, setPlatform] = useState<Platform>("pc");

  return (
    <>
      <div className="mt-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <PlatformTabs
          value={platform}
          onChange={(v) => v !== "all" && setPlatform(v)}
        />
        <Link
          href="/contas"
          className="group inline-flex items-center gap-2 font-tech text-sm font-semibold uppercase tracking-[0.15em] text-bone-300 transition-colors hover:text-white"
        >
          Ver catálogo completo
          <ArrowRight className="size-4 text-blood-500 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((product) => (
          <RevealItem key={product.slug} className="h-full">
            <ProductCard product={product} platform={platform} />
          </RevealItem>
        ))}
      </RevealGroup>
    </>
  );
}
