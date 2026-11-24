"use client";

import { useState } from "react";
import { DiscordIcon } from "@/components/icons/brand-icons";
import { signInWithDiscord } from "@/lib/auth-client";

/** Para abrir ou ver tickets, a pessoa entra com o Discord. */
export function LoginRequired({ title, text }: { title: string; text: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-white/[0.08] bg-ink-900 p-7 sm:p-9">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-400">Tickets</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-none sm:text-5xl">{title}</h1>
      <p className="mt-5 text-[16px] leading-relaxed text-stone-300">{text}</p>
      <button
        type="button"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          const { error } = await signInWithDiscord(window.location.pathname + window.location.search);
          if (error) setLoading(false);
        }}
        className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#5865F2] text-[16px] font-semibold text-white transition-[filter] hover:brightness-110 disabled:opacity-60"
      >
        <DiscordIcon size={20} aria-hidden />
        {loading ? "Abrindo o Discord..." : "Entrar com Discord"}
      </button>
      <p className="mt-4 text-sm text-stone-500">
        Usamos o Discord só para saber quem é você e te avisar das respostas.
      </p>
    </div>
  );
}
