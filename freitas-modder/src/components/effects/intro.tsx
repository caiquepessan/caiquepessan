import { LogoMark } from "@/components/ui/logo";

/**
 * Script que roda antes da primeira pintura: decide se a abertura toca
 * (só na primeira visita da sessão e sem "menos movimento").
 */
const introScript = `try{var d=document.documentElement;if(sessionStorage.getItem("fm-intro")||matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="off"}else{sessionStorage.setItem("fm-intro","1");d.dataset.intro="on"}}catch(e){document.documentElement.dataset.intro="off"}`;

export function IntroScript() {
  return (
    <script
      // No servidor vira script de verdade; no cliente o React não tenta
      // executar de novo (evita aviso em desenvolvimento).
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: introScript }}
    />
  );
}

/** Abertura: marca aparece e uma cortina vermelha revela o site. */
export function Intro() {
  return (
    <div className="intro" aria-hidden>
      <div className="intro-bg" />
      <div className="intro-brand">
        <span className="intro-mark">
          <LogoMark className="size-14" />
        </span>
        <span className="intro-word font-display text-4xl font-extrabold uppercase leading-none">
          <span>
            Freitas <span className="text-brand-500">Modder</span>
          </span>
        </span>
      </div>
      <div className="intro-wipe" />
    </div>
  );
}
