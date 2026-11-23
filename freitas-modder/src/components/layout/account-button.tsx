"use client";

import { AnimatePresence, motion } from "motion/react";
import { LayoutDashboard, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DiscordIcon } from "@/components/icons/brand-icons";
import { authClient, loginEnabled, signInWithDiscord } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

async function signIn() {
  const { error } = await signInWithDiscord();
  if (error) toast.error("Não deu pra entrar agora. Tenta de novo daqui a pouco.");
}

async function signOut() {
  await authClient.signOut();
  window.location.reload();
}

function Avatar({ name, image, className }: { name: string; image?: string | null; className?: string }) {
  return (
    <span className={cn("relative grid place-items-center overflow-hidden rounded-full bg-brand-500 font-semibold", className)}>
      {image ? (
        <Image src={image} alt="" fill sizes="40px" className="object-cover" />
      ) : (
        name.slice(0, 1).toUpperCase()
      )}
    </span>
  );
}

/** Botão "Entrar com Discord" ou foto de quem está logado (com menu). */
export function AccountButton({ className }: { className?: string }) {
  if (!loginEnabled) return null;
  return <Account className={className} />;
}

function Account({ className }: { className?: string }) {
  const { data, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (isPending) {
    return <span aria-hidden className={cn("block size-10 rounded-full bg-white/[0.06]", className)} />;
  }

  if (!data) {
    return (
      <button
        type="button"
        onClick={signIn}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-full bg-white/[0.06] px-4 text-sm font-semibold text-white ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.12]",
          className,
        )}
      >
        <DiscordIcon size={17} aria-hidden />
        Entrar
      </button>
    );
  }

  const { user } = data;
  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Sua conta: ${user.name}`}
        className="block rounded-full ring-2 ring-white/10 transition-shadow hover:ring-white/30"
      >
        <Avatar name={user.name} image={user.image} className="size-10 text-sm" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-12 w-60 origin-top-right rounded-2xl border border-white/10 bg-ink-900 p-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)]"
          >
            <p className="truncate px-3 pb-2 pt-1.5 text-sm text-stone-400">
              Logado como <span className="font-semibold text-white">{user.name}</span>
            </p>
            {user.isAdmin && (
              <Link
                href="/painel"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors hover:bg-white/[0.06]"
              >
                <LayoutDashboard className="size-4 text-brand-400" />
                Painel
              </Link>
            )}
            <button
              type="button"
              onClick={signOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[15px] font-medium transition-colors hover:bg-white/[0.06]"
            >
              <LogOut className="size-4 text-stone-400" />
              Sair
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Versão do menu do celular: linha larga com o mesmo comportamento. */
export function MobileAccount({ onNavigate }: { onNavigate: () => void }) {
  if (!loginEnabled) return null;
  return <MobileAccountInner onNavigate={onNavigate} />;
}

function MobileAccountInner({ onNavigate }: { onNavigate: () => void }) {
  const { data, isPending } = authClient.useSession();
  if (isPending) return null;
  if (!data) {
    return (
      <button
        type="button"
        onClick={signIn}
        className="inline-flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-white/[0.06] text-lg font-semibold ring-1 ring-inset ring-white/10"
      >
        <DiscordIcon size={20} aria-hidden />
        Entrar com Discord
      </button>
    );
  }
  const { user } = data;
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3 ring-1 ring-inset ring-white/10">
      <Avatar name={user.name} image={user.image} className="size-11 shrink-0 text-base" />
      <p className="min-w-0 flex-1 truncate font-semibold">{user.name}</p>
      {user.isAdmin && (
        <Link
          href="/painel"
          onClick={onNavigate}
          className="rounded-xl bg-brand-500 px-3.5 py-2 text-sm font-semibold"
        >
          Painel
        </Link>
      )}
      <button
        type="button"
        onClick={signOut}
        className="rounded-xl px-3 py-2 text-sm font-semibold text-stone-400 ring-1 ring-inset ring-white/10"
      >
        Sair
      </button>
    </div>
  );
}
