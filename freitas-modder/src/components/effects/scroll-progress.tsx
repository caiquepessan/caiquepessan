"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Barra fina no topo que mostra o quanto da página já foi rolado. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-linear-to-r from-blood-700 via-blood-500 to-ember-500 shadow-[0_0_14px_rgba(255,42,71,0.9)]"
      style={{ scaleX }}
    />
  );
}
