import type { Prisma } from "@prisma/client";
import {
  isRecord,
  optionalArray,
  optionalBoolean,
  optionalDecimal,
  optionalInteger,
  optionalString,
  requiredDecimal,
  requiredString,
  ValidationError
} from "@/lib/api-validation";
import { slugify } from "@/lib/slug";

export function buildProductCreateInput(body: Record<string, unknown>) {
  const name = requiredString(body, "name");
  const slug = optionalString(body, "slug") ?? slugify(name);
  const description = requiredString(body, "description");

  if (!slug) {
    throw new ValidationError("slug is required.");
  }

  const images = parseImages(body);
  const variants = parseVariants(body);

  return {
    name,
    slug,
    description,
    price: requiredDecimal(body.price, "price"),
    promotionalPrice: optionalDecimal(body.promotionalPrice, "promotionalPrice"),
    isActive: optionalBoolean(body, "isActive") ?? true,
    category: resolveCategoryCreateRelation(body),
    images: images.length ? { create: images } : undefined,
    variants: variants.length ? { create: variants } : undefined
  } satisfies Prisma.ProductCreateInput;
}

export function buildProductUpdateInput(body: Record<string, unknown>) {
  const data: Prisma.ProductUpdateInput = {};

  if ("name" in body) {
    data.name = requiredString(body, "name");
  }

  if ("slug" in body) {
    const slug = requiredString(body, "slug");
    data.slug = slug;
  }

  if ("description" in body) {
    data.description = requiredString(body, "description");
  }

  if ("price" in body) {
    data.price = requiredDecimal(body.price, "price");
  }

  if ("promotionalPrice" in body) {
    data.promotionalPrice =
      body.promotionalPrice === null || body.promotionalPrice === ""
        ? null
        : optionalDecimal(body.promotionalPrice, "promotionalPrice");
  }

  if ("isActive" in body) {
    data.isActive = optionalBoolean(body, "isActive") ?? true;
  }

  if (
    "categoryId" in body ||
    "categorySlug" in body ||
    "categoryName" in body
  ) {
    data.category = resolveCategoryUpdateRelation(body);
  }

  if ("images" in body) {
    data.images = {
      deleteMany: {},
      create: parseImages(body)
    };
  }

  if ("variants" in body) {
    data.variants = {
      deleteMany: {},
      create: parseVariants(body)
    };
  }

  return data;
}

function resolveCategoryCreateRelation(
  body: Record<string, unknown>
): Prisma.CategoryCreateNestedOneWithoutProductsInput | undefined {
  const categoryId = optionalString(body, "categoryId");
  const categorySlug = optionalString(body, "categorySlug");
  const categoryName = optionalString(body, "categoryName");

  if (categoryId) {
    return {
      connect: {
        id: categoryId
      }
    };
  }

  if (categorySlug && categoryName) {
    return {
      connectOrCreate: {
        where: {
          slug: categorySlug
        },
        create: {
          name: categoryName,
          slug: categorySlug
        }
      }
    };
  }

  if (categoryName) {
    const slug = slugify(categoryName);

    return {
      connectOrCreate: {
        where: {
          slug
        },
        create: {
          name: categoryName,
          slug
        }
      }
    };
  }

  if (categorySlug) {
    return {
      connect: {
        slug: categorySlug
      }
    };
  }

  return undefined;
}

function resolveCategoryUpdateRelation(
  body: Record<string, unknown>
): Prisma.CategoryUpdateOneWithoutProductsNestedInput {
  const categoryId = optionalString(body, "categoryId");
  const categorySlug = optionalString(body, "categorySlug");
  const categoryName = optionalString(body, "categoryName");

  if (categoryId) {
    return {
      connect: {
        id: categoryId
      }
    };
  }

  if (categorySlug && categoryName) {
    return {
      connectOrCreate: {
        where: {
          slug: categorySlug
        },
        create: {
          name: categoryName,
          slug: categorySlug
        }
      }
    };
  }

  if (categoryName) {
    const slug = slugify(categoryName);

    return {
      connectOrCreate: {
        where: {
          slug
        },
        create: {
          name: categoryName,
          slug
        }
      }
    };
  }

  if (categorySlug) {
    return {
      connect: {
        slug: categorySlug
      }
    };
  }

  return {
    disconnect: true
  };
}

function parseImages(body: Record<string, unknown>): Prisma.ProductImageCreateWithoutProductInput[] {
  return optionalArray(body, "images").map((item, index) => {
    if (!isRecord(item)) {
      throw new ValidationError("Each image must be an object.");
    }

    return {
      imageUrl: requiredString(item, "imageUrl"),
      alt: optionalString(item, "alt"),
      isMain: optionalBoolean(item, "isMain") ?? index === 0,
      position: optionalInteger(item, "position") ?? index
    };
  });
}

function parseVariants(
  body: Record<string, unknown>
): Prisma.ProductVariantCreateWithoutProductInput[] {
  return optionalArray(body, "variants").map((item) => {
    if (!isRecord(item)) {
      throw new ValidationError("Each variant must be an object.");
    }

    return {
      size: requiredString(item, "size"),
      color: requiredString(item, "color"),
      stock: optionalInteger(item, "stock") ?? 0,
      sku: requiredString(item, "sku")
    };
  });
}
