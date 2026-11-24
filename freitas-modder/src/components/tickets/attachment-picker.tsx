"use client";

import { upload } from "@vercel/blob/client";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef } from "react";
import { PRIVATE_UPLOADS } from "@/lib/tickets/files";
import { ATTACHMENT_TYPES, LIMITS } from "@/lib/tickets/status";
import { cn } from "@/lib/utils";

export interface UploadedFile {
  key: string;
  name: string;
  preview: string;
  progress: number;
  error?: string;
  /** Preenchido quando o envio termina. */
  blob?: { url: string; pathname: string; contentType: string; size: number; name: string };
}

/** "Comprovante Pix (1).PNG" -> "comprovante-pix-1.png" */
function safeName(name: string) {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
    .slice(0, 40);
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "png";
  return `${base || "imagem"}.${ext || "png"}`;
}

/**
 * Anexar imagens ao ticket (comprovante, QR Code, provas). Envia direto
 * para o Vercel Blob enquanto a pessoa escreve. Também aceita colar print.
 */
export function useAttachments(
  ticketId: string,
  files: UploadedFile[],
  setFiles: (update: (files: UploadedFile[]) => UploadedFile[]) => void,
) {
  async function add(list: FileList | File[]) {
    const room = LIMITS.attachmentsPerMessage - files.length;
    for (const file of Array.from(list).slice(0, Math.max(0, room))) {
      const key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const preview = URL.createObjectURL(file);
      const base: UploadedFile = { key, name: file.name || "print.png", preview, progress: 0 };
      if (!ATTACHMENT_TYPES.includes(file.type)) {
        setFiles((all) => [...all, { ...base, error: "Use JPG, PNG, WebP ou GIF." }]);
        continue;
      }
      if (file.size > LIMITS.attachmentBytes) {
        setFiles((all) => [...all, { ...base, error: "Imagem maior que 10 MB." }]);
        continue;
      }
      setFiles((all) => [...all, base]);
      upload(`tickets/${ticketId}/${safeName(file.name || "print.png")}`, file, {
        access: PRIVATE_UPLOADS ? "private" : "public",
        handleUploadUrl: "/api/upload",
        clientPayload: JSON.stringify({ kind: "ticket", ticket: ticketId }),
        onUploadProgress: ({ percentage }) =>
          setFiles((all) => all.map((f) => (f.key === key ? { ...f, progress: percentage } : f))),
      })
        .then((blob) =>
          setFiles((all) =>
            all.map((f) =>
              f.key === key
                ? {
                    ...f,
                    progress: 100,
                    blob: {
                      url: blob.url,
                      pathname: blob.pathname,
                      contentType: blob.contentType,
                      size: file.size,
                      name: file.name || "print.png",
                    },
                  }
                : f,
            ),
          ),
        )
        .catch(() =>
          setFiles((all) =>
            all.map((f) => (f.key === key ? { ...f, error: "Não deu pra enviar. Tente de novo." } : f)),
          ),
        );
    }
  }

  function remove(key: string) {
    setFiles((all) => {
      const gone = all.find((f) => f.key === key);
      if (gone) URL.revokeObjectURL(gone.preview);
      return all.filter((f) => f.key !== key);
    });
  }

  return { add, remove };
}

export function AttachmentButton({
  onPick,
  disabled,
  label = "Anexar imagem",
}: {
  onPick: (files: FileList) => void;
  disabled?: boolean;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="inline-flex h-11 items-center gap-2 rounded-xl px-3.5 text-[15px] font-semibold text-stone-300 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
      >
        <ImagePlus className="size-[18px]" />
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ATTACHMENT_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) onPick(e.target.files);
          e.target.value = "";
        }}
      />
    </>
  );
}

export function AttachmentPreviews({
  files,
  onRemove,
}: {
  files: UploadedFile[];
  onRemove: (key: string) => void;
}) {
  if (files.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2.5">
      {files.map((file) => (
        <li
          key={file.key}
          className={cn(
            "relative size-20 overflow-hidden rounded-xl bg-ink-950 ring-1 ring-inset",
            file.error ? "ring-brand-500/60" : "ring-white/10",
          )}
          title={file.error ?? file.name}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- prévia local do arquivo */}
          <img src={file.preview} alt={file.name} className="size-full object-cover" />
          {!file.blob && !file.error && (
            <span className="absolute inset-0 grid place-items-center bg-black/55 text-xs font-semibold">
              <Loader2 className="size-5 animate-spin" />
              <span className="sr-only">Enviando {Math.round(file.progress)}%</span>
            </span>
          )}
          {file.error && (
            <span className="absolute inset-x-0 bottom-0 bg-brand-600/90 px-1 py-0.5 text-center text-[10px] font-semibold leading-tight">
              Falhou
            </span>
          )}
          <button
            type="button"
            onClick={() => onRemove(file.key)}
            aria-label={`Tirar ${file.name}`}
            className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/70 text-white hover:bg-black"
          >
            <X className="size-3.5" />
          </button>
        </li>
      ))}
    </ul>
  );
}
