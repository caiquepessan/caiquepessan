"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { deleteProduct, moveProduct, setProductActive } from "@/app/painel/actions";
import { cn } from "@/lib/utils";

const iconButton =
  "grid size-10 place-items-center rounded-xl text-stone-300 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.08] hover:text-white disabled:pointer-events-none disabled:opacity-30";

function Submit({ label, disabled, danger, children }: { label: string; disabled?: boolean; danger?: boolean; children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-label={label}
      title={label}
      disabled={disabled || pending}
      className={cn(iconButton, pending && "animate-pulse", danger && "hover:bg-brand-500/15 hover:text-brand-300")}
    >
      {children}
    </button>
  );
}

/** Botões de cada produto na lista do painel. */
export function RowActions({
  id,
  name,
  active,
  first,
  last,
}: {
  id: string;
  name: string;
  active: boolean;
  first: boolean;
  last: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <form action={moveProduct}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="up" />
        <Submit label="Subir" disabled={first}>
          <ArrowUp className="size-4" />
        </Submit>
      </form>
      <form action={moveProduct}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="down" />
        <Submit label="Descer" disabled={last}>
          <ArrowDown className="size-4" />
        </Submit>
      </form>
      <form action={setProductActive}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="active" value={active ? "0" : "1"} />
        <Submit label={active ? "Esconder do site" : "Mostrar no site"}>
          {active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </Submit>
      </form>
      <Link href={`/painel/produto/${id}`} aria-label="Editar" title="Editar" className={iconButton}>
        <Pencil className="size-4" />
      </Link>
      <form
        action={deleteProduct}
        onSubmit={(e) => {
          if (!window.confirm(`Apagar “${name}”? Isso não dá pra desfazer.`)) e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <Submit label="Apagar" danger>
          <Trash2 className="size-4" />
        </Submit>
      </form>
    </div>
  );
}
