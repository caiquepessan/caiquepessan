import type { ReactNode } from "react";
import { Reveal } from "@/components/effects/reveal";
import { SplitWords } from "@/components/effects/split-words";
import { cn } from "@/lib/utils";

/** Título de seção: grande, condensado, entrando palavra por palavra. */
export function Heading({
  title,
  description,
  actions,
  as: Tag = "h2",
  className,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        <Tag className="font-display text-5xl font-extrabold uppercase leading-[0.9] sm:text-6xl lg:text-7xl">
          <SplitWords text={title} />
        </Tag>
        {description && (
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-stone-400">
              {description}
            </p>
          </Reveal>
        )}
      </div>
      {actions && (
        <Reveal delay={0.2} className="shrink-0">
          {actions}
        </Reveal>
      )}
    </div>
  );
}
