"use server";

import { del } from "@vercel/blob";
import { and, asc, eq, max, ne } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { productToRow } from "@/db/mappers";
import { products } from "@/db/schema";
import { isProductId } from "@/lib/admin-products";
import { CATALOG_TAG } from "@/lib/catalog";
import { validateDraft, type Draft, type DraftErrors } from "@/lib/product-draft";
import { requireAdmin } from "@/lib/viewer";

export interface SaveState {
  errors?: DraftErrors;
}

const BLOB_HOST = ".public.blob.vercel-storage.com";

/** Apaga a foto antiga do Vercel Blob (se for de lá). Falha não trava nada. */
async function removeImage(url: string | null | undefined) {
  if (!url || !new URL(url).hostname.endsWith(BLOB_HOST)) return;
  try {
    await del(url);
  } catch (error) {
    console.error("[painel] não consegui apagar a foto antiga", error);
  }
}

/** Cria ou atualiza um produto. O formulário manda o rascunho em JSON. */
export async function saveProduct(_prev: SaveState, formData: FormData): Promise<SaveState> {
  try {
    await requireAdmin();
  } catch {
    return { errors: { form: "Sua sessão expirou. Entre de novo com o Discord." } };
  }

  let draft: Draft;
  try {
    draft = JSON.parse(String(formData.get("draft") ?? ""));
  } catch {
    return { errors: { form: "Não consegui ler o formulário. Recarregue a página." } };
  }

  const result = validateDraft(draft);
  if (result.errors) return { errors: result.errors };
  const { product } = result;
  const db = getDb();

  const sameSlug = await db
    .select({ id: products.id })
    .from(products)
    .where(
      product.id
        ? and(eq(products.slug, product.slug), ne(products.id, product.id))
        : eq(products.slug, product.slug),
    )
    .limit(1);
  if (sameSlug.length > 0) {
    return { errors: { slug: "Já existe outro produto com esse endereço. Mude o nome ou o endereço." } };
  }

  if (product.id) {
    if (!isProductId(product.id)) return { errors: { form: "Produto não encontrado." } };
    const [current] = await db
      .select({ image: products.image })
      .from(products)
      .where(eq(products.id, product.id))
      .limit(1);
    if (!current) return { errors: { form: "Esse produto foi apagado." } };

    // Mantém a ordem atual (sort fica de fora); o resto vem do formulário.
    const values = productToRow(product, 0);
    delete values.sort;
    await db
      .update(products)
      .set({ ...values, active: draft.active })
      .where(eq(products.id, product.id));
    if (current.image && current.image !== product.image) await removeImage(current.image);
  } else {
    const [{ last }] = await db
      .select({ last: max(products.sort) })
      .from(products)
      .where(eq(products.category, product.category));
    await db.insert(products).values({
      ...productToRow(product, (last ?? -1) + 1),
      active: draft.active,
    });
  }

  updateTag(CATALOG_TAG);
  redirect(`/painel?salvo=${encodeURIComponent(product.name)}`);
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!isProductId(id)) return;
  const [removed] = await getDb()
    .delete(products)
    .where(eq(products.id, id))
    .returning({ name: products.name, image: products.image });
  if (removed) await removeImage(removed.image);
  updateTag(CATALOG_TAG);
  redirect(`/painel?apagado=${encodeURIComponent(removed?.name ?? "")}`);
}

/** Mostra ou esconde do site (ex.: conta vendida). */
export async function setProductActive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!isProductId(id)) return;
  await getDb()
    .update(products)
    .set({ active: formData.get("active") === "1" })
    .where(eq(products.id, id));
  updateTag(CATALOG_TAG);
  refresh();
}

/** Sobe ou desce o produto dentro da categoria. */
export async function moveProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? -1 : 1;
  if (!isProductId(id)) return;
  const db = getDb();

  const [target] = await db
    .select({ category: products.category })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  if (!target) return;

  const siblings = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.category, target.category))
    .orderBy(asc(products.sort), asc(products.createdAt));
  const index = siblings.findIndex((s) => s.id === id);
  const swapWith = index + direction;
  if (index < 0 || swapWith < 0 || swapWith >= siblings.length) return;

  const order = siblings.map((s) => s.id);
  [order[index], order[swapWith]] = [order[swapWith], order[index]];
  // Regrava a ordem inteira da categoria (poucos itens, fica simples e certo).
  await Promise.all(
    order.map((productId, position) =>
      db.update(products).set({ sort: position }).where(eq(products.id, productId)),
    ),
  );
  updateTag(CATALOG_TAG);
  refresh();
}
