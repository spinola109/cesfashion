"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { categories, products } from "@/data/products";
import { mapApiCategory, mapApiProduct } from "@/lib/catalog-mappers";
import { cn } from "@/lib/utils";
import type { Product, ProductCategoryOption } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";
import { Reveal } from "@/components/ui/Reveal";
import { useShop } from "@/providers/ShopProvider";

type ActiveCategory = string | "todos";

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("todos");
  const [isLoading, setIsLoading] = useState(true);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(products);
  const [categoryOptions, setCategoryOptions] = useState<ProductCategoryOption[]>(categories);
  const { searchQuery, setSearchQuery } = useShop();

  useEffect(() => {
    let shouldIgnore = false;

    async function loadCatalog() {
      setIsLoading(true);

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
          setCatalogProducts(apiProducts.map(mapApiProduct));
        }

        if (apiCategories.length) {
          setCategoryOptions([{ id: "todos", label: "Tudo" }, ...apiCategories.map(mapApiCategory)]);
        }
      } catch {
        if (!shouldIgnore) {
          setCatalogProducts(products);
          setCategoryOptions(categories);
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoading(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      shouldIgnore = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeSearch(searchQuery);
    const baseProducts =
      activeCategory === "todos" || normalizedQuery
        ? catalogProducts
        : catalogProducts.filter((product) => product.category === activeCategory);

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
  }, [activeCategory, catalogProducts, searchQuery]);

  function handleCategoryChange(category: ActiveCategory) {
    setActiveCategory(category);
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 260);
  }

  return (
    <section id="produtos" className="bg-pearl px-5 py-14 text-ink-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col gap-6 border-b border-ink-900/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-oxblood">
                Catálogo
              </p>
              <h2 className="mt-3 font-display text-4xl leading-tight text-ink-900 md:text-5xl">
                Produtos em destaque
              </h2>
              <p className="mt-4 text-sm leading-7 text-ink-700/70 md:text-base">
                Uma vitrine mais objetiva para comparar categorias, preços e estilos sem
                precisar passar por blocos institucionais.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-ink-900/10 bg-white px-4 py-3 text-sm text-ink-700 shadow-[0_14px_38px_rgba(36,30,22,0.08)]">
              <SlidersHorizontal size={17} className="text-oxblood" />
              <span>
                {filteredProducts.length} de {catalogProducts.length} peças
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="luxury-scrollbar mt-7 flex gap-3 overflow-x-auto pb-3">
            {categoryOptions.map((category) => {
              const categoryCount =
                category.id === "todos"
                  ? catalogProducts.length
                  : catalogProducts.filter((product) => product.category === category.id).length;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category.id)}
                  className={cn(
                    "min-w-fit rounded-full border px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition duration-300",
                    activeCategory === category.id
                      ? "border-ink-900 bg-ink-900 text-white shadow-[0_16px_36px_rgba(0,0,0,0.18)]"
                      : "border-ink-900/10 bg-white text-ink-700 hover:border-oxblood/40 hover:text-oxblood"
                  )}
                >
                  {category.label}
                  <span
                    className={cn(
                      "ml-2 rounded-full px-2 py-0.5 text-[11px]",
                      activeCategory === category.id ? "bg-white/10" : "bg-ink-900/5"
                    )}
                  >
                    {categoryCount}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {searchQuery.trim() ? (
          <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-lg border border-oxblood/20 bg-white px-5 py-4 text-sm text-ink-700 shadow-[0_14px_36px_rgba(36,30,22,0.08)] sm:flex-row sm:items-center">
            <span className="inline-flex items-center gap-2">
              <Search size={16} className="text-oxblood" />
              Busca por{" "}
              <strong className="font-semibold text-oxblood">
                &quot;{searchQuery.trim()}&quot;
              </strong>
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="rounded-full border border-ink-900/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-700 transition hover:border-oxblood/40 hover:text-oxblood"
            >
              Limpar busca
            </button>
          </div>
        ) : null}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="mt-8 rounded-lg border border-ink-900/10 bg-white px-6 py-12 text-center shadow-[0_16px_42px_rgba(36,30,22,0.08)]">
            <p className="font-display text-3xl text-ink-900">Nenhuma peça encontrada</p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink-700/70">
              Tente buscar pelo início do nome do produto ou limpe a busca para voltar ao
              catálogo completo.
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
