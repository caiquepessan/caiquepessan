import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { currentStep, stepsFor, type TicketKind, type TicketStatus } from "@/lib/tickets/status";

/** Linha do tempo: pedido, pagamento, acesso à conta, serviço, entregue. */
export function TicketProgress({ kind, status }: { kind: TicketKind; status: TicketStatus }) {
  const steps = stepsFor(kind);
  if (steps.length === 0) return null;
  const current = currentStep(kind, status);
  const closed = status === "fechado";

  return (
    <ol
      aria-label="Andamento do pedido"
      className={cn("grid gap-2", steps.length === 5 ? "grid-cols-5" : "grid-cols-3", closed && "opacity-50")}
    >
      {steps.map((step, i) => {
        const done = !closed && i < current;
        const active = !closed && i === current;
        return (
          <li key={step} aria-current={active ? "step" : undefined} className="min-w-0">
            <span
              className={cn(
                "block h-1.5 rounded-full",
                done ? "bg-emerald-400" : active ? "bg-brand-500" : "bg-white/10",
              )}
            />
            <span
              className={cn(
                "mt-2 flex items-center gap-1 text-xs font-medium leading-tight sm:text-[13px]",
                done ? "text-emerald-300" : active ? "text-white" : "text-stone-500",
              )}
            >
              {done && <Check className="hidden size-3.5 shrink-0 sm:block" strokeWidth={3} />}
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
