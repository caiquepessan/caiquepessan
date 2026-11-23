import { Headset, KeyRound, ShieldCheck, Users, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { PixIcon } from "@/components/icons/brand-icons";
import { AnimatedCounter } from "@/components/effects/animated-counter";
import { RevealGroup, RevealItem } from "@/components/effects/reveal";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ChatBubbles, DeliveryLog, PixApproved } from "./why-us-visuals";

const { business, stats } = siteConfig;

function Tile({
  icon,
  title,
  text,
  children,
  className,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <SpotlightCard
      className={cn(
        "group relative flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-850/80 p-6 transition-colors duration-500 hover:border-white/[0.12] sm:p-7",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-blood-500/25 bg-blood-500/10 text-blood-400 transition-all duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:bg-blood-500 group-hover:text-white group-hover:shadow-[0_0_24px_rgba(255,42,71,0.6)]">
          {icon}
        </span>
        <div>
          <h3 className="font-tech text-lg font-bold text-bone-50">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-bone-400">{text}</p>
        </div>
      </div>
      {children && <div className="relative mt-auto">{children}</div>}
    </SpotlightCard>
  );
}

export function WhyUs() {
  return (
    <section id="vantagens" className="relative py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute left-0 top-1/3 -z-10 size-[560px] rounded-full bg-blood-800/15 blur-[140px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Por que a Freitas"
          title="Loja séria, entrega"
          highlight="de verdade"
          description="Mais do que vender contas: a gente acompanha você do pedido até a primeira sessão no online."
        />

        <RevealGroup className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto]">
          <RevealItem className="h-full md:col-span-2">
            <Tile
              icon={<Zap className="size-6" />}
              title="Entrega em minutos"
              text={`Pagou, recebeu. Em média, os dados chegam em menos de ${business.avgDeliveryMinutes} minutos.`}
            >
              <DeliveryLog />
            </Tile>
          </RevealItem>

          <RevealItem className="h-full md:row-span-2">
            <Tile
              icon={<ShieldCheck className="size-6" />}
              title={`Garantia de ${business.warrantyDays} dias`}
              text="Deu qualquer problema com o que você comprou? A gente repõe ou resolve, sem custo."
              className="bg-linear-to-b from-blood-950/50 to-ink-850/80"
            >
              <div className="relative mx-auto my-4 grid aspect-square w-full max-w-60 place-items-center">
                <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-blood-500/40" />
                <div className="absolute inset-6 animate-[spin_20s_linear_infinite_reverse] rounded-full border border-blood-500/20" />
                <div className="absolute inset-12 rounded-full bg-blood-600/20 blur-2xl" />
                <div className="relative text-center">
                  <ShieldCheck className="mx-auto size-16 text-blood-500 drop-shadow-[0_0_20px_rgba(255,42,71,0.8)]" strokeWidth={1.4} />
                  <p className="mt-2 font-display text-5xl leading-none">{business.warrantyDays} dias</p>
                  <p className="font-tech text-[11px] font-semibold uppercase tracking-[0.3em] text-bone-500">
                    de proteção
                  </p>
                </div>
              </div>
              <ul className="space-y-2.5 text-sm text-bone-300">
                {["Reposição em caso de problema", "Atendimento prioritário", "Sem letras miúdas"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="size-1.5 rotate-45 bg-blood-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </Tile>
          </RevealItem>

          <RevealItem className="h-full">
            <Tile
              icon={<PixIcon size={22} />}
              title="PIX na hora"
              text="Aprovação instantânea, sem taxa e sem burocracia. Também aceitamos cartão."
            >
              <PixApproved />
            </Tile>
          </RevealItem>

          <RevealItem className="h-full">
            <Tile
              icon={<Headset className="size-6" />}
              title="Suporte humano"
              text={`${business.supportHours}. Gente de verdade respondendo.`}
            >
              <ChatBubbles />
            </Tile>
          </RevealItem>

          <RevealItem className="h-full md:col-span-2">
            <Tile
              icon={<KeyRound className="size-6" />}
              title="Acesso completo"
              text="As contas são suas de verdade: você troca e-mail e senha e passa a ser o único dono."
            >
              <div className="flex flex-wrap gap-2">
                {["Troca de e-mail", "Troca de senha", "Passo a passo guiado", "Conta 100% sua"].map((item) => (
                  <span
                    key={item}
                    className="clip-corner bg-white/[0.04] px-3 py-1.5 font-tech text-xs font-semibold uppercase tracking-wider text-bone-300 [--cut:6px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Tile>
          </RevealItem>

          <RevealItem className="h-full md:col-span-2 lg:col-span-1">
            <Tile
              icon={<Users className="size-6" />}
              title="Comunidade"
              text="Clientes que voltam e indicam. É assim que a loja cresce."
            >
              <p className="font-display text-6xl leading-none text-bone-50">
                <AnimatedCounter value={stats.customers} prefix="+" />
              </p>
              <p className="mt-1 font-tech text-[11px] font-semibold uppercase tracking-[0.25em] text-bone-500">
                clientes atendidos
              </p>
            </Tile>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
