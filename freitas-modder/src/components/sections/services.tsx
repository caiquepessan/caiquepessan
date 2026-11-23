import { ServiceList } from "@/components/product/service-list";
import { Heading } from "@/components/ui/heading";
import { getCatalog } from "@/lib/catalog";

/** Up de level, combo Unlock All + Corrida Modder e conta pronta. */
export async function Services() {
  const catalog = await getCatalog();
  const items = catalog.filter((p) => p.category === "level" || p.category === "servico");
  const accounts = catalog.filter((p) => p.category === "conta");
  if (items.length === 0 && accounts.length === 0) return null;

  return (
    <section id="servicos" className="border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          title="Level e Unlock All"
          description="Suba de level sem farmar ou libere tudo de uma vez, com o personagem correndo muito mais rápido."
        />
        {items.length > 0 && (
          <div className="mt-12">
            <ServiceList items={items} />
          </div>
        )}

        {accounts.length > 0 && (
          <div className="mt-16">
            <h3 className="font-display text-3xl font-extrabold uppercase leading-none sm:text-4xl">
              Conta pronta
            </h3>
            <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-stone-400">
              Unidade única. O preço é combinado no WhatsApp, e você recebe o e-mail e a
              senha pra trocar na hora.
            </p>
            <div className="mt-8">
              <ServiceList items={accounts} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
