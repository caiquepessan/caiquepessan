"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/** Chave liga/desliga com a cara da loja (no lugar da caixinha do navegador). */
export function Switch({
  checked,
  onChange,
  label,
  description,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("flex items-start gap-3.5", className)}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? `${id}-desc` : undefined}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-7 w-12 shrink-0 items-center rounded-full ring-1 ring-inset transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400",
          checked ? "bg-brand-500 ring-brand-400/60" : "bg-white/[0.08] ring-white/15 hover:bg-white/[0.12]",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block size-5 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.45)] transition-transform duration-200 ease-out",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
      <label htmlFor={id} className="cursor-pointer select-none">
        <span className="block font-semibold">{label}</span>
        {description && (
          <span id={`${id}-desc`} className="mt-0.5 block text-sm text-stone-500">
            {description}
          </span>
        )}
      </label>
    </div>
  );
}
