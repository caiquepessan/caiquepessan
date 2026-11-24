"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { useRichEffects } from "@/lib/device";
import { cn } from "@/lib/utils";

const spring = { stiffness: 170, damping: 18, mass: 0.5 };

/**
 * Inclina o conteúdo em 3D seguindo o mouse, com reflexo de luz.
 * Também expõe --px/--py (0 a 1) para efeitos de profundidade internos.
 */
export function Tilt({
  children,
  className,
  max = 9,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rich = useRichEffects();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const gx = useTransform(sx, [0, 1], ["0%", "100%"]);
  const gy = useTransform(sy, [0, 1], ["0%", "100%"]);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.2), transparent 50%)`;
  const glareOpacity = useSpring(0, { stiffness: 200, damping: 30 });

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (reduce || e.pointerType !== "mouse" || !el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    px.set(nx);
    py.set(ny);
    el.style.setProperty("--px", nx.toFixed(3));
    el.style.setProperty("--py", ny.toFixed(3));
    glareOpacity.set(1);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
    ref.current?.style.setProperty("--px", "0.5");
    ref.current?.style.setProperty("--py", "0.5");
    glareOpacity.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={rich ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      className={cn("relative", className)}
    >
      {children}
      {glare && rich && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
          style={{ background: glareBg, opacity: glareOpacity }}
        />
      )}
    </motion.div>
  );
}
