import { ArrowLeft, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import { Embers } from "@/components/effects/embers";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden px-4 pb-20 pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blood-700/25 blur-[140px]" />
        <div className="grid-lines fade-mask-radial absolute inset-0 opacity-70" />
        <div className="scanlines absolute inset-0 opacity-50" />
        <Embers density={0.7} />
      </div>

      <div className="text-center">
        <p className="animate-fade-up font-tech text-xs font-semibold uppercase tracking-[0.4em] text-blood-500">
          Erro 404
        </p>
        <h1 className="mt-4 font-display text-[28vw] uppercase leading-[0.8] sm:text-[16rem]">
          <span className="glitch gradient-text animate-shimmer" data-text="404">
            404
          </span>
        </h1>
        <p className="mt-2 animate-fade-up font-display text-4xl uppercase tracking-wide [animation-delay:200ms] sm:text-5xl">
          Missão falhou
        </p>
        <p className="mx-auto mt-4 max-w-md animate-fade-up text-bone-400 [animation-delay:300ms]">
          A página que você procura saiu do mapa. Volte para o início ou confira as contas
          disponíveis.
        </p>
        <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-3 [animation-delay:400ms] sm:flex-row">
          <ButtonLink href="/" size="lg">
            <ArrowLeft className="size-5" /> Voltar ao início
          </ButtonLink>
          <ButtonLink href="/contas" size="lg" variant="outline">
            <ShoppingBag className="size-5" /> Ver contas
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
