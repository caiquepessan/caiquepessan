"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { isLiteDevice } from "@/lib/device";
import { setLenis } from "@/lib/lenis";

/**
 * Rolagem suave (Lenis) só no computador. No celular a rolagem do próprio
 * aparelho já é suave, e o Lenis só somaria trabalho a cada quadro.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || isLiteDevice()) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
    });
    setLenis(lenis);

    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
