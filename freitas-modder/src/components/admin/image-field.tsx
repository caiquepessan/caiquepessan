"use client";

import { upload } from "@vercel/blob/client";
import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

/**
 * Foto do produto: envia direto do navegador para o Vercel Blob (aceita
 * até 10 MB) e devolve o endereço da imagem.
 */
export function ImageField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function send(file: File) {
    setError("");
    setProgress(0);
    try {
      const blob = await upload(`produtos/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      });
      onChange(blob.url);
    } catch {
      setError("Não deu pra enviar. Use JPG, PNG ou WebP de até 10 MB.");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative grid size-28 shrink-0 place-items-center overflow-hidden rounded-2xl bg-ink-950 ring-1 ring-inset ring-white/10">
          {value ? (
            <Image src={value} alt="Foto do produto" fill sizes="112px" className="object-cover" />
          ) : (
            <ImagePlus className="size-7 text-stone-600" />
          )}
          {progress !== null && (
            <div className="absolute inset-x-3 bottom-3 h-1.5 overflow-hidden rounded-full bg-white/15">
              <div className="h-full bg-brand-500 transition-[width]" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={progress !== null}
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-white/[0.06] px-4 text-[15px] font-semibold ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.12] disabled:opacity-50"
          >
            <ImagePlus className="size-4" />
            {progress !== null ? `Enviando ${Math.round(progress)}%` : value ? "Trocar foto" : "Escolher foto"}
          </button>
          {value && progress === null && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-stone-400 hover:text-brand-300"
            >
              <Trash2 className="size-4" />
              Tirar foto
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void send(file);
        }}
      />
      <p className="mt-3 text-sm text-stone-500">
        Opcional. Sem foto, o card usa a cor e o destaque. Com foto (print da conta,
        por exemplo), ela aparece por trás do número.
      </p>
      {error && <p className="mt-2 text-sm font-medium text-brand-300">{error}</p>}
    </div>
  );
}
