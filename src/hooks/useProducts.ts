import { products, Product } from "@/data/products";

export type { Product };

export const useProducts = (filters?: { category?: string; gender?: string; featured?: boolean }) => {
  let filteredProducts = [...products];

  if (filters?.category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase() === filters.category?.toLowerCase()
    );
  }
  if (filters?.gender) {
    filteredProducts = filteredProducts.filter(p => 
      p.gender === filters.gender || p.gender === "unisex"
    );
  }
  if (filters?.featured) {
    filteredProducts = filteredProducts.filter(p => p.featured);
  }

  return {
    data: filteredProducts,
    isLoading: false,
    error: null,
  };
};

export const useProduct = (id: string) => {
  const product = products.find(p => p.id === id) || null;

  return {
    data: product,
    isLoading: false,
    error: null,
  };
};
