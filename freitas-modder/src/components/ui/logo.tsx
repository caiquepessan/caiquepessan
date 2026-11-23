import { cn } from "@/lib/utils";

/** Marca: "F" em itálico dentro de um quadrado vermelho arredondado. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("size-9", className)}
      aria-hidden
      focusable="false"
    >
      <rect width="48" height="48" rx="13" fill="#e8182c" />
      <path
        d="M17 12.5h17.5v6.25h-10v4.75H33v6H24.5v6h-7.5Z"
        fill="#fff"
        transform="translate(24 24) skewX(-9) translate(-24 -24)"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-9 shrink-0" />
      <span className="font-display text-[22px] font-extrabold uppercase leading-none tracking-[0.01em]">
        Freitas <span className="text-brand-500">Modder</span>
      </span>
    </span>
  );
}
