import { VelocityMarquee } from "@/components/effects/velocity-marquee";
import { siteConfig } from "@/config/site";

const front = [
  "PS4 e PS5",
  "Pagamento no Pix",
  "Entrega pelo WhatsApp",
  `Garantia de ${siteConfig.business.warrantyDays} dias`,
  "Dinheiro, nível e carros",
];

const back = [
  "E-mail e senha trocáveis",
  "Unlock All",
  "Atendimento todo dia",
  "Contas prontas",
  "Serviços na sua conta",
];

/** Duas faixas cruzadas que aceleram com a rolagem da página. */
export function Strip() {
  return (
    <section aria-label="Destaques" className="relative isolate overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-x-0 top-1/2 -z-10 -mx-8 -translate-y-1/2 rotate-[3deg] bg-paper py-3 text-ink-950">
        <VelocityMarquee baseVelocity={-2.2}>
          {back.map((item) => (
            <span key={item} className="flex items-center font-display text-xl font-extrabold uppercase sm:text-2xl">
              {item}
              <span aria-hidden className="mx-6 text-brand-500">
                ✕
              </span>
            </span>
          ))}
        </VelocityMarquee>
      </div>
      <div className="-mx-8 -rotate-[2.5deg] bg-brand-500 py-4 text-white shadow-[0_20px_60px_-20px_rgba(232,24,44,0.8)]">
        <VelocityMarquee baseVelocity={2.6}>
          {front.map((item) => (
            <span key={item} className="flex items-center font-display text-3xl font-extrabold uppercase sm:text-4xl">
              {item}
              <span aria-hidden className="mx-7 inline-block size-2.5 rounded-full bg-ink-950" />
            </span>
          ))}
        </VelocityMarquee>
      </div>
    </section>
  );
}
