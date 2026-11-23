import { RevealGroup, RevealItem } from "@/components/effects/reveal";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const { business } = siteConfig;

const steps = [
  {
    title: "Escolha",
    text: "Escolha a conta ou o serviço e o seu console, PS4 ou PS5.",
  },
  {
    title: "Pague no Pix",
    text: "Finalize pelo WhatsApp e pague no Pix ou no cartão.",
  },
  {
    title: "Receba e jogue",
    text: `A conta chega no seu WhatsApp em até ${business.avgDeliveryMinutes} minutos. Nos serviços, a gente avisa quando terminar.`,
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-brand-500 text-white">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:py-28">
        <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.9] sm:text-7xl">
          Como funciona
        </h2>

        <RevealGroup className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <RevealItem key={step.title}>
              <div className="border-t-2 border-white/30 pt-6">
                <span className="font-display text-7xl font-extrabold italic leading-none text-ink-950">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-2xl font-semibold">{step.title}</h3>
                <p className="mt-2 max-w-xs text-[17px] leading-relaxed text-white/85">{step.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-16 flex flex-col gap-6 rounded-3xl bg-ink-950 p-7 sm:p-9 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-4xl font-extrabold uppercase leading-none sm:text-5xl">
              Garantia de {business.warrantyDays} dias
            </p>
            <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-stone-400">
              Se acontecer qualquer problema com o que você comprou nesse prazo, a
              gente repõe ou resolve sem custo.
            </p>
          </div>
          <ButtonLink href="/termos" variant="secondary" className="self-start md:self-auto">
            Ler os termos
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
