import { QrCode, ScanLine, ShieldCheck, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Wallet,
    title: "Combina e paga",
    text: "O Freitas responde no ticket com o valor e o Pix. Você manda o comprovante lá mesmo.",
  },
  {
    icon: QrCode,
    title: "Libera o acesso",
    text: "Ele manda um QR Code no ticket. Você escaneia com o app da PlayStation e libera a entrada dele na sua conta, sem passar senha.",
  },
  {
    icon: ScanLine,
    title: "Ele faz na sua conta",
    text: "Com o acesso liberado, o Freitas entra na sua conta e faz o serviço (dinheiro, level, Unlock All).",
  },
  {
    icon: ShieldCheck,
    title: "Provas e entrega",
    text: "Ele manda prints como prova e marca o ticket como entregue. É só entrar no jogo e conferir.",
  },
];

/**
 * Explica que quase tudo é feito pelo Freitas dentro da conta do jogador,
 * com o acesso liberado por QR Code.
 */
export function AccessExplainer({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <section
      aria-label="Como o serviço é feito"
      className={cn("rounded-3xl border border-white/[0.08] bg-ink-900 p-5 sm:p-7", className)}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-400">Como é feito</p>
      <h2 className="mt-2 font-display text-3xl font-extrabold uppercase leading-none sm:text-4xl">
        O Freitas faz na sua conta
      </h2>
      {!compact && (
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-stone-400">
          Dinheiro, level e Unlock All dependem do acesso dele à sua conta da PSN. Por isso
          todo pedido vira um ticket: é por lá que vocês combinam tudo, passo a passo.
        </p>
      )}
      <ol className={cn("mt-6 grid gap-5", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4")}>
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="flex gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-inset ring-brand-500/25">
              <Icon className="size-5" />
            </span>
            <span>
              <span className="block font-semibold">
                <span className="text-brand-400">{i + 1}.</span> {title}
              </span>
              <span className="mt-1 block text-[15px] leading-relaxed text-stone-400">{text}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
