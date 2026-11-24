"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { markTicketSeen } from "@/app/tickets/actions";
import { useCart } from "@/store/cart";

/** Busca mensagens novas de tempos em tempos enquanto a aba está aberta. */
export function AutoRefresh({ every = 12000 }: { every?: number }) {
  const router = useRouter();
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const timer = window.setInterval(refresh, every);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router, every]);
  return null;
}

/** Marca como lido quando a pessoa abre o ticket. */
export function MarkSeen({ ticketId, side, unread }: { ticketId: string; side: "cliente" | "freitas"; unread: boolean }) {
  useEffect(() => {
    if (unread) void markTicketSeen(ticketId, side);
  }, [ticketId, side, unread]);
  return null;
}

/**
 * O pedido do carrinho virou ticket: esvazia o carrinho (depois que ele
 * carregou do navegador) e limpa o endereço para não repetir.
 */
export function ClearCartAfterOrder() {
  useEffect(() => {
    const clear = () => {
      useCart.getState().clear();
      window.history.replaceState(null, "", window.location.pathname);
    };
    if (useCart.persist.hasHydrated()) {
      clear();
      return;
    }
    return useCart.persist.onFinishHydration(clear);
  }, []);
  return null;
}
