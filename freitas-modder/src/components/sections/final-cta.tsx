import { ArrowRight } from "lucide-react";
import { DiscordIcon, WhatsAppIcon } from "@/components/icons/brand-icons";
import { Embers } from "@/components/effects/embers";
import { Magnetic } from "@/components/effects/magnetic";
import { Reveal } from "@/components/effects/reveal";
import { SplitText } from "@/components/effects/split-text";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { defaultWhatsappMessage, whatsappLink } from "@/lib/whatsapp";

export function FinalCta() {
  return (
    <section className="relative px-4 py-24 sm:px-6 sm:py-32">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-blood-500/30 bg-linear-to-br from-blood-800 via-blood-950 to-ink-950 px-6 py-20 text-center shadow-[0_40px_120px_-30px_rgba(255,42,71,0.55)] sm:px-12 sm:py-28">
        <div aria-hidden className="grid-lines fade-mask-radial absolute inset-0 opacity-80" />
        <div aria-hidden className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-blood-300 to-transparent" />
        <div aria-hidden className="absolute -bottom-40 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-blood-500/30 blur-[120px]" />
        <div aria-hidden className="outline-text pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[24vw] uppercase leading-none opacity-50 lg:text-[18rem]">
          Online
        </div>
        <Embers density={0.6} />
        <div aria-hidden className="noise absolute inset-0 opacity-[0.06] mix-blend-overlay" />

        <div className="relative">
          <h2 className="mx-auto max-w-4xl font-display text-5xl uppercase leading-[0.92] sm:text-7xl lg:text-8xl">
            <SplitText text="Pronto pra" />{" "}
            <SplitText text="dominar o online?" delay={0.15} wordClassName="text-blood-400 drop-shadow-[0_0_30px_rgba(255,42,71,0.6)]" />
          </h2>
          <Reveal delay={0.25}>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-bone-300 sm:text-lg">
              Escolha sua conta agora e receba em minutos. Qualquer dúvida, o{" "}
              {siteConfig.name} responde na hora.
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Magnetic>
                <ButtonLink href="/contas" size="lg" variant="light">
                  Ver todas as contas
                  <ArrowRight className="size-5 transition-transform group-hover/btn:translate-x-1" />
                </ButtonLink>
              </Magnetic>
              <Magnetic>
                <ButtonAnchor
                  href={whatsappLink(defaultWhatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  variant="outline"
                >
                  <WhatsAppIcon size={19} /> WhatsApp
                </ButtonAnchor>
              </Magnetic>
              {siteConfig.contact.discord && (
                <Magnetic>
                  <ButtonAnchor
                    href={siteConfig.contact.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="lg"
                    variant="outline"
                  >
                    <DiscordIcon size={19} /> Discord
                  </ButtonAnchor>
                </Magnetic>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
