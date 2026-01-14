import { useQuery } from "@tanstack/react-query";
import { fetchManufacturerProductById } from "@/lib/api/manufacturer/products";
import type { Product } from "@/types";

export function useManufacturerProductById(productId: string) {
  return useQuery<Product>({
    queryKey: ["manufacturer-product", productId],
    queryFn: async () => {
      const res = await fetchManufacturerProductById(productId);

      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to load product");
      }

      return res.data;
    },
    enabled: !!productId,
    staleTime: 60 * 1000 * 5,
  });
}
