"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/actions/manufacturer/category.action";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await getCategories();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch categories");
      }
      return result.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
