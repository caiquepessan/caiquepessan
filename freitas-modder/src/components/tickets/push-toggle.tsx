"use client";

import { BellOff, BellRing, Smartphone } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { removePush, savePush, testPush } from "@/app/tickets/push-actions";
import { cn } from "@/lib/utils";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

type Support = "server" | "ok" | "iphone" | "unsupported";

function readSupport(): Support {
  const ios =
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const installed =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  const ready = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  if (ios && !installed) return "iphone";
  return ready && PUBLIC_KEY ? "ok" : "unsupported";
}

const noop = () => () => {};

function keyBytes(base64url: string) {
  const base64 = (base64url + "=".repeat((4 - (base64url.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

/**
 * Ativar avisos no celular (notificação do navegador). O Freitas recebe
 * ticket novo e resposta de cliente; o cliente recebe as respostas dele.
 */
export function PushToggle({ audience, className }: { audience: "cliente" | "admin"; className?: string }) {
  const support = useSyncExternalStore(noop, readSupport, () => "server" as Support);
  const [status, setStatus] = useState<"loading" | "on" | "off" | "denied">("loading");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (support !== "ok") return;
    let alive = true;
    (async () => {
      if (Notification.permission === "denied") {
        if (alive) setStatus("denied");
        return;
      }
      const registration = await navigator.serviceWorker.getRegistration("/");
      const subscription = await registration?.pushManager.getSubscription();
      if (alive) setStatus(subscription ? "on" : "off");
    })().catch(() => alive && setStatus("off"));
    return () => {
      alive = false;
    };
  }, [support]);

  async function enable() {
    setBusy(true);
    setError("");
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: keyBytes(PUBLIC_KEY),
        }));
      const json = subscription.toJSON();
      const result = await savePush({
        endpoint: subscription.endpoint,
        keys: { p256dh: json.keys?.p256dh ?? "", auth: json.keys?.auth ?? "" },
      });
      if (!result.ok) {
        await subscription.unsubscribe();
        setError(result.error ?? "Não deu pra ativar agora.");
        return;
      }
      setStatus("on");
      void testPush();
    } catch {
      setError("Não deu pra ativar agora. Tente de novo.");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration("/");
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        await removePush(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setStatus("off");
    } finally {
      setBusy(false);
    }
  }

  if (support === "server" || support === "unsupported" || (support === "ok" && status === "loading")) {
    return null;
  }

  const text =
    audience === "admin"
      ? "Receba aviso de ticket novo e de resposta de cliente, mesmo com o site fechado."
      : "Receba aviso quando o Freitas responder ou mudar o andamento, mesmo com o site fechado.";

  return (
    <section
      aria-label="Avisos no celular"
      className={cn("flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-ink-900 p-4 sm:flex-row sm:items-center", className)}
    >
      <span
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-xl ring-1 ring-inset",
          status === "on" ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25" : "bg-brand-500/15 text-brand-300 ring-brand-500/25",
        )}
      >
        {support === "iphone" ? <Smartphone className="size-5" /> : status === "denied" ? <BellOff className="size-5" /> : <BellRing className="size-5" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">
          {status === "on" ? "Avisos ligados neste aparelho" : "Aviso no celular"}
        </p>
        <p className="mt-0.5 text-sm leading-relaxed text-stone-400">
          {support === "iphone"
            ? "No iPhone, primeiro adicione o site à Tela de Início: toque em Compartilhar e depois em \"Adicionar à Tela de Início\". Abra pelo ícone e ative aqui."
            : status === "denied"
              ? "As notificações deste site estão bloqueadas. Libere nas configurações do navegador (no cadeado ao lado do endereço) e volte aqui."
              : status === "on"
                ? "Pronto. Se trocar de celular ou navegador, é só ativar lá também."
                : text}
        </p>
        {error && <p className="mt-1.5 text-sm font-medium text-brand-300">{error}</p>}
      </div>
      {support === "ok" && status === "off" && (
        <button
          type="button"
          onClick={enable}
          disabled={busy}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-400 disabled:opacity-60"
        >
          <BellRing className="size-4" />
          {busy ? "Ativando..." : "Ativar avisos"}
        </button>
      )}
      {support === "ok" && status === "on" && (
        <button
          type="button"
          onClick={disable}
          disabled={busy}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-4 text-sm font-semibold text-stone-400 ring-1 ring-inset ring-white/10 transition-colors hover:text-white disabled:opacity-60"
        >
          Desligar
        </button>
      )}
    </section>
  );
}
