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

type ActiveCategory = ProductCategory | "todos";

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("todos");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "todos") {
      return products;
    }

    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

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
      </div>
    </section>
  );
}
