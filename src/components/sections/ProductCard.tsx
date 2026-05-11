"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

const categoryLabels: Record<Product["category"], string> = {
  vestidos: "Vestidos",
  conjuntos: "Conjuntos",
  blusas: "Blusas",
  calcas: "Calças",
  acessorios: "Acessórios"
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] shadow-noir backdrop-blur-sm"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/54 via-transparent to-transparent opacity-80" />
        {product.badge ? (
          <span className="absolute left-4 top-4 rounded-full border border-gold/30 bg-black/42 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold backdrop-blur-lg">
            {product.badge}
          </span>
        ) : null}
        <button
          type="button"
          aria-label={`Favoritar ${product.name}`}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-black/36 text-white backdrop-blur-lg transition hover:border-gold/50 hover:text-gold"
        >
          <Heart size={17} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              {categoryLabels[product.category]}
            </p>
            <h3 className="mt-2 font-display text-2xl text-white">{product.name}</h3>
          </div>
          <strong className="whitespace-nowrap text-sm text-white">
            {formatCurrency(product.price)}
          </strong>
        </div>
        <p className="mt-3 min-h-12 text-sm leading-6 text-white/58">{product.description}</p>
        <button
          type="button"
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold uppercase tracking-[0.16em] text-black transition duration-300 hover:bg-gold"
        >
          <ShoppingBag size={17} />
          Comprar
        </button>
      </div>
    </motion.article>
  );
}
