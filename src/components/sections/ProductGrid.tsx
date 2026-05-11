"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { categories, products } from "@/data/products";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useShop } from "@/providers/ShopProvider";

type ActiveCategory = ProductCategory | "todos";

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("todos");
  const [isLoading, setIsLoading] = useState(true);
  const { searchQuery, setSearchQuery } = useShop();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeSearch(searchQuery);
    const baseProducts =
      activeCategory === "todos" || normalizedQuery
        ? products
        : products.filter((product) => product.category === activeCategory);

    if (!normalizedQuery) {
      return baseProducts;
    }

    return baseProducts.filter((product) => {
      const normalizedName = normalizeSearch(product.name);
      const nameWords = normalizedName.split(" ");

      return (
        normalizedName.startsWith(normalizedQuery) ||
        nameWords.some((word) => word.startsWith(normalizedQuery))
      );
    });
  }, [activeCategory, searchQuery]);

  function handleCategoryChange(category: ActiveCategory) {
    setActiveCategory(category);
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 260);
  }

  return (
    <section id="produtos" className="bg-ink-950 px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading eyebrow="Coleção premium" title="Peças para vestir presença">
            Seleção criada para rotinas sofisticadas, eventos especiais e combinações
            que permanecem impecáveis da manhã à noite.
          </SectionHeading>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="luxury-scrollbar mt-10 flex gap-3 overflow-x-auto pb-3 md:justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  "min-w-fit rounded-full border px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] transition duration-300",
                  activeCategory === category.id
                    ? "border-gold bg-gold text-black shadow-gold-soft"
                    : "border-white/10 bg-white/[0.04] text-white/64 hover:border-gold/40 hover:text-gold"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </Reveal>

        {searchQuery.trim() ? (
          <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-gold/20 bg-gold/10 px-5 py-4 text-sm text-white/72 sm:flex-row sm:items-center">
            <span>
              Busca ativa por{" "}
              <strong className="font-semibold text-gold">
                &quot;{searchQuery.trim()}&quot;
              </strong>
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:border-gold/50 hover:text-gold"
            >
              Limpar busca
            </button>
          </div>
        ) : null}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ProductSkeleton />
                  </motion.div>
                ))
              : filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </AnimatePresence>
        </div>
        {!isLoading && filteredProducts.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center">
            <p className="font-display text-3xl text-white">Nenhuma peça encontrada</p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/56">
              Tente buscar pelo início do nome do produto ou limpe a busca para voltar à
              coleção completa.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function normalizeSearch(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
