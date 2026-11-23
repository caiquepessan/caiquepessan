"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn, formatBRL } from "@/lib/utils";

/** Preço que desliza quando o valor muda (ex.: troca de console). */
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
          initial={{ y: "70%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-70%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          className="inline-block tabular-nums"
        >
          {formatBRL(value)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
