import { cn } from "@/lib/utils";
import { LOGO_LOCKUP, LOGO_SYMBOL } from "./logo-paths";

const RED = "#E8182C";

/** Símbolo: F formado por três faixas de corrida. */
export function LogoSymbol({
  className,
  color = RED,
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${LOGO_SYMBOL.width} ${LOGO_SYMBOL.height}`}
      className={cn("h-8 w-auto", className)}
      aria-hidden
      focusable="false"
    >
      <path fill={color} d={LOGO_SYMBOL.d} />
    </svg>
  );
}

/** Só o nome (FREITAS MODDER), na cor do texto atual. */
export function LogoWordmark({ className }: { className?: string }) {
  const { width, height, textX, textY, freitas, modder } = LOGO_LOCKUP;
  return (
    <svg
      viewBox={`${textX} 0 ${width - textX} ${height}`}
      className={cn("h-6 w-auto", className)}
      aria-hidden
      focusable="false"
    >
      <g transform={`translate(${textX} ${textY})`} fill="currentColor">
        <path d={freitas} />
        <path d={modder} />
      </g>
    </svg>
  );
}

/**
 * Logo completa (símbolo vermelho + nome). O nome usa a cor do texto
 * atual, então funciona em fundo escuro e claro.
 */
export function Logo({
  className,
  symbolColor = RED,
}: {
  className?: string;
  symbolColor?: string;
}) {
  const { width, height, symbolScale, textX, textY, freitas, modder } = LOGO_LOCKUP;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-7 w-auto", className)}
      role="img"
      aria-label="Freitas Modder"
    >
      <path fill={symbolColor} transform={`scale(${symbolScale})`} d={LOGO_SYMBOL.d} />
      <g transform={`translate(${textX} ${textY})`} fill="currentColor">
        <path d={freitas} />
        <path d={modder} />
      </g>
    </svg>
  );
}

/** Ícone de app: quadrado vermelho arredondado com o símbolo branco. */
export function LogoIcon({ className }: { className?: string }) {
  const size = 100;
  const inner = 56;
  const scale = inner / LOGO_SYMBOL.height;
  const w = LOGO_SYMBOL.width * scale;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={cn("size-9", className)} aria-hidden focusable="false">
      <rect width={size} height={size} rx={22.5} fill={RED} />
      <path
        fill="#FFFFFF"
        transform={`translate(${(size - w) / 2 + 1.2} ${(size - inner) / 2}) scale(${scale})`}
        d={LOGO_SYMBOL.d}
      />
    </svg>
  );
}
