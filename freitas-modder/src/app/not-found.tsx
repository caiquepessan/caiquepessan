import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[80dvh] items-center px-5 pb-20 pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <p className="font-display text-[9rem] font-extrabold italic leading-none text-brand-500 sm:text-[12rem]">
          404
        </p>
        <h1 className="mt-2 font-display text-5xl font-extrabold uppercase leading-[0.9] sm:text-6xl">
          Essa página não existe
        </h1>
        <p className="mt-4 max-w-md text-lg text-stone-400">
          Pode ter mudado de lugar ou o endereço está errado. Os preços continuam na
          loja.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/loja" size="lg">
            Ver preços
          </ButtonLink>
          <ButtonLink href="/" size="lg" variant="secondary">
            Voltar ao início
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
