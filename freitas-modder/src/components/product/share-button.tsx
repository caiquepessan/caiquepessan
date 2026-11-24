"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Compartilhar o produto (WhatsApp, Discord, Instagram...). No celular abre
 * a folha de compartilhar do aparelho; no computador copia o link.
 */
export function ShareButton({ title, text, path, className }: { title: string; text: string; path: string; className?: string }) {
  async function share() {
    const url = new URL(path, window.location.origin).href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado. É só colar no WhatsApp ou no Discord.");
    } catch {
      toast.error("Não deu pra copiar. O link é " + url);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold text-stone-300 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.06] hover:text-white",
        className,
      )}
    >
      <Share2 className="size-4" />
      Compartilhar
    </button>
  );
}
