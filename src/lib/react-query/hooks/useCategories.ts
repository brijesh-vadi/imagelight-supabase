"use client";

import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await getAdminCategories();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch categories");
      }
      return result.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
