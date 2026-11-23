"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { platforms, type Platform } from "@/data/products";
import { cn } from "@/lib/utils";

/** Seletor segmentado de plataforma com indicador animado. */
export function PlatformSwitch({
  options,
  value,
  onChange,
  size = "sm",
  className,
}: {
  options: Platform[];
  value: Platform;
  onChange: (platform: Platform) => void;
  size?: "sm" | "lg";
  className?: string;
}) {
  const layoutId = useId();

  return (
    <div
      role="radiogroup"
      aria-label="Plataforma"
      className={cn(
        "relative inline-flex rounded-lg border border-white/10 bg-ink-950/60 p-1",
        size === "lg" && "w-full",
        className,
      )}
    >
      {options.map((p) => {
        const active = p === value;
        return (
          <button
            key={p}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(p)}
            className={cn(
              "relative z-10 flex-1 rounded-md font-tech font-semibold uppercase tracking-wider transition-colors duration-200",
              size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-4 py-2.5 text-sm",
              active ? "text-white" : "text-bone-500 hover:text-bone-200",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 -z-10 rounded-md bg-linear-to-r from-blood-700 to-blood-500 shadow-[0_0_14px_rgba(255,42,71,0.5)]"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            {size === "sm" ? platforms[p].short : platforms[p].label}
          </button>
        );
      })}
    </div>
  );
}
