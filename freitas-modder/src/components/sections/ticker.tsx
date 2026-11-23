import { Marquee } from "@/components/effects/marquee";
import { siteConfig } from "@/config/site";

const primary = [
  "Entrega imediata",
  `Garantia de ${siteConfig.business.warrantyDays} dias`,
  "Pagamento via PIX",
  "Suporte humano",
  "Contas full acesso",
  "Bilhões na conta",
  "Unlock All",
];

const secondary = [
  "PC",
  "PlayStation 5",
  "PlayStation 4",
  "Xbox Series X|S",
  "Xbox One",
  "Steam",
  "Epic Games",
];

function Spark() {
  return (
    <svg viewBox="0 0 24 24" className="mx-6 size-5 shrink-0" aria-hidden>
      <path
        d="M12 0 14.6 9.4 24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Duas faixas cruzadas rolando em sentidos opostos. */
export function Ticker() {
  return (
    <section aria-label="Destaques" className="relative isolate overflow-hidden py-16">
      <div className="absolute inset-x-0 top-1/2 -mx-4 -translate-y-1/2 rotate-[2.5deg] border-y border-white/10 bg-ink-800 py-3">
        <Marquee duration={46} reverse>
          {secondary.map((item) => (
            <span
              key={item}
              className="flex items-center font-tech text-base font-semibold uppercase tracking-[0.25em] text-bone-500"
            >
              {item}
              <span className="mx-6 text-blood-500">/</span>
            </span>
          ))}
        </Marquee>
      </div>
      <div className="relative z-10 -mx-4 -rotate-[2.5deg] bg-linear-to-r from-blood-700 via-blood-500 to-blood-700 py-4 shadow-[0_0_60px_rgba(255,42,71,0.45)]">
        <Marquee duration={38}>
          {primary.map((item) => (
            <span
              key={item}
              className="flex items-center font-display text-3xl uppercase tracking-wide text-ink-950 sm:text-4xl"
            >
              {item}
              <Spark />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
