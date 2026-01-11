"use client";

import { useQuery } from "@tanstack/react-query";
import { getManufacturerUsedCategories } from "@/actions/manufacturer/category.action";

export function useManufacturerUsedCategories() {
  return useQuery({
    queryKey: ["manufacturer-used-categories"],
    queryFn: async () => {
      const result = await getManufacturerUsedCategories();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch categories");
      }
      return result.data?.categories ?? [];
    },
    staleTime: 1 * 60 * 1000, // 1 minute - shorter since it changes when products are added
  });
}
