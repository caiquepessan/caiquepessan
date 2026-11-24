import { LogoSymbol } from "@/components/ui/logo";
import type { TicketAttachment } from "@/db/schema";
import { attachmentSrc } from "@/lib/tickets/files";
import { formatWhen } from "@/lib/tickets/format";
import { cn } from "@/lib/utils";

export interface ConversationMessage {
  id: string;
  role: "cliente" | "freitas" | "sistema";
  body: string;
  attachments: TicketAttachment[];
  createdAt: Date;
}

function Attachments({ items, mine }: { items: TicketAttachment[]; mine: boolean }) {
  if (items.length === 0) return null;
  return (
    <div className={cn("mt-2 grid gap-2", items.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
      {items.map((file) => {
        const src = attachmentSrc(file);
        return (
          <a
            key={file.pathname}
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group block overflow-hidden rounded-xl ring-1 ring-inset",
              mine ? "ring-brand-400/30" : "ring-white/10",
            )}
            title="Abrir imagem inteira"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- anexos privados passam pelo site, com login */}
            <img
              src={src}
              alt={file.name}
              loading="lazy"
              className="max-h-80 w-full bg-ink-950 object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </a>
        );
      })}
    </div>
  );
}

/**
 * Conversa do ticket. Quem está olhando (cliente ou Freitas) vê as
 * próprias mensagens à direita.
 */
export function Conversation({
  messages,
  perspective,
  customer,
}: {
  messages: ConversationMessage[];
  perspective: "cliente" | "freitas";
  customer: { name: string; image: string | null };
}) {
  return (
    <ol className="flex flex-col gap-4" aria-label="Conversa">
      {messages.map((message) => {
        if (message.role === "sistema") {
          return (
            <li key={message.id} className="flex justify-center">
              <p className="rounded-full bg-white/[0.04] px-3.5 py-1.5 text-center text-[13px] text-stone-400 ring-1 ring-inset ring-white/[0.06]">
                {message.body} <span className="text-stone-600">· {formatWhen(message.createdAt)}</span>
              </p>
            </li>
          );
        }
        const mine = message.role === perspective;
        const fromFreitas = message.role === "freitas";
        return (
          <li key={message.id} className={cn("flex items-end gap-2.5", mine && "flex-row-reverse")}>
            <span
              aria-hidden
              className={cn(
                "relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-full text-xs font-semibold",
                fromFreitas ? "bg-brand-500" : "bg-ink-700",
              )}
            >
              {fromFreitas ? (
                <LogoSymbol color="#fff" className="h-3.5" />
              ) : customer.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- avatar pequeno do Discord
                <img src={customer.image} alt="" className="size-full object-cover" />
              ) : (
                customer.name.slice(0, 1).toUpperCase()
              )}
            </span>
            <div className={cn("flex max-w-[82%] flex-col sm:max-w-[70%]", mine ? "items-end" : "items-start")}>
              <p className="mb-1 px-1 text-xs text-stone-500">
                <span className={cn("font-semibold", fromFreitas ? "text-brand-300" : "text-stone-300")}>
                  {fromFreitas ? "Freitas" : customer.name}
                </span>{" "}
                · {formatWhen(message.createdAt)}
              </p>
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 text-[15px] leading-relaxed ring-1 ring-inset",
                  mine
                    ? "rounded-br-md bg-brand-500/[0.14] ring-brand-500/25"
                    : "rounded-bl-md bg-ink-800 ring-white/[0.08]",
                )}
              >
                {message.body && <p className="whitespace-pre-wrap break-words">{message.body}</p>}
                <Attachments items={message.attachments} mine={mine} />
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
