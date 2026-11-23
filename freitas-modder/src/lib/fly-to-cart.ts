/**
 * Uma bolinha vermelha sai do botão e voa até o ícone do carrinho.
 * Retorna quanto tempo (ms) a animação leva; 0 se não rodou.
 */
export function flyToCart(from: HTMLElement): number {
  const target = document.querySelector<HTMLElement>("[data-cart-target]");
  if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;

  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  if (b.width === 0) return 0;

  const startX = a.left + a.width / 2;
  const startY = a.top + a.height / 2;
  const dx = b.left + b.width / 2 - startX;
  const dy = b.top + b.height / 2 - startY;
  const lift = Math.min(160, Math.abs(dy) * 0.35 + 60);

  const dot = document.createElement("div");
  dot.setAttribute("aria-hidden", "true");
  Object.assign(dot.style, {
    position: "fixed",
    left: `${startX - 9}px`,
    top: `${startY - 9}px`,
    width: "18px",
    height: "18px",
    borderRadius: "9999px",
    background: "#e8182c",
    boxShadow: "0 0 0 5px rgba(232,24,44,0.25), 0 6px 20px rgba(232,24,44,0.6)",
    zIndex: "170",
    pointerEvents: "none",
  });
  document.body.appendChild(dot);

  const duration = 720;
  const animation = dot.animate(
    [
      { transform: "translate(0, 0) scale(0.6)", opacity: 0.9, easing: "cubic-bezier(.2,.7,.4,1)" },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - lift}px) scale(1.15)`, opacity: 1, offset: 0.45, easing: "cubic-bezier(.6,0,.8,.4)" },
      { transform: `translate(${dx}px, ${dy}px) scale(0.35)`, opacity: 0.85 },
    ],
    { duration, fill: "forwards" },
  );
  animation.onfinish = () => dot.remove();
  return duration;
}
