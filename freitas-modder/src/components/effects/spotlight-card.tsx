"use client";

import { useRef, type ComponentProps, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Card com brilho/borda que segue o cursor (CSS vars --mx/--my). */
export function SpotlightCard({
  children,
  className,
  spotColor,
  style,
  ...props
}: ComponentProps<"div"> & { spotColor?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      className={cn("spotlight", className)}
      style={
        spotColor
          ? ({ ...style, "--spot": spotColor } as CSSProperties)
          : style
      }
      {...props}
    >
      {children}
    </div>
  );
}
