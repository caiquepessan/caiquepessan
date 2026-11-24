"use client";

import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { useActionState, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { saveProduct, type SaveState } from "@/app/painel/actions";
import { ProductCard } from "@/components/product/product-card";
import { AutoTextarea } from "@/components/ui/auto-textarea";
import { Switch } from "@/components/ui/switch";
import { toneStyles } from "@/components/product/product-panel";
import { categories, categoryOrder, type Category } from "@/data/products";
import { draftPreview, slugify, tones, type Draft, type DraftErrors } from "@/lib/product-draft";
import { cn } from "@/lib/utils";
import { ImageField } from "./image-field";

/** Exemplos que aparecem apagados nos campos, conforme a categoria. */
const hints: Record<
  Category,
  { name: string; value: string; label: string; amount: string; specs: [string, string][] }
> = {
  dinheiro: {
    name: "$500 milhões",
    value: "$500 MI",
    label: "na sua conta",
    amount: "500000000",
    specs: [
      ["Dinheiro", "$500 milhões"],
      ["Sai a", "R$ 0,24 o milhão"],
      ["Entrega", "Rápida"],
    ],
  },
  level: {
    name: "150 levels",
    value: "+150",
    label: "levels",
    amount: "",
    specs: [
      ["Levels", "+150"],
      ["Sai a", "R$ 0,23 o level"],
      ["Entrega", "Rápida"],
    ],
  },
  servico: {
    name: "Unlock All + Corrida Modder",
    value: "100%",
    label: "liberado + corrida modder",
    amount: "",
    specs: [
      ["Unlock All", "Completo"],
      ["Corrida Modder", "Ativada"],
      ["Preço", "Por personagem"],
    ],
  },
  conta: {
    name: "Conta Level 120",
    value: "$466 MI",
    label: "no banco · level 120",
    amount: "466000000",
    specs: [
      ["Level", "120"],
      ["Dinheiro", "+$466 milhões"],
      ["K/D", "10.00"],
    ],
  },
};

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-ink-950 px-4 text-[16px] text-white outline-none transition-colors placeholder:text-stone-600 focus:border-brand-500";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/[0.08] bg-ink-900 p-5 sm:p-7">
      <h2 className="font-display text-2xl font-extrabold uppercase leading-none">{title}</h2>
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[15px] font-semibold text-stone-200">{label}</span>
      {hint && <span className="mt-0.5 block text-sm text-stone-500">{hint}</span>}
      <span className="mt-2 block">{children}</span>
      {error && <span className="mt-1.5 block text-sm font-medium text-brand-300">{error}</span>}
    </label>
  );
}

function MoneyInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <span className="flex items-center rounded-xl border border-white/10 bg-ink-950 transition-colors focus-within:border-brand-500">
      <span className="pl-4 text-stone-500">R$</span>
      <input
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, ""))}
        placeholder="35,00"
        className="h-12 w-full bg-transparent px-3 text-[16px] text-white outline-none placeholder:text-stone-600"
      />
    </span>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-brand-500 px-6 text-[16px] font-semibold text-white transition-colors hover:bg-brand-400 disabled:opacity-60 sm:flex-none"
    >
      {pending ? "Salvando..." : "Salvar"}
    </button>
  );
}

