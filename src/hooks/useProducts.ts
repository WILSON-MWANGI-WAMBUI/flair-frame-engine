import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price_cents: number;
  currency: string;
  stock: number;
  reserved: number;
  images: any;
  category: string | null;
  gender: string | null;
  sizes: string[];
  colors: string[];
  featured: boolean;
}

export const useProducts = (filters?: { category?: string; gender?: string; featured?: boolean }) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      let query = supabase.from("products").select("*");

      if (filters?.category) {
        query = query.eq("category", filters.category);
      }
      if (filters?.gender) {
        query = query.eq("gender", filters.gender);
      }
      if (filters?.featured) {
        query = query.eq("featured", filters.featured);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Product | null;
    },
  });
};
