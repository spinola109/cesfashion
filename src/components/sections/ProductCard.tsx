"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product";
import { useShop } from "@/providers/ShopProvider";

type ProductCardProps = {
  product: Product;
};

const categoryLabels: Record<string, string> = {
  vestidos: "Vestidos",
  conjuntos: "Conjuntos",
  blusas: "Blusas",
  calcas: "Calças",
  acessorios: "Acessórios"
};

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useShop();

  function handleBuy() {
    addToCart(product);
    router.push("/cart");
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.32 }}
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-lg border border-ink-900/10 bg-white shadow-[0_18px_50px_rgba(36,30,22,0.09)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-champagne">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full border border-oxblood/20 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-oxblood backdrop-blur">
            {product.badge}
          </span>
        ) : null}
        <button
          type="button"
          aria-label={`Favoritar ${product.name}`}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/10 bg-white/90 text-ink-900 backdrop-blur transition hover:border-oxblood/40 hover:text-oxblood"
        >
          <Heart size={17} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-oxblood">
              {product.categoryLabel ?? categoryLabels[product.category] ?? product.category}
            </p>
            <h3 className="mt-2 font-display text-2xl leading-none text-ink-900">
              {product.name}
            </h3>
          </div>
          <span className="text-right">
            <strong className="block whitespace-nowrap text-sm text-ink-900">
              {formatCurrency(product.price)}
            </strong>
            {product.originalPrice ? (
              <span className="text-xs text-ink-700/45 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            ) : null}
          </span>
        </div>
        <p className="mt-3 min-h-12 text-sm leading-6 text-ink-700/70">
          {product.description}
        </p>
        <div className="mt-5 grid grid-cols-[1fr_3rem] gap-3">
          <button
            type="button"
            onClick={handleBuy}
            className="inline-flex h-11 items-center justify-center rounded-full bg-ink-900 text-sm font-semibold uppercase tracking-[0.12em] text-white transition duration-300 hover:bg-oxblood"
          >
            Comprar
          </button>
          <button
            type="button"
            onClick={handleBuy}
            aria-label={`Adicionar ${product.name} ao carrinho`}
            className="flex h-11 w-12 items-center justify-center rounded-full border border-oxblood/25 bg-oxblood/10 text-oxblood transition duration-300 hover:bg-oxblood hover:text-white"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
