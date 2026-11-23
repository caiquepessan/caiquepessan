import Link from "next/link";
import type { ReactNode } from "react";
import { Heading } from "./heading";

/** Cabeçalho das páginas internas: caminho + título. */
export function PageHeader({
  breadcrumb,
  title,
  description,
}: {
  breadcrumb: { href?: string; label: string }[];
  title: string;
  description?: ReactNode;
}) {
  return (
    <section className="pb-12 pt-32 sm:pt-40">
      <div className="mx-auto max-w-6xl px-5">
        <nav aria-label="Você está em" className="mb-6 animate-fade-up">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
            {breadcrumb.map((item, i) => (
              <li key={item.label} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {item.href ? (
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-stone-300">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <Heading as="h1" title={title} description={description} />
      </div>
    </section>
  );
}
