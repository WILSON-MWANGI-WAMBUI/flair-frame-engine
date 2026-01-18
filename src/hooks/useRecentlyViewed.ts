import { useState, useEffect, useCallback } from "react";
import { products, Product } from "@/data/products";

const STORAGE_KEY = "recently_viewed_products";
const MAX_ITEMS = 8;

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const ids: string[] = JSON.parse(stored);
      const viewedProducts = ids
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => p !== undefined);
      setRecentlyViewed(viewedProducts);
    }
  }, []);

  const addToRecentlyViewed = useCallback((productId: string) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let ids: string[] = stored ? JSON.parse(stored) : [];
    
    // Remove if already exists, then add to front
    ids = ids.filter((id) => id !== productId);
    ids.unshift(productId);
    
    // Keep only MAX_ITEMS
    ids = ids.slice(0, MAX_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    
    const viewedProducts = ids
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined);
    setRecentlyViewed(viewedProducts);
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentlyViewed([]);
  }, []);

  return { recentlyViewed, addToRecentlyViewed, clearRecentlyViewed };
};

