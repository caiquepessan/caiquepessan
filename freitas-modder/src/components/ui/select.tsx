"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  /** Linha menor embaixo do nome. */
  description?: string;
  /** Classe da bolinha colorida à esquerda (ex.: "bg-emerald-400"). */
  dot?: string;
}

/**
 * Lista de escolha com a cara da loja (no lugar do <select> do navegador).
 * Funciona no teclado (setas, Enter, Esc, Home/End) e dentro de formulários
 * (com `name`, manda o valor num campo escondido).
 */
export function Select<T extends string>({
  value,
  onChange,
  options,
  name,
  label,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  name?: string;
  /** Nome para leitores de tela (o texto visível fica fora). */
  label: string;
  className?: string;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [above, setAbove] = useState(false);
  const selected = options.find((o) => o.value === value);

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Lista aberta recebe o foco; a opção ativa fica sempre à vista
  useEffect(() => {
    if (open) listRef.current?.focus({ preventScroll: true });
  }, [open]);
  useEffect(() => {
    if (open) document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, id]);

  function openMenu() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const below = window.innerHeight - rect.bottom;
      setAbove(below < 320 && rect.top > below);
    }
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  }

  function close(focusButton = true) {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  }

  function choose(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    close();
  }

  function onButtonKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openMenu();
    }
  }

  function onListKey(e: KeyboardEvent<HTMLUListElement>) {
    const last = options.length - 1;
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActive((i) => Math.min(last, i + 1)),
      ArrowUp: () => setActive((i) => Math.max(0, i - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => choose(active),
      " ": () => choose(active),
      Escape: () => close(),
    };
    if (e.key === "Tab") {
      close(false);
      return;
    }
    const action = keys[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  }

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-lista`}
        aria-label={`${label}: ${selected?.label ?? ""}`}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onButtonKey}
        className={cn(
          "flex h-11 w-full min-w-52 items-center justify-between gap-3 rounded-xl border bg-ink-950 px-3.5 text-left text-[15px] font-semibold text-white outline-none transition-colors",
          open ? "border-brand-500" : "border-white/10 hover:border-white/25 focus-visible:border-brand-500",
        )}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {selected?.dot && <span aria-hidden className={cn("size-2 shrink-0 rounded-full", selected.dot)} />}
          <span className="truncate">{selected?.label}</span>
        </span>
        <ChevronDown
          aria-hidden
          className={cn("size-4 shrink-0 text-stone-400 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={`${id}-lista`}
            role="listbox"
            aria-label={label}
            tabIndex={-1}
            aria-activedescendant={`${id}-${active}`}
            onKeyDown={onListKey}
            data-lenis-prevent
            initial={{ opacity: 0, y: above ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: above ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className={cn(
              "absolute left-0 z-50 max-h-80 min-w-full overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-ink-900 p-1.5 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.95)] outline-none",
              above ? "bottom-[calc(100%+6px)] origin-bottom" : "top-[calc(100%+6px)] origin-top",
            )}
          >
            {options.map((option, i) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  id={`${id}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-[15px] transition-colors",
                    i === active ? "bg-white/[0.07] text-white" : "text-stone-300",
                    isSelected && "font-semibold text-white",
                  )}
                >
                  {option.dot ? (
                    <span aria-hidden className={cn("size-2 shrink-0 rounded-full", option.dot)} />
                  ) : (
                    <span aria-hidden className="size-2 shrink-0" />
                  )}
                  <span className="flex-1">
                    {option.label}
                    {option.description && (
                      <span className="block text-xs font-normal text-stone-500">{option.description}</span>
                    )}
                  </span>
                  <Check aria-hidden className={cn("size-4 shrink-0 text-brand-400", !isSelected && "invisible")} />
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
