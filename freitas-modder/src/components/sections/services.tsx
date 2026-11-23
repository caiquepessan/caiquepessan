import { ServiceList } from "@/components/product/service-list";
import { Heading } from "@/components/ui/heading";
import { products } from "@/data/products";

export function Services() {
  const items = products.filter((p) => p.category !== "conta");

  return (
    <section id="servicos" className="border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          title="Na sua conta"
          description="Já tem personagem? A gente coloca dinheiro, sobe o nível, enche a garagem ou libera tudo direto nele."
        />
        <div className="mt-12">
          <ServiceList items={items} />
        </div>
      </div>
    </section>
  );
}
