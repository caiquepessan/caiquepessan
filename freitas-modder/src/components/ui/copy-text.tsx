"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Texto com botão de copiar (ex.: ID do Discord do cliente). */
export function CopyText({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
      className={cn(
        "inline-flex max-w-full items-center gap-2 rounded-lg bg-ink-950 px-2.5 py-1.5 font-mono text-sm ring-1 ring-inset ring-white/10 hover:ring-white/25",
        className,
      )}
      title="Copiar"
    >
      <span className="truncate">{value}</span>
      {copied ? <Check className="size-4 shrink-0 text-emerald-400" /> : <Copy className="size-4 shrink-0 text-stone-400" />}
    </button>
  );
}
