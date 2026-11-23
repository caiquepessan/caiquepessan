import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { Magnetic } from "@/components/effects/magnetic";
import { NightTraffic } from "@/components/effects/night-traffic";
import { Scramble } from "@/components/effects/scramble";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { defaultWhatsappMessage, whatsappLink } from "@/lib/whatsapp";
import { getCatalog, pickFeatured } from "@/lib/catalog";
import { HeroCards } from "./hero-cards";
import { HeroTitle } from "./hero-title";

const { business } = siteConfig;

function delay(ms: number) {
  return { ["--d" as string]: `${ms}ms` };
}

export async function Hero() {
  const featured = pickFeatured(await getCatalog());
  return (
    <section className="relative isolate overflow-hidden pb-24 pt-28 sm:pt-32 lg:pb-32 lg:pt-36">
      {/* Fundo: luz vermelha + avenida à noite */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-0 size-[620px] rounded-full bg-brand-600/20 blur-[130px]" />
        <div className="after-intro absolute inset-x-0 bottom-0 h-[70%] animate-fade-up [mask-image:linear-gradient(to_bottom,transparent,#000_45%)]" style={delay(300)}>
          <NightTraffic />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-ink-950 to-transparent" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-5 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
        <div>
          <p className="after-intro animate-fade-up text-[15px] font-medium text-stone-400" style={delay(0)}>
            <Scramble text="GTA V Online · PS4 e PS5" onMount delay={200} />
          </p>
          <HeroTitle />
          <p
            className="after-intro mt-7 max-w-md animate-fade-up text-pretty text-lg leading-relaxed text-stone-300"
            style={delay(420)}
          >
            Milhões no banco, level alto e Unlock All com Corrida Modder, direto no
            seu personagem. Você paga no Pix e combina tudo pelo WhatsApp.
          </p>
          <div className="after-intro mt-8 flex animate-fade-up flex-wrap gap-3" style={delay(500)}>
            <Magnetic>
              <ButtonLink href="/loja" size="lg">
                Ver preços
                <ArrowRight className="size-5 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </ButtonLink>
            </Magnetic>
            <Magnetic>
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
            </Magnetic>
          </div>

          <dl
            className="after-intro mt-12 grid max-w-md animate-fade-up grid-cols-3 gap-4 border-t border-white/[0.08] pt-6"
            style={delay(580)}
          >
            <div>
              <dt className="text-sm text-stone-500">Entrega</dt>
              <dd className="mt-1 font-semibold">Rápida</dd>
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

        {featured && <HeroCards product={featured} />}
      </div>
    </section>
  );
}
