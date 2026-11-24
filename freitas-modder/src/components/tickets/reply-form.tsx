"use client";

import { SendHorizontal } from "lucide-react";
import { useActionState, useRef, useState } from "react";
import type { FormState } from "@/app/tickets/actions";
import { LIMITS, statusInfo, TICKET_STATUSES, type TicketStatus } from "@/lib/tickets/status";
import { AttachmentButton, AttachmentPreviews, useAttachments, type UploadedFile } from "./attachment-picker";

export interface ReplyTemplate {
  label: string;
  text: string;
  /** Já escolhe o andamento junto (só no painel). */
  status?: TicketStatus;
}

/** Caixa de resposta do ticket: texto, imagens e (no painel) o andamento. */
export function ReplyForm({
  ticketId,
  action,
  placeholder,
  templates,
  withStatus = false,
}: {
  ticketId: string;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  placeholder: string;
  templates?: ReplyTemplate[];
  withStatus?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { add, remove } = useAttachments(ticketId, files, setFiles);

  const [state, formAction, pending] = useActionState(async (prev: FormState, formData: FormData) => {
    const result = await action(prev, formData);
    if (result.sent) {
      for (const f of files) URL.revokeObjectURL(f.preview);
      setText("");
      setStatus("");
      setFiles([]);
    }
    return result;
  }, {});

  const uploading = files.some((f) => !f.blob && !f.error);
  const ready = files.flatMap((f) => (f.blob ? [f.blob] : []));

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-3xl border border-white/[0.08] bg-ink-900 p-3 sm:p-4"
    >
      <input type="hidden" name="ticket" value={ticketId} />
      <input type="hidden" name="anexos" value={JSON.stringify(ready)} />

      {templates && templates.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="self-center text-xs font-semibold uppercase tracking-[0.1em] text-stone-500">
            Respostas prontas
          </span>
          {templates.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => {
                setText(t.text);
                if (t.status) setStatus(t.status);
              }}
              className="rounded-full bg-white/[0.05] px-3 py-1.5 text-[13px] font-semibold text-stone-300 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.1] hover:text-white"
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <label className="sr-only" htmlFor={`mensagem-${ticketId}`}>
        Mensagem
      </label>
      <textarea
        id={`mensagem-${ticketId}`}
        name="mensagem"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPaste={(e) => {
          if (e.clipboardData.files.length > 0) {
            e.preventDefault();
            add(e.clipboardData.files);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            formRef.current?.requestSubmit();
          }
        }}
        rows={3}
        maxLength={LIMITS.message}
        placeholder={placeholder}
        className="block min-h-24 w-full resize-y rounded-2xl border border-white/10 bg-ink-950 px-4 py-3 text-[16px] leading-relaxed text-white outline-none transition-colors placeholder:text-stone-600 focus:border-brand-500"
      />

      {files.length > 0 && (
        <div className="mt-3">
          <AttachmentPreviews files={files} onRemove={remove} />
        </div>
      )}

      {withStatus && (
        <label className="mt-3 flex flex-wrap items-center gap-2 text-[15px] text-stone-400">
          Depois de enviar, marcar como
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-xl border border-white/10 bg-ink-950 px-3 text-[15px] font-semibold text-white outline-none focus:border-brand-500"
          >
            <option value="">Não mudar</option>
            {TICKET_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusInfo[s].adminLabel}
              </option>
            ))}
          </select>
        </label>
      )}

      {state.error && (
        <p role="alert" className="mt-3 text-sm font-medium text-brand-300">
          {state.error}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <AttachmentButton
          onPick={add}
          disabled={files.length >= LIMITS.attachmentsPerMessage}
          label={files.length > 0 ? "Mais imagens" : "Anexar imagem"}
        />
        <button
          type="submit"
          disabled={pending || uploading}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-500 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-400 disabled:opacity-50"
        >
          {pending ? "Enviando..." : uploading ? "Subindo imagem..." : "Enviar"}
          <SendHorizontal className="size-4" />
        </button>
      </div>
    </form>
  );
}
