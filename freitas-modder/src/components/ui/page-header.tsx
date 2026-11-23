import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SectionHeading } from "./section-heading";

/** Cabeçalho das páginas internas (breadcrumb + título animado). */
export function PageHeader({
  breadcrumb,
  eyebrow,
  title,
  highlight,
  description,
}: {
  breadcrumb: { href?: string; label: string }[];
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-14 pt-32 sm:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-30%] h-[90%] w-[120%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,42,71,0.22),transparent_60%)]" />
        <div className="grid-lines fade-mask-radial absolute inset-0 opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-ink-950 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav aria-label="Você está em" className="mb-8 animate-fade-up">
          <ol className="flex flex-wrap items-center gap-1.5 font-tech text-xs font-semibold uppercase tracking-[0.15em] text-bone-500">
            {breadcrumb.map((item, i) => (
              <li key={item.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3.5 text-bone-600" />}
                {item.href ? (
                  <Link href={item.href} className="transition-colors hover:text-blood-400">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-bone-200">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <SectionHeading
          as="h1"
          align="left"
          eyebrow={eyebrow}
          title={title}
          highlight={highlight}
          description={description}
        />
      </div>
    </section>
  );
}
