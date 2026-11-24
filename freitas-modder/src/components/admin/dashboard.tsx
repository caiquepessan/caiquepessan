import { CheckCircle2, ExternalLink, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductSwatch } from "@/components/product/product-panel";
import { ButtonLink } from "@/components/ui/button";
import {
  categories,
  categoryOrder,
  priceOnRequest,
  samePriceEverywhere,
  type Product,
} from "@/data/products";
import { listAllProducts, type AdminProduct } from "@/lib/admin-products";
import { adminCounts } from "@/lib/tickets/repo";
import { ticketsDb } from "@/lib/tickets/server";
import { formatBRL } from "@/lib/utils";
import { getViewer } from "@/lib/viewer";
import { SignOutButton } from "./gate-cards";
import { PanelTabs } from "./panel-tabs";
import { RowActions } from "./row-actions";

function priceLabel(product: Product) {
  if (priceOnRequest(product)) return "Preço a combinar";
  if (samePriceEverywhere(product)) return `${formatBRL(product.variants[0].price)} · PS4 e PS5`;
  return product.variants
    .map((v) => `${v.platform.toUpperCase()} ${formatBRL(v.price)}`)
    .join(" · ");
}

/** Lista de tudo que está cadastrado, por categoria. */
export async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [query, viewer, items, counts] = await Promise.all([
    searchParams,
    getViewer(),
    listAllProducts(),
    adminCounts(ticketsDb()),
  ]);
  return (
    <DashboardView
      attention={counts.attention}
      items={items}
      viewerName={viewer?.name ?? ""}
      saved={typeof query.salvo === "string" ? query.salvo : null}
      removed={typeof query.apagado === "string" ? query.apagado : null}
    />
  );
}

/** A tela em si, sem buscar nada (facilita testar com dados de exemplo). */
export function DashboardView({
  attention = 0,
  items,
  viewerName,
  saved,
  removed,
}: {
  /** Tickets esperando resposta (aparece na aba). */
  attention?: number;
  items: AdminProduct[];
  viewerName: string;
  saved: string | null;
  removed: string | null;
}) {
  const visible = items.filter((i) => i.active).length;

  return (
    <>
      <PanelTabs active="produtos" attention={attention} />
      <header className="flex flex-col gap-6 border-b border-white/[0.08] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-400">
            Painel do Freitas
          </p>
          <h1 className="mt-2 font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">
            Produtos
          </h1>
          <p className="mt-3 text-stone-400">
            Oi, {viewerName}. {visible} de {items.length} aparecendo no site.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <ButtonLink href="/painel/produto/novo">
            <Plus className="size-4" /> Novo produto
          </ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Ver site
          </ButtonLink>
          <SignOutButton />
        </div>
      </header>

      {(saved || removed) && (
        <p className="mt-6 flex items-center gap-2.5 rounded-2xl bg-emerald-500/10 px-4 py-3 text-[15px] text-emerald-300 ring-1 ring-inset ring-emerald-500/25">
          <CheckCircle2 className="size-5 shrink-0" />
          {saved
            ? `“${saved}” foi salvo. O site já mostra a mudança.`
            : `“${removed}” foi apagado do site.`}
        </p>
      )}

      {categoryOrder.map((category) => {
        const group = items.filter((i) => i.product.category === category);
        return (
          <section key={category} className="mt-12">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-extrabold uppercase leading-none">
                {categories[category].label}
              </h2>
              <Link
                href={`/painel/produto/novo?categoria=${category}`}
                className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand-400 hover:text-brand-300"
              >
                <Plus className="size-4" /> Adicionar
              </Link>
            </div>

            {group.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed border-white/10 px-5 py-6 text-stone-500">
                Nada cadastrado aqui ainda.
              </p>
            ) : (
              <ul className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900">
                {group.map(({ product, active }, index) => (
                  <li
                    key={product.id}
                    className="flex flex-col gap-4 border-white/[0.07] p-4 sm:flex-row sm:items-center [&:not(:first-child)]:border-t"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt=""
                          width={56}
                          height={56}
                          className="size-14 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <ProductSwatch product={product} className="size-14" />
                      )}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/painel/produto/${product.id}`}
                            className="truncate text-lg font-semibold hover:text-brand-300"
                          >
                            {product.name}
                          </Link>
                          {product.tag && (
                            <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-xs font-semibold text-stone-300">
                              {product.tag}
                            </span>
                          )}
                          <span
                            className={
                              active
                                ? "rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-300"
                                : "rounded-full bg-white/[0.06] px-2 py-0.5 text-xs font-semibold text-stone-500"
                            }
                          >
                            {active ? "No site" : "Escondido"}
                          </span>
                        </div>
                        <p className="mt-1 text-[15px] text-stone-400">
                          {priceLabel(product)}
                          {active && (
                            <Link
                              href={`/loja/${product.slug}`}
                              target="_blank"
                              className="ml-2 inline-flex items-center gap-1 text-stone-500 hover:text-white"
                            >
                              ver <ExternalLink className="size-3.5" />
                            </Link>
                          )}
                        </p>
                      </div>
                    </div>
                    <RowActions
                      id={product.id}
                      name={product.name}
                      active={active}
                      first={index === 0}
                      last={index === group.length - 1}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </>
  );
}
