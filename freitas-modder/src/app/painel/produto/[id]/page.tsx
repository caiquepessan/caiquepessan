import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminGate, PanelSkeleton } from "@/components/admin/admin-gate";
import { ProductEditor } from "@/components/admin/product-editor";
import { getAdminProduct } from "@/lib/admin-products";
import { productToDraft } from "@/lib/product-draft";

export default function EditarProdutoPage({ params }: PageProps<"/painel/produto/[id]">) {
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <AdminGate>
        <EditProduct params={params} />
      </AdminGate>
    </Suspense>
  );
}

async function EditProduct({ params }: { params: PageProps<"/painel/produto/[id]">["params"] }) {
  const { id } = await params;
  const item = await getAdminProduct(id);
  if (!item) notFound();
  return <ProductEditor initial={productToDraft(item.product, item.active)} />;
}
