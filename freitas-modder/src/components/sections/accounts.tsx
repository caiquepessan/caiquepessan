import { DealGroup, DealItem } from "@/components/effects/reveal";
import { ConsoleSwitch } from "@/components/product/console-switch";
import { ProductCard } from "@/components/product/product-card";
import { Heading } from "@/components/ui/heading";
import { products } from "@/data/products";

export function Accounts() {
  const accounts = products.filter((p) => p.category === "conta");

  return (
    <section id="contas" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          title="Contas prontas"
          description="Conta PSN com o personagem montado. Você recebe o e-mail e a senha no WhatsApp e troca os dois na hora."
          actions={
            <div className="flex items-center gap-3">
              <span className="text-[15px] text-stone-400">Preços para</span>
              <ConsoleSwitch />
            </div>
          }
        />
        <DealGroup className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {accounts.map((product, i) => (
            <DealItem key={product.slug} index={i} className="h-full">
              <ProductCard product={product} />
            </DealItem>
          ))}
        </DealGroup>
      </div>
    </section>
  );
}
