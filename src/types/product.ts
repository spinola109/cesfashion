export type ProductCategory =
  | "vestidos"
  | "conjuntos"
  | "blusas"
  | "calcas"
  | "acessorios";

export type ProductCategoryOption = {
  id: ProductCategory | string;
  label: string;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory | string;
  categoryLabel?: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
};
