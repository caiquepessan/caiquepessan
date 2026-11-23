"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ShoppingBag } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { Button, ButtonAnchor } from "@/components/ui/button";
import {
  getDiscount,
  getVariant,
  platforms,
  type Platform,
  type Product,
} from "@/data/products";
import { formatBRL } from "@/lib/utils";
import { buildProductMessage, whatsappLink } from "@/lib/whatsapp";
import { AnimatedPrice } from "./animated-price";
import { PlatformSwitch } from "./platform-switch";
import { useAddToCart } from "./use-add-to-cart";

const subscribe = () => () => {};
const readUrlPlatform = () => new URLSearchParams(window.location.search).get("plataforma");

/** Bloco de compra: plataforma, preço e botões. */
export function ProductPurchase({ product }: { product: Product }) {
  const options = product.variants.map((v) => v.platform);
  const urlPlatform = useSyncExternalStore(subscribe, readUrlPlatform, () => null);
  const [picked, setPicked] = useState<Platform | null>(null);
  const platform: Platform =
    picked ??
    (urlPlatform && options.includes(urlPlatform as Platform)
      ? (urlPlatform as Platform)
      : options[0]);

  const variant = getVariant(product, platform);
  const discount = getDiscount(variant);
  const addToCart = useAddToCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product, platform);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-ink-850/80 p-5 backdrop-blur sm:p-6">
      <p className="mb-3 font-tech text-xs font-semibold uppercase tracking-[0.25em] text-bone-500">
        Plataforma
      </p>
      <PlatformSwitch
        options={options}
        value={platform}
        onChange={setPicked}
        size="lg"
      />
      <p className="mt-2 text-xs text-bone-500">{platforms[platform].long}</p>

      <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-2">
        <AnimatedPrice
          value={variant.price}
          className="font-display text-6xl leading-none tracking-wide text-bone-50"
        />
        <AnimatePresence mode="popLayout">
          {variant.oldPrice && (
            <motion.div
              key={variant.oldPrice}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="mb-1.5 flex items-center gap-2"
            >
              <span className="text-sm text-bone-600 line-through">{formatBRL(variant.oldPrice)}</span>
              {discount > 0 && (
                <span className="clip-corner bg-blood-500 px-2 py-0.5 font-tech text-xs font-bold text-white [--cut:5px]">
                  -{discount}%
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-2 text-sm text-bone-400">À vista no PIX. Também aceitamos cartão de crédito.</p>

      {product.stock !== undefined && product.stock <= 10 && (
        <p className="mt-4 flex items-center gap-2 text-sm text-ember-400">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-ember-500 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-ember-500" />
          </span>
          Restam só {product.stock} {product.stock === 1 ? "unidade" : "unidades"}
        </p>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button onClick={handleAdd} size="lg" className="w-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={added ? "added" : "add"}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2.5"
            >
              {added ? <Check className="size-5" /> : <ShoppingBag className="size-5" />}
              {added ? "Adicionado!" : "Adicionar ao carrinho"}
            </motion.span>
          </AnimatePresence>
        </Button>
        <ButtonAnchor
          href={whatsappLink(
            buildProductMessage(product.name, platforms[platform].label, variant.price),
          )}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          size="lg"
          className="w-full"
        >
          <WhatsAppIcon size={19} />
          Comprar no WhatsApp
        </ButtonAnchor>
      </div>
    </div>
  );
}
