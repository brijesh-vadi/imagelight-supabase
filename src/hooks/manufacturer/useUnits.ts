"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUnits } from "@/lib/api/manufacturer/units";
import type { Unit } from "@/types";

export const useUnits = () => {
  return useQuery<Unit[]>({
    queryKey: ["manufacturer-units"],
    queryFn: async () => {
      const res = await fetchUnits();

      if (!res.success) {
        throw new Error(res.message);
      }

      return res.data;
    },
    staleTime: 60 * 2000,
  });
};
