"use client";

import { useQuery } from "@tanstack/react-query";
import { getDealerProducts } from "@/actions/dealer/product.action";

interface UseProductsParams {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  unitId?: string;
  isActive?: string;
}

export function useDealerProducts({
  page,
  limit,
  search,
  categoryId,
  unitId,
  isActive,
}: UseProductsParams) {
  return useQuery({
    queryKey: [
      "dealer-products",
      page,
      limit,
      search,
      categoryId,
      unitId,
      isActive,
    ],
    queryFn: async () => {
      const result = await getDealerProducts({
        page,
        limit,
        search,
        categoryId,
        unitId,
      });
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch products");
      }
      return result.data;
    },
  });
}
