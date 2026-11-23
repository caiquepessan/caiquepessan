"use client";

import { Check, Copy, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DiscordIcon } from "@/components/icons/brand-icons";
import { authClient, signInWithDiscord } from "@/lib/auth-client";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-white/[0.08] bg-ink-900 p-7 sm:p-9">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-400">Painel do Freitas</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-none sm:text-5xl">{title}</h1>
      <div className="mt-5 text-[16px] leading-relaxed text-stone-300">{children}</div>
    </div>
  );
}

export function LoginCard() {
  const [loading, setLoading] = useState(false);
  return (
    <Card title="Entrar">
      <p>Use a conta do Discord do Freitas para cadastrar serviços, contas e preços.</p>
      <button
        type="button"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          const { error } = await signInWithDiscord("/painel");
          if (error) setLoading(false);
        }}
        className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#5865F2] text-[16px] font-semibold text-white transition-[filter] hover:brightness-110 disabled:opacity-60"
      >
        <DiscordIcon size={20} aria-hidden />
        {loading ? "Abrindo o Discord..." : "Entrar com Discord"}
      </button>
    </Card>
  );
}

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
      className={
        className ??
        "inline-flex h-11 items-center gap-2 rounded-xl px-4 text-[15px] font-semibold text-stone-300 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.06] hover:text-white"
      }
    >
      <LogOut className="size-4" />
      Sair
    </button>
  );
}

export function NoAccessCard({ name, discordId }: { name: string; discordId: string | null }) {
  const [copied, setCopied] = useState(false);
  return (
    <Card title="Sem acesso">
      <p>
        Oi, {name}. Seu Discord ainda não tem acesso ao painel. Se você é o Freitas,
        mande este ID para quem cuida do site liberar:
      </p>
      {discordId && (
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(discordId);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }}
          className="mt-5 flex w-full items-center justify-between gap-3 rounded-xl bg-ink-950 px-4 py-3.5 font-mono text-lg tracking-wide ring-1 ring-inset ring-white/10"
        >
          {discordId}
          {copied ? <Check className="size-5 text-emerald-400" /> : <Copy className="size-5 text-stone-400" />}
        </button>
      )}
      <div className="mt-6">
        <SignOutButton />
      </div>
    </Card>
  );
}

export function SetupCard() {
  return (
    <Card title="Falta ligar o login">
      <p>
        O painel usa o login com Discord, que ainda não foi configurado na Vercel.
        Faltam estas variáveis de ambiente no projeto:
      </p>
      <ul className="mt-4 grid gap-2 font-mono text-[15px] text-stone-200">
        <li>DISCORD_CLIENT_ID</li>
        <li>DISCORD_CLIENT_SECRET</li>
        <li>BETTER_AUTH_SECRET</li>
        <li>ADMIN_DISCORD_IDS</li>
      </ul>
      <p className="mt-4 text-stone-400">Depois de colocar, é só publicar de novo.</p>
    </Card>
  );
}
