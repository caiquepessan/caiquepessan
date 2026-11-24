import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AccessExplainer } from "@/components/tickets/access-explainer";
import { CustomerGate, TicketsSkeleton } from "@/components/tickets/customer-gate";
import { NewTicketForm, type FormProduct } from "@/components/tickets/new-ticket-form";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import type { Platform, Product } from "@/data/products";
import { getCatalogProduct } from "@/lib/catalog";
import { defaultWhatsappMessage, whatsappLink } from "@/lib/whatsapp";

export default function NovoTicketPage({ searchParams }: PageProps<"/tickets/novo">) {
  return (
    <Suspense fallback={<TicketsSkeleton />}>
      <CustomerGate
        title="Fazer pedido"
        text="Entre com o Discord para abrir o ticket do seu pedido. É por ele que o Freitas te responde, combina o pagamento e libera o acesso à sua conta."
      >
        <NewTicket searchParams={searchParams} />
      </CustomerGate>
    </Suspense>
  );
}

function toFormProduct(product: Product): FormProduct {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    prices: Object.fromEntries(product.variants.map((v) => [v.platform, v.price])),
  };
}

async function NewTicket({ searchParams }: { searchParams: PageProps<"/tickets/novo">["searchParams"] }) {
  const query = await searchParams;
  const slug = typeof query.produto === "string" ? query.produto : null;
  const product = slug ? await getCatalogProduct(slug) : undefined;
  const mode = query.de === "carrinho" ? "carrinho" : product ? "produto" : "outro";
  const platform: Platform | undefined = query.console === "ps4" ? "ps4" : query.console === "ps5" ? "ps5" : undefined;

  const title = mode === "outro" ? "Abrir ticket" : "Fazer pedido";
  return (
    <>
      <Link href="/tickets" className="inline-flex items-center gap-1.5 text-[15px] text-stone-400 hover:text-white">
        <ArrowLeft className="size-4" /> Seus tickets
      </Link>
      <h1 className="mt-3 font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">{title}</h1>
      <p className="mt-3 max-w-xl text-stone-400">
        {mode === "outro"
          ? "Dúvida, pacote diferente ou qualquer outra coisa: o Freitas responde por aqui."
          : "Confira o pedido e abra o ticket. O Freitas responde com o valor e os próximos passos."}
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_minmax(0,0.9fr)] lg:items-start">
        <NewTicketForm
          mode={mode}
          product={product ? toFormProduct(product) : undefined}
          initialPlatform={platform}
        />
        <div className="grid gap-4">
          <AccessExplainer compact />
          <a
            href={whatsappLink(defaultWhatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start text-[15px] font-semibold text-stone-400 hover:text-white"
          >
            <WhatsAppIcon size={17} /> Prefere falar pelo WhatsApp?
          </a>
        </div>
      </div>
    </>
  );
}
