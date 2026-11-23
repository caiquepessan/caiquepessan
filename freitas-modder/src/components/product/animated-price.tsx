"use client";

import { AnimatePresence, motion } from "motion/react";
import { formatBRL } from "@/lib/utils";
import { cn } from "@/lib/utils";

/** Preço que "rola" quando o valor muda (ex.: troca de plataforma). */
export function AnimatedPrice({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex overflow-hidden", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="inline-block tabular-nums"
        >
          {formatBRL(value)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
