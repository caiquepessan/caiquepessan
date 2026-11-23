import { useId } from "react";
import { cn } from "@/lib/utils";

/** Monograma "F" dentro de um hexágono: a marca do Freitas Modder. */
export function LogoMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const gradient = `fm-grad-${id}`;

  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("size-9", className)}
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradient}
          x1="6"
          y1="3"
          x2="42"
          y2="45"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ff7a8a" />
          <stop offset="0.5" stopColor="#ff2a47" />
          <stop offset="1" stopColor="#a50827" />
        </linearGradient>
      </defs>
      <path
        d="M24 2.5 42.6 13.25v21.5L24 45.5 5.4 34.75v-21.5Z"
        fill={`url(#${gradient})`}
      />
      <path d="M24 6.4 39.2 15.2v17.6L24 41.6 8.8 32.8V15.2Z" fill="#0b0607" />
      <path
        d="M16.5 13.5h17.5l-2.7 5.3h-8.8v3.7h7.9l-2.6 5.1h-5.3v7.9h-6Z"
        fill={`url(#${gradient})`}
      />
      <path d="M33.5 30.5 37 28.4v6.2l-3.5 2Z" fill="#ff2a47" opacity="0.85" />
    </svg>
  );
}

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-9 shrink-0 drop-shadow-[0_0_12px_rgba(255,42,71,0.55)]" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[22px] tracking-[0.06em] text-bone-50">
            FREITAS
          </span>
          <span className="font-tech text-[10px] font-bold tracking-[0.42em] text-blood-500">
            MODDER
          </span>
        </span>
      )}
    </span>
  );
}
