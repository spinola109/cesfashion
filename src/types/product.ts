export type ProductCategory =
  | "vestidos"
  | "conjuntos"
  | "blusas"
  | "calcas"
  | "acessorios";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  image: string;
  badge?: string;
};
