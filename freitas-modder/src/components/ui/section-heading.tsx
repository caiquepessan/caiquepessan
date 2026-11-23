import type { ReactNode } from "react";
import { Reveal } from "@/components/effects/reveal";
import { SplitText } from "@/components/effects/split-text";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "clip-corner inline-flex items-center gap-2 bg-blood-500/10 px-3.5 py-1.5 font-tech text-[11px] font-semibold uppercase tracking-[0.32em] text-blood-400 [--cut:7px]",
        className,
      )}
    >
      <span className="size-1.5 animate-blink bg-blood-500 shadow-[0_0_8px_#ff2a47]" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <Reveal y={12} blur={false}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Tag className="max-w-4xl font-display text-[2.6rem] uppercase leading-[0.95] tracking-[0.01em] text-bone-50 sm:text-6xl lg:text-7xl">
        <SplitText text={title} />
        {highlight && (
          <>
            {" "}
            <SplitText
              text={highlight}
              delay={0.12}
              wordClassName="gradient-text animate-shimmer"
            />
          </>
        )}
      </Tag>
      {description && (
        <Reveal delay={0.15} y={16}>
          <p
            className={cn(
              "max-w-2xl text-pretty text-base leading-relaxed text-bone-400 sm:text-lg",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
