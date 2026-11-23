import { ArrowRight, Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { RevealGroup, RevealItem } from "@/components/effects/reveal";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { products } from "@/data/products";
import { whatsappLink } from "@/lib/whatsapp";

const customMessage =
  "Olá, Freitas Modder! Quero montar um pedido personalizado para a minha conta.";

export function Services() {
  const services = products.filter((p) => p.category !== "conta");

  return (
    <section id="servicos" className="relative py-24 sm:py-32">
      <div aria-hidden className="dot-pattern fade-mask-radial pointer-events-none absolute inset-0 -z-10 opacity-60" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Na sua própria conta"
          title="Já tem conta?"
          highlight="A gente turbina"
          description="Dinheiro, Unlock All, nível e carros modificados direto no seu personagem, sem precisar começar do zero."
        />

        <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((product) => (
            <RevealItem key={product.slug} className="h-full">
              <ProductCard product={product} />
            </RevealItem>
          ))}

          <RevealItem className="h-full">
            <SpotlightCard className="group relative flex h-full min-h-80 flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-blood-500/40 bg-linear-to-br from-blood-950/60 via-ink-900 to-ink-900 p-7">
              <div aria-hidden className="absolute -right-20 -top-20 size-64 rounded-full bg-blood-600/25 blur-3xl transition-transform duration-700 group-hover:scale-125" />
              <div className="relative">
                <span className="grid size-14 place-items-center rounded-xl bg-blood-500/15 text-blood-400">
                  <Sparkles className="size-7" />
                </span>
                <h3 className="mt-6 font-display text-4xl uppercase leading-none tracking-wide">
                  Pedido sob medida
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-bone-400">
                  Quer uma quantia diferente, um carro específico ou montar um
                  combo? Fala com a gente e montamos o pacote ideal pra você.
                </p>
              </div>
              <a
                href={whatsappLink(customMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="relative mt-8 inline-flex items-center gap-3 font-tech text-sm font-semibold uppercase tracking-[0.15em] text-blood-400 transition-colors hover:text-white"
              >
                <WhatsAppIcon size={18} />
                Montar meu pedido
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            </SpotlightCard>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
