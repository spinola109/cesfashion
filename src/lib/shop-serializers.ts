import type { Prisma } from "@prisma/client";

export const productInclude = {
  category: true,
  images: {
    orderBy: [{ isMain: "desc" }, { position: "asc" }]
  },
  variants: {
    orderBy: [{ color: "asc" }, { size: "asc" }]
  }
} satisfies Prisma.ProductInclude;

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

export function serializeProduct(product: ProductWithRelations) {
  return {
    ...product,
    price: Number(product.price),
    promotionalPrice:
      product.promotionalPrice === null ? null : Number(product.promotionalPrice)
  };
}

export function serializeCategoryWithCount(
  category: Prisma.CategoryGetPayload<{
    include: { _count: { select: { products: true } } };
  }>
) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    productsCount: category._count.products
  };
}
