import { Suspense } from "react";
import { AdminGate, PanelSkeleton } from "@/components/admin/admin-gate";
import { ProductEditor } from "@/components/admin/product-editor";
import { categoryOrder, type Category } from "@/data/products";
import { emptyDraft } from "@/lib/product-draft";

export default function NovoProdutoPage({ searchParams }: PageProps<"/painel/produto/novo">) {
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <AdminGate>
        <NewProduct searchParams={searchParams} />
      </AdminGate>
    </Suspense>
  );
}

async function NewProduct({
  searchParams,
}: {
  searchParams: PageProps<"/painel/produto/novo">["searchParams"];
}) {
  const { categoria } = await searchParams;
  const category = categoryOrder.find((c) => c === categoria) ?? ("dinheiro" satisfies Category);
  return <ProductEditor initial={emptyDraft(category)} />;
}
