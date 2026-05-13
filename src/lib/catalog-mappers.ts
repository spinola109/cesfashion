import type { Product, ProductCategoryOption } from "@/types/product";

type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  productsCount?: number;
};

type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  promotionalPrice: number | null;
  isActive: boolean;
  category: ApiCategory | null;
  images: Array<{
    imageUrl: string;
    isMain: boolean;
    position: number;
  }>;
};

export function mapApiCategory(category: ApiCategory): ProductCategoryOption {
  return {
    id: category.slug,
    label: category.name
  };
}

export function mapApiProduct(product: ApiProduct): Product {
  const mainImage =
    product.images.find((image) => image.isMain)?.imageUrl ??
    product.images.sort((a, b) => a.position - b.position)[0]?.imageUrl ??
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85";

  return {
    id: product.id,
    name: product.name,
    category: product.category?.slug ?? "sem-categoria",
    categoryLabel: product.category?.name ?? "Sem categoria",
    description: product.description,
    price: product.promotionalPrice ?? product.price,
    originalPrice: product.promotionalPrice ? product.price : undefined,
    image: mainImage,
    badge: product.isActive ? undefined : "Inativo"
  };
}
