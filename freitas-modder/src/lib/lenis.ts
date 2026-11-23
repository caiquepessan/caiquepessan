import type Lenis from "lenis";

/**
 * Guarda a instância global do Lenis (smooth scroll) para que outros
 * componentes possam pausar o scroll (ex.: carrinho aberto) ou rolar
 * suavemente até uma seção.
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

export function lockScroll() {
  instance?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  instance?.start();
  document.documentElement.style.overflow = "";
}

/** Rola até um seletor (#id). O desconto da navbar vem do scroll-padding-top. */
export function scrollToTarget(selector: string) {
  const el = document.querySelector(selector);
  if (!el) return false;
  if (instance) {
    instance.scrollTo(el as HTMLElement, { duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return true;
}
