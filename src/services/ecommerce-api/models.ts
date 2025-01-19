export type Product = unknown;

export type ProductResponse = {
  count: number;
  total: number;
  products: Product[];
};

export type ProductRequest = {
  minPrice?: number;
  maxPrice?: number;
};
