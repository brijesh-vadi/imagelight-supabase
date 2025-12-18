"use client";

import { useQuery } from "@tanstack/react-query";
import { getUnits } from "@/actions/manufacturer/unit.action";

export function useUnits() {
  return useQuery({
    queryKey: ["units"],
    queryFn: async () => {
      const result = await getUnits();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch units");
      }
      return result.data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
