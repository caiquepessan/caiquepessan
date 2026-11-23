"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";

const spring = { stiffness: 110, damping: 22, mass: 0.6 };

/** Brilho vermelho suave que acompanha o mouse (só em desktop). */
export function CursorGlow() {
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 hidden size-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,42,71,0.11),transparent_62%)] [@media(hover:hover)_and_(pointer:fine)]:block"
      style={{ x: sx, y: sy }}
    />
  );
}
