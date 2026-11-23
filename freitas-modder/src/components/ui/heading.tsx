import type { ReactNode } from "react";
import { Reveal } from "@/components/effects/reveal";
import { cn } from "@/lib/utils";

/** Título de seção: grande, condensado, sem enfeite. */
export function Heading({
  title,
  description,
  actions,
  as: Tag = "h2",
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        <Tag className="font-display text-5xl font-extrabold uppercase leading-[0.9] sm:text-6xl lg:text-7xl">
          {title}
        </Tag>
        {description && (
          <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-stone-400">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </Reveal>
  );
}
