import Image from "next/image";
import { tiers, type Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { productIconKey, productIcons } from "./icons";

/** Miniatura quadrada do produto (carrinho, listas). */
export function ProductThumb({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const tier = tiers[product.tier];
  const Icon = productIcons[productIconKey(product)];

  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden rounded-lg border border-white/10 bg-linear-to-br",
        tier.gradient,
        className,
      )}
    >
      {product.image ? (
        <Image src={product.image} alt="" fill sizes="96px" className="object-cover" />
      ) : (
        <>
          <div
            aria-hidden
            className="absolute inset-[15%] rounded-full blur-xl"
            style={{ background: tier.glow }}
          />
          <Icon
            aria-hidden
            strokeWidth={1.6}
            className="relative size-[42%]"
            style={{ color: tier.accent, filter: `drop-shadow(0 0 8px ${tier.accent})` }}
          />
        </>
      )}
    </div>
  );
}
