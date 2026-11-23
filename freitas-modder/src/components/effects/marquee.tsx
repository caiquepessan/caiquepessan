import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Faixa com rolagem infinita (CSS puro, sem JavaScript). */
export function Marquee({
  children,
  reverse = false,
  duration = 40,
  pauseOnHover = false,
  className,
  trackClassName,
}: {
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  pauseOnHover?: boolean;
  className?: string;
  trackClassName?: string;
}) {
  return (
    <div
      className={cn("group/marquee flex overflow-hidden", className)}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <div
        className={cn(
          "flex w-max shrink-0",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
          trackClassName,
        )}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
