import type { Product, ProductCategory } from "@/types/product";

export const categories: Array<{ id: ProductCategory | "todos"; label: string }> = [
  { id: "todos", label: "Tudo" },
  { id: "vestidos", label: "Vestidos" },
  { id: "conjuntos", label: "Conjuntos" },
  { id: "blusas", label: "Blusas" },
  { id: "calcas", label: "Calças" },
  { id: "acessorios", label: "Acessórios" }
];

export const products: Product[] = [
  {
    id: "vestido-aurora",
    name: "Vestido Aurora",
    category: "vestidos",
    description: "Modelagem fluida em crepe acetinado com caimento editorial.",
    price: 489.9,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85",
    badge: "Best seller"
  },
  {
    id: "vestido-lumiere",
    name: "Vestido Lumiere",
    category: "vestidos",
    description: "Silhueta minimalista para noites especiais e eventos premium.",
    price: 629.9,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85",
    badge: "Novo"
  },
  {
    id: "conjunto-riviera",
    name: "Conjunto Riviera",
    category: "conjuntos",
    description: "Alfaiataria leve com top estruturado e cintura marcada.",
    price: 559.9,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85"
  },
  {
    id: "conjunto-noir",
    name: "Conjunto Noir",
    category: "conjuntos",
    description: "Duo monocromático sofisticado para uma presença impecável.",
    price: 599.9,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85",
    badge: "Premium"
  },
  {
    id: "blusa-celine",
    name: "Blusa Celine",
    category: "blusas",
    description: "Cetim toque seda com gola elegante e acabamento delicado.",
    price: 239.9,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85"
  },
  {
    id: "blusa-sienna",
    name: "Blusa Sienna",
    category: "blusas",
    description: "Peça versátil com brilho sutil e respirabilidade premium.",
    price: 219.9,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85"
  },
  {
    id: "calca-viena",
    name: "Calça Viena",
    category: "calcas",
    description: "Pantalona de alfaiataria com cintura alta e linhas longas.",
    price: 349.9,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
    badge: "Essencial"
  },
  {
    id: "calca-serena",
    name: "Calça Serena",
    category: "calcas",
    description: "Textura macia, corte reto e acabamento de boutique.",
    price: 329.9,
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85"
  },
  {
    id: "bolsa-cannes",
    name: "Bolsa Cannes",
    category: "acessorios",
    description: "Bolsa compacta com ferragens douradas e toque atemporal.",
    price: 399.9,
    image:
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=1200&q=85"
  },
  {
    id: "joias-signature",
    name: "Joias Signature",
    category: "acessorios",
    description: "Composição delicada para elevar produções minimalistas.",
    price: 189.9,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85",
    badge: "Limitado"
  }
];
