"use client";

import { useQuery } from "@tanstack/react-query";
import { getManufacturerProducts } from "@/actions/manufacturer/product.action";

interface UseProductsParams {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  unitId?: string;
  isActive?: string;
}

export function useProducts({
  page,
  limit,
  search,
  categoryId,
  unitId,
  isActive,
}: UseProductsParams) {
  return useQuery({
    queryKey: ["products", page, limit, search, categoryId, unitId, isActive],
    queryFn: async () => {
      const result = await getManufacturerProducts({
        page,
        limit,
        search,
        categoryId,
        unitId,
        isActive,
      });
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch products");
      }
      return result.data;
    },
  });
}
