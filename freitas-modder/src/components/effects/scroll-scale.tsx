"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useRichEffects } from "@/lib/device";

/** Cresce até o tamanho normal enquanto entra na tela (no celular fica parado). */
export function ScrollScale({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.5"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const rich = useRichEffects();

  return (
    <motion.div ref={ref} style={rich ? { scale, y } : undefined} className={className}>
      {children}
    </motion.div>
  );
}
