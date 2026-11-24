import { cn } from "@/lib/utils";
import { statusInfo, toneClasses, type TicketStatus } from "@/lib/tickets/status";

/** Etiqueta colorida com o andamento do ticket. */
export function StatusBadge({
  status,
  admin = false,
  className,
}: {
  status: TicketStatus;
  /** Nome curto do painel ("Fazendo" em vez de "Na sua conta"). */
  admin?: boolean;
  className?: string;
}) {
  const info = statusInfo[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        toneClasses[info.tone],
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {admin ? info.adminLabel : info.label}
    </span>
  );
}