/** Formulário de produto do painel, com prévia do card ao lado. */
export function ProductEditor({ initial }: { initial: Draft }) {
  const [draft, setDraft] = useState(initial);
  const [state, formAction] = useActionState<SaveState, FormData>(saveProduct, {});
  const errors: DraftErrors = state.errors ?? {};
  const hint = hints[draft.category];
  const isNew = !draft.id;

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function setSpec(index: number, key: "label" | "value", value: string) {
    setDraft((d) => ({
      ...d,
      specs: d.specs.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
    }));
  }

  return (
    <div>
      <Link href="/painel" className="inline-flex items-center gap-1.5 text-[15px] text-stone-400 hover:text-white">
        <ArrowLeft className="size-4" /> Voltar ao painel
      </Link>
      <h1 className="mt-3 font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">
        {isNew ? "Novo produto" : "Editar produto"}
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
        <form action={formAction} className="grid gap-6">
          <input type="hidden" name="draft" value={JSON.stringify(draft)} />
          {errors.form && (
            <p className="rounded-2xl bg-brand-500/10 px-4 py-3 text-[15px] text-brand-200 ring-1 ring-inset ring-brand-500/30">
              {errors.form}
            </p>
          )}
          {Object.keys(errors).length > 0 && !errors.form && (
            <p className="rounded-2xl bg-brand-500/10 px-4 py-3 text-[15px] text-brand-200 ring-1 ring-inset ring-brand-500/30">
              Tem campo pra arrumar. Os avisos estão em vermelho embaixo de cada um.
            </p>
          )}

          <Section title="O básico">
            <Field label="Nome" error={errors.name}>
              <input
                className={inputClass}
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder={hint.name}
                maxLength={80}
              />
            </Field>
            <div>
              <span className="text-[15px] font-semibold text-stone-200">Categoria</span>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Categoria">
                {categoryOrder.map((category) => {
                  const active = draft.category === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={active}
                      onClick={() => set("category", category)}
                      className={cn(
                        "h-11 rounded-xl px-4 text-[15px] font-semibold ring-1 ring-inset transition-colors",
                        active
                          ? "bg-brand-500 text-white ring-brand-500"
                          : "text-stone-300 ring-white/10 hover:bg-white/[0.06]",
                      )}
                    >
                      {categories[category].short}
                    </button>
                  );
                })}
              </div>
            </div>
            <Field label="Endereço da página" hint="Pode deixar vazio: ele sai do nome." error={errors.slug}>
              <span className="flex items-center rounded-xl border border-white/10 bg-ink-950 transition-colors focus-within:border-brand-500">
                <span className="pl-4 text-stone-500">/loja/</span>
                <input
                  value={draft.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder={slugify(draft.name) || "nome-do-produto"}
                  className="h-12 w-full bg-transparent pr-4 text-[16px] text-white outline-none placeholder:text-stone-600"
                />
              </span>
            </Field>
          </Section>

          <Section title="Preço no Pix">
            <Switch
              checked={draft.onRequest}
              onChange={(on) => set("onRequest", on)}
              label="Preço a combinar"
              description="Sem preço fixo (ex.: conta única). O site mostra um botão pra perguntar o preço."
            />
            {!draft.onRequest && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="PS4" error={errors.pricePs4}>
                    <MoneyInput value={draft.pricePs4} onChange={(v) => set("pricePs4", v)} />
                  </Field>
                  <Field label="PS5" error={errors.pricePs5}>
                    <MoneyInput value={draft.pricePs5} onChange={(v) => set("pricePs5", v)} />
                  </Field>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-500">
                  <span>Deixe vazio o console em que não vende.</span>
                  {draft.pricePs4 && draft.pricePs4 !== draft.pricePs5 && (
                    <button
                      type="button"
                      onClick={() => set("pricePs5", draft.pricePs4)}
                      className="font-semibold text-brand-400 hover:text-brand-300"
                    >
                      Usar o preço do PS4 no PS5
                    </button>
                  )}
                </div>
              </>
            )}
          </Section>

          <Section title="Card">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Destaque" hint="O texto grande do card.">
                <input
                  className={inputClass}
                  value={draft.headlineValue}
                  onChange={(e) => set("headlineValue", e.target.value)}
                  placeholder={hint.value}
                  maxLength={16}
                />
              </Field>
              <Field label="Legenda" hint="Embaixo do destaque.">
                <input
                  className={inputClass}
                  value={draft.headlineLabel}
                  onChange={(e) => set("headlineLabel", e.target.value)}
                  placeholder={hint.label}
                  maxLength={40}
                />
              </Field>
            </div>
            <Field
              label="Dinheiro do jogo (opcional)"
              hint="Só números. Faz o valor girar na página do produto."
              error={errors.amount}
            >
              <input
                className={inputClass}
                inputMode="numeric"
                value={draft.amount}
                onChange={(e) => set("amount", e.target.value.replace(/\D/g, ""))}
                placeholder={hint.amount || "Ex.: 500000000"}
              />
            </Field>
            <div>
              <span className="text-[15px] font-semibold text-stone-200">Cor do card</span>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Cor do card">
                {tones.map((tone) => (
                  <button
                    key={tone.value}
                    type="button"
                    aria-pressed={draft.tone === tone.value}
                    onClick={() => set("tone", tone.value)}
                    className={cn(
                      "flex h-11 items-center gap-2 rounded-xl pl-2 pr-4 text-[15px] font-semibold ring-1 ring-inset transition-colors",
                      draft.tone === tone.value ? "ring-white" : "ring-white/10 hover:bg-white/[0.06]",
                    )}
                  >
                    <span className={cn("size-7 rounded-lg", toneStyles[tone.value].swatch)} />
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Etiqueta (opcional)" hint="Aparece no canto do card.">
              <input
                className={inputClass}
                value={draft.tag}
                onChange={(e) => set("tag", e.target.value)}
                placeholder="Ex.: Melhor preço"
                maxLength={28}
              />
            </Field>
          </Section>

          <Section title="Textos">
            <Field label="Resumo" hint="Uma frase curta que aparece no card.">
              <input
                className={inputClass}
                value={draft.summary}
                onChange={(e) => set("summary", e.target.value)}
                placeholder="Ex.: O pacote que mais compensa."
                maxLength={120}
              />
            </Field>
            <Field label="Descrição" hint="Texto da página do produto.">
              <AutoTextarea
                className={cn(inputClass, "h-auto min-h-32 py-3 leading-relaxed")}
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
                rows={4}
              />
            </Field>
            <Field label="Entrega">
              <input
                className={inputClass}
                value={draft.delivery}
                onChange={(e) => set("delivery", e.target.value)}
                placeholder="Rápida"
                maxLength={40}
              />
            </Field>
          </Section>

          <Section title="Ficha">
            <p className="-mt-2 text-sm text-stone-500">As três primeiras linhas aparecem no card.</p>
            {draft.specs.map((spec, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input
                  aria-label={`Nome da linha ${index + 1}`}
                  className={inputClass}
                  value={spec.label}
                  onChange={(e) => setSpec(index, "label", e.target.value)}
                  placeholder={hint.specs[index]?.[0] ?? "Nome"}
                />
                <input
                  aria-label={`Valor da linha ${index + 1}`}
                  className={inputClass}
                  value={spec.value}
                  onChange={(e) => setSpec(index, "value", e.target.value)}
                  placeholder={hint.specs[index]?.[1] ?? "Valor"}
                />
                <button
                  type="button"
                  aria-label={`Tirar a linha ${index + 1}`}
                  onClick={() => set("specs", draft.specs.filter((_, i) => i !== index))}
                  className="grid size-12 place-items-center rounded-xl text-stone-400 ring-1 ring-inset ring-white/10 hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            {draft.specs.length < 8 && (
              <button
                type="button"
                onClick={() => set("specs", [...draft.specs, { label: "", value: "" }])}
                className="inline-flex items-center gap-1.5 justify-self-start text-[15px] font-semibold text-brand-400 hover:text-brand-300"
              >
                <Plus className="size-4" /> Linha
              </button>
            )}
          </Section>

          <Section title="O que vem">
            <Field label="Itens" hint="Um por linha. Aparece na página do produto com um ✓.">
              <AutoTextarea
                className={cn(inputClass, "h-auto min-h-36 py-3 leading-relaxed")}
                value={draft.includes}
                onChange={(e) => set("includes", e.target.value)}
                rows={6}
                placeholder={"Desbloqueio completo (Unlock All)\nTodas as tatuagens"}
              />
            </Field>
          </Section>

          <Section title="Foto">
            <ImageField value={draft.image} onChange={(url) => set("image", url)} />
          </Section>

          <Section title="No site">
            <Switch
              checked={draft.active}
              onChange={(on) => set("active", on)}
              label="Mostrar no site"
              description="Desligue para esconder sem apagar (ex.: conta vendida)."
            />
          </Section>

          <div className="sticky bottom-4 z-10 flex gap-3 rounded-2xl bg-ink-950/90 p-3 ring-1 ring-inset ring-white/10 backdrop-blur-lg">
            <SaveButton />
            <Link
              href="/painel"
              className="inline-flex h-12 items-center justify-center rounded-xl px-5 text-[15px] font-semibold text-stone-300 ring-1 ring-inset ring-white/10 hover:bg-white/[0.06]"
            >
              Cancelar
            </Link>
          </div>
        </form>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone-500">
            Prévia do card
          </p>
          <div inert>
            <ProductCard product={draftPreview(draft)} preview />
          </div>
        </aside>
      </div>
    </div>
  );
}
