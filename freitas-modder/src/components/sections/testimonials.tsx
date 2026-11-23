import { Quote, Star } from "lucide-react";
import { Marquee } from "@/components/effects/marquee";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { platforms } from "@/data/products";
import { testimonials, type Testimonial } from "@/data/testimonials";

function TestimonialCard({ t }: { t: Testimonial }) {
  const initials = t.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <figure className="group relative mx-2.5 flex w-[320px] shrink-0 flex-col gap-5 rounded-2xl border border-white/[0.07] bg-ink-850/90 p-6 transition-colors duration-300 hover:border-blood-500/40 sm:w-[380px]">
      <Quote aria-hidden className="absolute right-5 top-5 size-8 text-blood-500/15 transition-colors group-hover:text-blood-500/40" />
      <div className="flex items-center gap-0.5 text-gold-400" aria-label={`Nota ${t.rating} de 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={i < t.rating ? "size-4 fill-current" : "size-4 text-bone-600"} />
        ))}
      </div>
      <blockquote className="text-[15px] leading-relaxed text-bone-200">“{t.text}”</blockquote>
      <figcaption className="mt-auto flex items-center gap-3 border-t border-white/[0.06] pt-4">
        <span className="grid size-10 place-items-center rounded-full bg-linear-to-br from-blood-500 to-blood-800 font-tech text-sm font-bold text-white">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="font-tech text-sm font-semibold text-bone-50">{t.name}</p>
          <p className="truncate text-xs text-bone-500">
            {t.product} · {platforms[t.platform].label}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const half = Math.ceil(testimonials.length / 2);
  const rowA = testimonials.slice(0, half);
  const rowB = testimonials.slice(half);

  return (
    <section id="avaliacoes" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Avaliações"
          title="Quem comprou"
          highlight="recomenda"
          description={`Nota média ${siteConfig.stats.rating.toLocaleString("pt-BR")} de 5 em mais de ${siteConfig.stats.reviews.toLocaleString("pt-BR")} avaliações.`}
        />
      </div>

      <div className="fade-mask-x mt-16 flex flex-col gap-5">
        <Marquee duration={60} pauseOnHover>
          {rowA.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </Marquee>
        <Marquee duration={70} reverse pauseOnHover>
          {rowB.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
