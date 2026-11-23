"use client";

import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { useCart } from "@/store/cart";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Carrega o carrinho salvo no navegador só depois da hidratação.
    useCart.persist.rehydrate();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {children}
      <Toaster
        theme="dark"
        position="top-right"
        offset={{ top: 92, right: 20 }}
        mobileOffset={{ top: 84, left: 12, right: 12 }}
        toastOptions={{
          classNames: {
            toast:
              "bg-ink-800/95! backdrop-blur-xl! border! border-blood-500/25! text-bone-50! rounded-xl! shadow-[0_10px_40px_-10px_rgba(255,42,71,0.45)]! font-sans!",
            title: "font-tech! font-semibold! tracking-wide!",
            description: "text-bone-400!",
            actionButton:
              "bg-blood-600! text-white! font-tech! font-semibold! uppercase! tracking-wider! rounded-md!",
            icon: "text-blood-500!",
          },
        }}
      />
    </MotionConfig>
  );
}
