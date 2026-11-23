"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type Mode = "default" | "link" | "view" | "swap" | "hidden";

/** Modos em que a mira vira um círculo cheio com texto. */
const LABELS: Partial<Record<Mode, string>> = { view: "Ver", swap: "Trocar" };

const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/** Mira que substitui a seta do mouse no computador. */
export function Cursor() {
  const enabled = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  const [mode, setMode] = useState<Mode>("hidden");
  const [pressed, setPressed] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 520, damping: 40, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 520, damping: 40, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      const custom = target?.closest<HTMLElement>("[data-cursor]");
      if (custom) setMode((custom.dataset.cursor as Mode) || "link");
      else if (target?.closest("a, button, [role='button'], [role='radio'], label, select"))
        setMode("link");
      else setMode("default");
    };
    const onLeave = () => setMode("hidden");
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const label = LABELS[mode];
  const isView = label !== undefined;
  const isLink = mode === "link";

  return (
    <div aria-hidden className={cn("pointer-events-none fixed inset-0 z-[180]", mode === "hidden" && "opacity-0")}>
      {/* Mira */}
      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2"
          animate={{
            width: isView ? 88 : isLink ? 52 : 34,
            height: isView ? 88 : isLink ? 52 : 34,
            rotate: isLink ? 45 : 0,
            scale: pressed ? 0.82 : 1,
          }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
        >
          <motion.span
            className="absolute inset-0 rounded-full border"
            animate={{
              borderColor: isView ? "rgba(232,24,44,1)" : isLink ? "rgba(232,24,44,0.9)" : "rgba(255,255,255,0.55)",
              backgroundColor: isView ? "rgba(232,24,44,1)" : "rgba(232,24,44,0)",
            }}
            transition={{ duration: 0.2 }}
          />
          {/* Marcas da mira */}
          {!isView && (
            <>
              <span className="absolute -top-[10px] left-1/2 h-[7px] w-px -translate-x-1/2 bg-white/70" />
              <span className="absolute -bottom-[10px] left-1/2 h-[7px] w-px -translate-x-1/2 bg-white/70" />
              <span className="absolute -left-[10px] top-1/2 h-px w-[7px] -translate-y-1/2 bg-white/70" />
              <span className="absolute -right-[10px] top-1/2 h-px w-[7px] -translate-y-1/2 bg-white/70" />
            </>
          )}
          {isView && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 grid place-items-center text-sm font-semibold text-white"
            >
              {label}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
      {/* Ponto */}
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <span
          className={cn(
            "block size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500 transition-opacity",
            isView && "opacity-0",
          )}
        />
      </motion.div>
    </div>
  );
}
