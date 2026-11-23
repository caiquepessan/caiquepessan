import { ArrowRight, Star } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { AnimatedCounter } from "@/components/effects/animated-counter";
import { Magnetic } from "@/components/effects/magnetic";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { defaultWhatsappMessage, whatsappLink } from "@/lib/whatsapp";
import { HeroBackground } from "./hero-background";
import { HeroShowcase } from "./hero-showcase";

const { stats, business } = siteConfig;

const heroStats = [
  { value: stats.delivered, prefix: "+", suffix: "", label: "Contas entregues" },
  { value: stats.rating, decimals: 1, suffix: "/5", label: "Nota dos clientes" },
  { value: business.avgDeliveryMinutes, prefix: "<", suffix: " min", label: "Tempo médio de entrega" },
  { value: business.warrantyDays, suffix: " dias", label: "De garantia" },
];

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="-mt-[0.2em] block overflow-hidden pb-[0.04em] pt-[0.2em]">
      <span className="block origin-bottom-left animate-rise" style={{ animationDelay: `${delay}ms` }}>
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 sm:pt-36 lg:pt-40">
      <HeroBackground />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div className="relative">
          <div className="animate-fade-up [animation-delay:150ms]">
            <Eyebrow>PC • PlayStation • Xbox</Eyebrow>
          </div>

          <h1 className="mt-6 font-display text-[3.6rem] uppercase leading-[0.88] tracking-[0.005em] xs:text-[4.4rem] sm:text-[6rem] lg:text-[6.4rem] xl:text-[7.6rem]">
            <Line delay={250}>Contas</Line>
            <Line delay={380}>
              <span className="glitch gradient-text animate-shimmer" data-text="Modadas">
                Modadas
              </span>
            </Line>
            <Line delay={510}>
              de GTA <span className="text-blood-500">V</span>
            </Line>
          </h1>

          <p className="mt-7 max-w-xl animate-fade-up text-pretty text-base leading-relaxed text-bone-300 [animation-delay:700ms] sm:text-lg">
            Nível alto, bilhões na conta, carros modificados e tudo desbloqueado.
            Escolha sua plataforma e comece a jogar hoje, com entrega imediata e
            garantia de {business.warrantyDays} dias.
          </p>

          <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:850ms] xs:flex-row xs:flex-wrap">
            <Magnetic>
              <ButtonLink href="/contas" size="lg" className="w-full xs:w-auto">
                Ver contas
                <ArrowRight className="size-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonAnchor
                href={whatsappLink(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
                className="w-full xs:w-auto"
              >
                <WhatsAppIcon size={19} />
                Falar no WhatsApp
              </ButtonAnchor>
            </Magnetic>
          </div>

          <div className="mt-9 flex animate-fade-up items-center gap-4 [animation-delay:1000ms]">
            <div className="flex -space-x-2.5">
              {["LM", "GS", "RT", "MA"].map((initials, i) => (
                <span
                  key={initials}
                  className="grid size-9 place-items-center rounded-full border-2 border-ink-950 font-tech text-[11px] font-bold text-white"
                  style={{
                    background: ["#c8052a", "#ff5e1f", "#870c27", "#ff2a47"][i],
                  }}
                >
                  {initials}
                </span>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-gold-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
                <span className="ml-2 font-tech text-sm font-semibold text-bone-100">
                  {stats.rating.toLocaleString("pt-BR")}
                </span>
              </div>
              <p className="text-xs text-bone-500">
                +{stats.reviews.toLocaleString("pt-BR")} avaliações de clientes
              </p>
            </div>
          </div>
        </div>

        <HeroShowcase />
      </div>

      {/* Números */}
      <div className="mx-auto mt-20 max-w-7xl px-4 pb-16 sm:px-6 lg:mt-24">
        <div className="grid animate-fade-up grid-cols-2 overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900/60 backdrop-blur-md [animation-delay:1100ms] lg:grid-cols-4">
          {heroStats.map((s, i) => (
            <div
              key={s.label}
              className="relative border-white/[0.07] p-6 text-center max-lg:[&:nth-child(-n+2)]:border-b odd:border-r lg:border-r lg:last:border-r-0 sm:p-8"
            >
              <p className="font-display text-4xl tracking-wide text-bone-50 sm:text-5xl">
                <AnimatedCounter
                  value={s.value}
                  decimals={s.decimals ?? 0}
                  prefix={s.prefix ?? ""}
                  suffix={s.suffix}
                  duration={2 + i * 0.2}
                />
              </p>
              <p className="mt-2 font-tech text-[11px] font-semibold uppercase tracking-[0.22em] text-bone-500">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
