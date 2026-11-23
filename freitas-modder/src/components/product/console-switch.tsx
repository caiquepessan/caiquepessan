"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { platformOrder, platforms } from "@/data/products";
import { cn } from "@/lib/utils";
import { useConsole } from "@/store/console";

/** Escolha de console (PS4/PS5). Vale para todos os preços do site. */
export function ConsoleSwitch({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const platform = useConsole((s) => s.platform);
  const setPlatform = useConsole((s) => s.setPlatform);
  const layoutId = useId();

  return (
    <div
      role="radiogroup"
      aria-label="Seu console"
      className={cn(
        "relative inline-flex rounded-full bg-white/[0.06] p-1 ring-1 ring-inset ring-white/10",
        className,
      )}
    >
      {platformOrder.map((p) => {
        const active = p === platform;
        return (
          <button
            key={p}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setPlatform(p)}
            className={cn(
              "relative z-10 flex-1 rounded-full font-semibold transition-colors duration-200",
              size === "sm" && "h-8 px-3.5 text-[13px]",
              size === "md" && "h-10 px-5 text-sm",
              size === "lg" && "h-12 px-7 text-base",
              active ? "text-white" : "text-stone-400 hover:text-white",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 -z-10 rounded-full bg-brand-500"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            {platforms[p].label}
          </button>
        );
      })}
    </div>
  );
}
