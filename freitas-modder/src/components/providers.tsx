"use client";

import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { useCart } from "@/store/cart";
import { useConsole } from "@/store/console";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Carrinho e console salvos no navegador só carregam depois da
    // hidratação, para o HTML do servidor e o do navegador baterem.
    useCart.persist.rehydrate();
    useConsole.persist.rehydrate();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {children}
      <Toaster
        theme="dark"
        position="bottom-center"
        offset={{ bottom: 24 }}
        mobileOffset={{ bottom: 90, left: 12, right: 12 }}
        toastOptions={{
          classNames: {
            toast:
              "bg-ink-800! border! border-white/10! text-white! rounded-2xl! font-sans! text-[15px]! shadow-[0_12px_40px_rgba(0,0,0,0.5)]!",
            actionButton:
              "bg-brand-500! text-white! font-semibold! rounded-lg! px-3! h-8!",
          },
        }}
      />
    </MotionConfig>
  );
}
