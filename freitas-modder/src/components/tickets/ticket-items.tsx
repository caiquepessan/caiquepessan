import type { TicketItem } from "@/db/schema";
import { platforms } from "@/data/products";
import { formatCents } from "@/lib/tickets/format";

/** O que foi pedido no ticket (com os preços da hora do pedido). */
export function TicketItems({
  items,
  total,
  psnId,
}: {
  items: TicketItem[];
  total: number | null;
  psnId: string | null;
}) {
  if (items.length === 0 && !psnId) return null;
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-ink-900 p-4 sm:p-5">
      {items.length > 0 && (
        <ul className="grid gap-2.5">
          {items.map((item) => (
            <li key={`${item.slug}-${item.platform}`} className="flex items-baseline justify-between gap-4">
              <span className="min-w-0">
                <span className="font-semibold">
                  {item.qty > 1 && <span className="text-stone-400">{item.qty}x </span>}
                  {item.name}
                </span>{" "}
                <span className="text-sm text-stone-500">· {platforms[item.platform].label}</span>
              </span>
              <span className="shrink-0 tabular-nums text-stone-300">
                {item.unitPrice === null ? "A combinar" : formatCents(item.unitPrice * item.qty)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3 border-t border-white/[0.07] pt-3 text-sm">
        <span className="text-stone-500">
          {psnId ? (
            <>
              ID na PSN: <span className="font-semibold text-stone-300">{psnId}</span>
            </>
          ) : (
            "Preços do momento do pedido"
          )}
        </span>
        {items.length > 0 && (
          <span className="font-display text-2xl font-extrabold tabular-nums">
            {total === null ? "A combinar" : formatCents(total)}
          </span>
        )}
      </div>
    </div>
  );
}
