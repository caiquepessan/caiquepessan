import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { defaultWhatsappMessage, whatsappLink } from "@/lib/whatsapp";
import { HeroCards } from "./hero-cards";

const { business } = siteConfig;

function Line({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="-my-[0.12em] block overflow-hidden py-[0.12em]">
      <span className="block animate-rise" style={{ animationDelay: `${delay}ms` }}>
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative isolate pt-28 sm:pt-32 lg:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-16 -z-10 size-[560px] translate-x-1/4 rounded-full bg-brand-600/15 blur-[120px]"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-5 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
        <div>
          <p className="animate-fade-up text-[15px] font-medium text-stone-400">
            GTA V Online · PS4 e PS5
          </p>
          <h1 className="mt-5 font-display text-[3.4rem] font-extrabold uppercase leading-[0.86] xs:text-[4rem] sm:text-[5.5rem] lg:text-[5rem] xl:text-[6rem]">
            <Line delay={80}>Conta modada</Line>
            <Line delay={160}>de GTA V,</Line>
            <Line delay={240}>pronta pra</Line>
            <Line delay={320}>
              <span className="text-brand-500">jogar.</span>
            </Line>
          </h1>
          <p className="mt-7 max-w-md animate-fade-up text-pretty text-lg leading-relaxed text-stone-300 [animation-delay:400ms]">
            Dinheiro, nível alto, carros modificados e tudo desbloqueado. Você paga
            no Pix e recebe a conta no WhatsApp.
          </p>
          <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:480ms]">
            <ButtonLink href="/contas" size="lg">
              Ver contas
              <ArrowRight className="size-5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </ButtonLink>
            <ButtonAnchor
              href={whatsappLink(defaultWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
            >
              <WhatsAppIcon size={19} />
              Tirar dúvida
            </ButtonAnchor>
          </div>

          <dl className="mt-12 grid max-w-md animate-fade-up grid-cols-3 gap-4 border-t border-white/[0.08] pt-6 [animation-delay:560ms]">
            <div>
              <dt className="text-sm text-stone-500">Entrega</dt>
              <dd className="mt-1 font-semibold">Até {business.avgDeliveryMinutes} min</dd>
            </div>
            <div>
              <dt className="text-sm text-stone-500">Garantia</dt>
              <dd className="mt-1 font-semibold">{business.warrantyDays} dias</dd>
            </div>
            <div>
              <dt className="text-sm text-stone-500">Pagamento</dt>
              <dd className="mt-1 font-semibold">Pix ou cartão</dd>
            </div>
          </dl>
        </div>

        <HeroCards />
      </div>
    </section>
  );
}
