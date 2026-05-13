"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { categories, products } from "@/data/products";
import { mapApiCategory, mapApiProduct } from "@/lib/catalog-mappers";
import { formatCurrency } from "@/lib/utils";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import type { Product, ProductCategoryOption } from "@/types/product";

const featuredProducts = products.slice(0, 4);
const categoryLinks = categories.filter((category) => category.id !== "todos");

export function Hero() {
  const [heroProducts, setHeroProducts] = useState<Product[]>(featuredProducts);
  const [heroCategories, setHeroCategories] =
    useState<ProductCategoryOption[]>(categoryLinks);

  useEffect(() => {
    let shouldIgnore = false;

    async function loadHeroCatalog() {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/products?active=true"),
          fetch("/api/categories")
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Catalog API unavailable.");
        }

        const apiProducts = (await productsResponse.json()) as Parameters<typeof mapApiProduct>[0][];
        const apiCategories = (await categoriesResponse.json()) as Parameters<
          typeof mapApiCategory
        >[0][];

        if (shouldIgnore) {
          return;
        }

        if (apiProducts.length) {
          setHeroProducts(apiProducts.map(mapApiProduct).slice(0, 4));
        }

        if (apiCategories.length) {
          setHeroCategories(apiCategories.map(mapApiCategory).slice(0, 5));
        }
      } catch {
        if (!shouldIgnore) {
          setHeroProducts(featuredProducts);
          setHeroCategories(categoryLinks);
        }
      }
    }

    void loadHeroCatalog();

    return () => {
      shouldIgnore = true;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0c0a08] px-5 pb-10 pt-28 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(212,175,55,0.13),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_48%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-5 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <span className="inline-flex items-center gap-2 text-gold">
            <Sparkles size={16} />
            Novidades selecionadas para pronta entrega
          </span>
          <span>{heroProducts.length} peças em destaque</span>
        </div>

        <div className="grid items-end gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gold">
              C&S Fashion
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[0.98] text-pearl sm:text-6xl lg:text-7xl">
              Vitrine de moda feminina premium
            </h1>
            <p className="mt-5 text-base leading-7 text-white/70">
              Encontre vestidos, conjuntos, blusas e acessórios com uma navegação mais
              direta: menos apresentação, mais produto na tela.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <LuxuryButton href="#produtos">
                Ver produtos
                <ArrowRight size={17} />
              </LuxuryButton>
              <LuxuryButton href="/cart" variant="ghost">
                <ShoppingBag size={17} />
                Carrinho
              </LuxuryButton>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {heroCategories.map((category) => (
                <Link
                  key={category.id}
                  href="#produtos"
                  className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 transition hover:border-gold/45 hover:text-gold"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-3 sm:grid-cols-2"
          >
            {heroProducts.map((product, index) => (
              <Link
                key={product.id}
                href="#produtos"
                className="group relative min-h-[17rem] overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-noir"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority={index < 2}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 28vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                {product.badge ? (
                  <span className="absolute left-4 top-4 rounded-full border border-gold/35 bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur">
                    {product.badge}
                  </span>
                ) : null}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-gold">
                    {formatCurrency(product.price)}
                  </p>
                  <h2 className="mt-1 font-display text-2xl text-white">{product.name}</h2>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
