import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Vestidos", slug: "vestidos" },
  { name: "Conjuntos", slug: "conjuntos" },
  { name: "Blusas", slug: "blusas" },
  { name: "Calças", slug: "calcas" },
  { name: "Acessórios", slug: "acessorios" }
];

const products = [
  {
    name: "Vestido Aurora",
    slug: "vestido-aurora",
    categorySlug: "vestidos",
    description: "Modelagem fluida em crepe acetinado com caimento editorial.",
    price: 489.9,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85"
  },
  {
    name: "Vestido Lumiere",
    slug: "vestido-lumiere",
    categorySlug: "vestidos",
    description: "Silhueta minimalista para noites especiais e eventos premium.",
    price: 629.9,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85"
  },
  {
    name: "Conjunto Riviera",
    slug: "conjunto-riviera",
    categorySlug: "conjuntos",
    description: "Alfaiataria leve com top estruturado e cintura marcada.",
    price: 559.9,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85"
  },
  {
    name: "Conjunto Noir",
    slug: "conjunto-noir",
    categorySlug: "conjuntos",
    description: "Duo monocromático sofisticado para uma presença impecável.",
    price: 599.9,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85"
  },
  {
    name: "Blusa Celine",
    slug: "blusa-celine",
    categorySlug: "blusas",
    description: "Cetim toque seda com gola elegante e acabamento delicado.",
    price: 239.9,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85"
  },
  {
    name: "Blusa Sienna",
    slug: "blusa-sienna",
    categorySlug: "blusas",
    description: "Peça versátil com brilho sutil e respirabilidade premium.",
    price: 219.9,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85"
  },
  {
    name: "Calça Viena",
    slug: "calca-viena",
    categorySlug: "calcas",
    description: "Pantalona de alfaiataria com cintura alta e linhas longas.",
    price: 349.9,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
  },
  {
    name: "Calça Serena",
    slug: "calca-serena",
    categorySlug: "calcas",
    description: "Textura macia, corte reto e acabamento de boutique.",
    price: 329.9,
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85"
  },
  {
    name: "Bolsa Cannes",
    slug: "bolsa-cannes",
    categorySlug: "acessorios",
    description: "Bolsa compacta com ferragens douradas e toque atemporal.",
    price: 399.9,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85"
  },
  {
    name: "Joias Signature",
    slug: "joias-signature",
    categorySlug: "acessorios",
    description: "Composição delicada para elevar produções minimalistas.",
    price: 189.9,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85"
  }
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category
    });
  }

  for (const product of products) {
    const sizes = product.categorySlug === "acessorios" ? ["Único"] : ["P", "M", "G"];
    const variants = sizes.map((size) => ({
      size,
      color: "Principal",
      stock: 5,
      sku: `${product.slug}-${slugify(size)}`
    }));

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        category: {
          connect: {
            slug: product.categorySlug
          }
        },
        images: {
          deleteMany: {},
          create: {
            imageUrl: product.image,
            alt: product.name,
            isMain: true,
            position: 0
          }
        },
        variants: {
          upsert: variants.map((variant) => ({
            where: { sku: variant.sku },
            update: {
              size: variant.size,
              color: variant.color,
              stock: variant.stock
            },
            create: variant
          }))
        }
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        category: {
          connect: {
            slug: product.categorySlug
          }
        },
        images: {
          create: {
            imageUrl: product.image,
            alt: product.name,
            isMain: true,
            position: 0
          }
        },
        variants: {
          create: variants
        }
      }
    });
  }
}

function slugify(value) {
  return value
    .trim()
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
