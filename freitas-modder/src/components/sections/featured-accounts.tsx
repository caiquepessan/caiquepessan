import { SectionHeading } from "@/components/ui/section-heading";
import { products } from "@/data/products";
import { FeaturedGrid } from "./featured-grid";

export function FeaturedAccounts() {
  const accounts = products.filter((p) => p.category === "conta");

  return (
    <section id="destaques" className="relative py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute right-0 top-40 -z-10 size-[600px] rounded-full bg-blood-800/15 blur-[140px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          align="left"
          eyebrow="Contas em destaque"
          title="Escolha o seu"
          highlight="nível de poder"
          description="Contas prontas com dinheiro, nível e garagem cheia. Selecione a plataforma e veja o preço na hora."
        />
        <FeaturedGrid items={accounts} />
      </div>
    </section>
  );
}
