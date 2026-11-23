import { Marquee } from "@/components/effects/marquee";
import { siteConfig } from "@/config/site";

const items = [
  "PS4 e PS5",
  "Pagamento no Pix",
  "Entrega pelo WhatsApp",
  `Garantia de ${siteConfig.business.warrantyDays} dias`,
  "E-mail e senha trocáveis",
  "Atendimento todo dia",
];

/** Faixa clara com as informações principais rolando. */
export function Strip() {
  return (
    <div className="mt-20 bg-paper py-4 text-ink-950 sm:mt-28">
      <Marquee duration={45}>
        {items.map((item) => (
          <span
            key={item}
            className="flex items-center font-display text-2xl font-extrabold uppercase sm:text-[1.75rem]"
          >
            {item}
            <span aria-hidden className="mx-7 inline-block size-2 rounded-full bg-brand-500" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
