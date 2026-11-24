import { useSyncExternalStore } from "react";

/**
 * Aparelho de toque (celular, tablet). Neles os efeitos que dependem do
 * mouse ou que recalculam a página a cada quadro ficam de fora ou
 * simplificados: é o que mais trava em celular.
 */
export const LITE_QUERY = "(hover: none), (pointer: coarse)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export function isLiteDevice() {
  return typeof window !== "undefined" && window.matchMedia(LITE_QUERY).matches;
}

function subscribe(callback: () => void) {
  const queries = [window.matchMedia(LITE_QUERY), window.matchMedia(REDUCED_QUERY)];
  for (const q of queries) q.addEventListener("change", callback);
  return () => {
    for (const q of queries) q.removeEventListener("change", callback);
  };
}

function richSnapshot() {
  return !window.matchMedia(LITE_QUERY).matches && !window.matchMedia(REDUCED_QUERY).matches;
}

/**
 * true no computador (mouse) sem "menos movimento". No servidor e na
 * primeira pintura é sempre false: a página nasce na versão leve e o
 * computador ganha os efeitos de rolagem logo depois, sem diferença no HTML.
 */
export function useRichEffects() {
  return useSyncExternalStore(subscribe, richSnapshot, () => false);
}
