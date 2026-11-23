import { DealGroup, DealItem } from "@/components/effects/reveal";
import { ConsoleSwitch } from "@/components/product/console-switch";
import { ProductCard } from "@/components/product/product-card";
import { Heading } from "@/components/ui/heading";
import { products } from "@/data/products";

/** Pacotes de dinheiro colocados no personagem do cliente. */
export function Money() {
  const packs = products.filter((p) => p.category === "dinheiro");

  return (
    <section id="dinheiro" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          title="Dinheiro na sua conta"
          description="Quanto mais milhões, mais barato sai cada um. Vai direto no seu personagem, no PS4 ou no PS5, pelo mesmo preço."
          actions={
            <div className="flex items-center gap-3">
              <span className="text-[15px] text-stone-400">Seu console</span>
              <ConsoleSwitch />
            </div>
          }
        />
        <DealGroup className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {packs.map((product, i) => (
            <DealItem key={product.slug} index={i} className="h-full">
              <ProductCard product={product} />
            </DealItem>
          ))}
        </DealGroup>
      </div>
    </section>
  );
}
