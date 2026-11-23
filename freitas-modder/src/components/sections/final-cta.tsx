import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { Reveal } from "@/components/effects/reveal";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { defaultWhatsappMessage, whatsappLink } from "@/lib/whatsapp";

export function FinalCta() {
  return (
    <section className="px-5 pb-24 sm:pb-32">
      <Reveal className="mx-auto max-w-6xl rounded-[32px] bg-paper px-7 py-12 text-ink-950 sm:px-12 sm:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.9] sm:text-7xl">
              Qual conta
              <br />
              vai ser?
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-stone-600">
              Escolhe no site ou chama no WhatsApp que a gente te ajuda a decidir.
              Atendimento {siteConfig.business.supportHours.toLowerCase()}.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contas" size="lg">
              Ver contas
              <ArrowRight className="size-5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </ButtonLink>
            <ButtonAnchor
              href={whatsappLink(defaultWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              variant="dark"
              size="lg"
            >
              <WhatsAppIcon size={19} />
              {siteConfig.contact.whatsappDisplay}
            </ButtonAnchor>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
